import * as ffmpeg from "fluent-ffmpeg";
import { fabric } from "fabric";
import gsap, { TimelineMax } from "gsap";
import { Readable } from "stream";
import * as cliProgress from "cli-progress";

import * as ffmpegPath from "ffmpeg-static";
import * as ffprobe from "ffprobe-static";
import { Renderer } from "./types";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobe.path);

const typeCheck = (reject: (reason?: any) => void, config: any) => {
    const { width, height, fps, makeScene } = config;
    if (!(typeof width === "number")) {
        reject(new Error(`width should be a number. You provided ${typeof width}`));
    }
    if (!(typeof height === "number")) {
        reject(new Error(`height should be a number. You provided ${typeof height}`));
    }
    if (!(typeof fps === "number")) {
        reject(new Error(`fps should be a number. You provided ${typeof fps}`));
    }
    if (!(typeof makeScene === "function")) {
        reject(new Error(`makeScene should be a function. You provided ${typeof makeScene}`));
    }
};

const progressBar = new cliProgress.SingleBar({
    format: `Rendering | {bar} | {percentage}%`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
});

const renderer: Renderer = (config) =>
    new Promise((resolve, reject) => {
        try {
            const { width, height, fps, makeScene, silent = true } = config;
            const canvas = new fabric.StaticCanvas(null, { width, height });
            const anim = new TimelineMax({ paused: true });
            const stream = new Readable();

            typeCheck(reject, config);

            let totalFrames: number;
            let currentFrame = 0;

            gsap.ticker.fps(fps);

            const renderFrames = () => {
                anim.progress(currentFrame++ / totalFrames);
                if (currentFrame <= totalFrames) {
                    if (!silent) progressBar.update(currentFrame);

                    canvas.renderAll();
                    const buffer = Buffer.from(
                        canvas.toDataURL().replace(/^data:\w+\/\w+;base64,/, ""),
                        "base64",
                    );
                    stream.push(buffer);
                    renderFrames();
                } else {
                    if (!silent) console.log("Rendering complete...");
                    if (!silent) progressBar.stop();
                    stream.push(null);
                    resolve(stream);
                }
            };

            makeScene(fabric, canvas, anim, () => {
                const duration = anim.duration();
                totalFrames = Math.max(1, Math.ceil((duration / 1) * fps));

                if (!silent) progressBar.start(totalFrames, 0);
                renderFrames();
            });
        } catch (e) {
            reject(new Error("An error occured in the renderer."));
        }
    });

export default renderer;
