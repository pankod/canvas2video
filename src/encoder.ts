import * as ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as path from "path";
import * as cliProgress from "cli-progress";
import { Readable } from "stream";
import { Encoder } from "./types";

const progressBar = new cliProgress.SingleBar({
    format: `Processing | {bar} | {percentage}%`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
});

const typeCheck = (reject: (reason?: any) => void, config) => {
    const { frameStream, output, backgroundVideo, fps } = config;
    if (!(frameStream instanceof Readable)) {
        reject(
            new Error(`frameStream should be in type Readable. You provided ${typeof frameStream}`),
        );
    }
    if (!(typeof output === "string")) {
        reject(new Error(`output should be a string. You provided ${typeof output}`));
    }
    if (!(fps && fps.input && fps.output)) {
        reject(new Error(`fps should be an object with input and output properties`));
    }
    if (backgroundVideo) {
        const { inSeconds, videoPath, outSeconds } = backgroundVideo;
        if (
            typeof inSeconds !== "number" ||
            typeof outSeconds !== "number" ||
            typeof videoPath !== "string"
        ) {
            reject(new Error("backgroundVideo property is not correctly set"));
        }
    }
};

const createDir = (reject: (reason?: any) => void, silent: boolean, output: string) => {
    try {
        const outDir = path.dirname(output);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
    } catch (e) {
        if (!silent) console.log("Could not create/access output directory");
        reject(new Error("Cannot create/access output directory"));
    }
};

const createFilter = (backgroundVideo: { inSeconds: number; outSeconds: number }) => {
    const { inSeconds, outSeconds } = backgroundVideo;
    return [
        "[1:v]setpts=PTS+" + inSeconds + "/TB[out]",
        {
            filter: "overlay",
            options: {
                enable: "between(t," + inSeconds + "," + outSeconds + ")",
                x: "0",
                y: "0",
            },
            inputs: "[0:v][out]",
            outputs: "tmp",
        },
    ];
};

const percent: (percent?: number) => number = (percent) =>
    percent ? parseFloat((percent as number).toFixed(2)) : 0;

const outputOptions = [
    "-preset veryfast",
    "-crf 24",
    "-f mp4",
    "-vcodec libx264",
    "-movflags frag_keyframe+empty_moov",
    "-pix_fmt yuv420p",
];

const encoder: Encoder = (config) =>
    new Promise((resolve, reject) => {
        const { frameStream, output, backgroundVideo, fps, silent = true } = config;
        typeCheck(reject, config);
        createDir(reject, silent, output);

        const outputStream = fs.createWriteStream(output);
        const command = ffmpeg();

        if (backgroundVideo) command.input(backgroundVideo.videoPath);

        command.input(frameStream).inputFPS(fps.input);
        command.outputOptions(outputOptions);
        command.fps(fps.output);

        if (backgroundVideo) command.complexFilter(createFilter(backgroundVideo), "tmp");

        command.output(outputStream);

        command.on("start", () => {
            if (!silent) progressBar.start(100, 0);
        });

        command.on("end", () => {
            if (!silent) progressBar.stop();
            if (!silent) console.log("Processing complete...");
            resolve({ path: output, stream: outputStream });
        });

        command.on("progress", (progress) => {
            if (!silent) progressBar.update(percent(progress.percent));
        });

        command.on("error", (err: Error) => {
            if (!silent) console.log("An error occured while processing,", err.message);
            reject(new Error(err.message));
        });

        command.run();
    });

export default encoder;
