import * as ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import { Readable } from "stream";
import progressString from "./progress";

type mediaPath = string;

export interface IEncoderConfig {
    frameStream: Readable;
    output: mediaPath;
    backgroundVideo?: {
        videoPath: mediaPath;
        inSeconds: number;
        outSeconds: number;
    };
    fps: {
        input: number;
        output: number;
    };
}

type Encoder = (config: IEncoderConfig) => Promise<mediaPath>;

const encoder: Encoder = (config) => {
    return new Promise((resolve, reject) => {
        const { frameStream, output, backgroundVideo, fps } = config;
        // TODO: change this
        const dir = "./output";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const command = ffmpeg();

        if (backgroundVideo) {
            command.input(backgroundVideo.videoPath);
        }

        command.input(frameStream).inputFPS(fps.input);
        command.outputOptions([
            "-preset veryfast",
            "-crf 24",
            "-f mp4",
            "-movflags frag_keyframe+empty_moov",
            "-pix_fmt yuv420p",
        ]);
        command.fps(fps.output);

        if (backgroundVideo) {
            command.complexFilter(
                [
                    "[1:v]setpts=PTS+" + backgroundVideo.inSeconds + "/TB[out]",
                    {
                        filter: "overlay",
                        options: {
                            enable:
                                "between(t," +
                                backgroundVideo.outSeconds +
                                "," +
                                backgroundVideo.outSeconds +
                                ")",
                            x: "0",
                            y: "0",
                        },
                        inputs: "[0:v][out]",
                        outputs: "tmp",
                    },
                ],
                "tmp",
            );
        }

        command.output(output);

        command.on("start", function (commandLine) {
            // TODO: beautify
            console.log("Spawned Ffmpeg with command: " + commandLine);
        });

        command.on("end", function () {
            // TODO: beautify
            console.log("");
            console.log("Processing complete...");
            resolve(output);
        });
        command.on("progress", function (progress) {
            var percent = progress.percent
                ? parseFloat((progress.percent as number).toFixed(2))
                : 0;
            progressString(percent, 100, false);
            process.stdout.write(` Processing ${progressString(percent, 100, false)}\r`);
        });
        command.run();
    });
};

export default encoder;
