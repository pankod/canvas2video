import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { fabric } from "fabric";
import gsap, { TimelineMax } from "gsap";
import { Readable } from "stream";
import progressString from "./progress";

// TODO: add declarations
import * as ffmpegPath from "ffmpeg-static";
import * as ffprobe from "ffprobe-static";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

type makeSceneFunction = (
    fabricInstance: typeof fabric,
    canvas: fabric.StaticCanvas,
    anim: TimelineMax,
    compose: () => void,
) => void;

export interface IRendererConfig {
    width: number;
    height: number;
    fps: number;
    makeScene: makeSceneFunction;
}

type Renderer = (config: IRendererConfig) => Promise<Readable>;

const renderer: Renderer = (config) => {
    return new Promise<Readable>((resolve, reject) => {
        const { width, height, fps, makeScene } = config;
        const canvas = new fabric.StaticCanvas(null, { width, height });
        const anim = new TimelineMax({ paused: true });
        const stream = new Readable();

        let totalFrames: number;
        let currentFrame = 0;

        gsap.ticker.fps(fps);

        const renderFrames = () => {
            anim.progress(currentFrame++ / totalFrames);
            if (currentFrame <= totalFrames) {
                process.stdout.write(`Rendering ${progressString(currentFrame, totalFrames)}\r`);
                canvas.renderAll();
                const buffer = Buffer.from(
                    canvas.toDataURL().replace(/^data:\w+\/\w+;base64,/, ""),
                    "base64",
                );
                stream.push(buffer);
                renderFrames();
            } else {
                console.log("Rendering complete...");
                stream.push(null);
                resolve(stream);
            }
        };

        makeScene(fabric, canvas, anim, () => {
            const duration = anim.duration();
            totalFrames = Math.ceil((duration / 1) * fps);

            if (totalFrames === 0) {
                totalFrames = 1;
            }
            renderFrames();
        });
    });
};

export default renderer;
