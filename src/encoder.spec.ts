import { Power3 } from "gsap";
import encoder from "./encoder";
import renderer from "./renderer";

describe("encoder function tests", () => {
    let stream;

    beforeAll(async () => {
        stream = await renderer({
            width: 1920,
            height: 1080,
            fps: 30,
            makeScene: (fabric, canvas, anim, compose) => {
                const text = new fabric.Text("Hello world", {
                    left: 200,
                    top: 400,
                    fontSize: 100,
                    fill: "#f99339",
                    angle: 0,
                });
                canvas.add(text);
                anim.to(text, { duration: 1, left: 400, angle: 360, ease: Power3.easeOut });
                compose();
            },
        });
    });

    it("resolves when frameStream is a Readable stream", async () => {
        const output = encoder({
            frameStream: stream,
            output: "test/output/test.mp4",
            fps: { input: 30, output: 30 },
        });
        expect(output).resolves.toHaveProperty("path");
        expect(output).resolves.toHaveProperty("stream");
    });

    it("logs if silent is false", async () => {
        const mockedLog = jest.fn();
        console.log = mockedLog;
        const output = encoder({
            silent: false,
            frameStream: stream,
            output: "test/output/test.mp4",
            fps: { input: 30, output: 30 },
        }).then(() => {
            expect(mockedLog).toHaveBeenCalled();
        });
    });

    it("reject when no frameStream is present", async () => {
        return expect(
            encoder({
                frameStream: undefined,
                output: "test/output/test.mp4",
                fps: { input: 30, output: 30 },
            }),
        ).rejects.toMatchObject(
            new Error("frameStream should be in type Readable. You provided undefined"),
        );
    });

    it("throws when ffmpeg fails", async () => {
        const output = encoder({
            frameStream: stream,
            output: "test/output/test.mp4",
            fps: { input: -30, output: -30 },
        });
        expect(output).rejects.toThrow();
    });

    it("throws correct error message when output is not correctly send", async () => {
        const output = encoder({
            frameStream: stream,
            output: undefined,
            fps: { input: 30, output: 30 },
        });
        expect(output).rejects.toMatchObject(
            new Error("output should be a string. You provided undefined"),
        );
    });

    it("throws correct error message when fps is not correctly send", async () => {
        const output = encoder({
            frameStream: stream,
            output: "test/output/demo.mp4",
            fps: undefined,
        });
        expect(output).rejects.toMatchObject(
            new Error("fps should be an object with input and output properties"),
        );
    });

    it("throws correct error message when backgroundVideo is not correctly send", async () => {
        const output = encoder({
            frameStream: stream,
            output: "test/output/demo.mp4",
            fps: { input: 30, output: 30 },
            backgroundVideo: {
                videoPath: "test/output/base.mp4",
                inSeconds: undefined,
                outSeconds: undefined,
            },
        });
        expect(output).rejects.toMatchObject(
            new Error("backgroundVideo property is not correctly set"),
        );
    });
});
