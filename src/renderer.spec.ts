import { Power3 } from "gsap";
import renderer from "./renderer";

describe("encoder function tests", () => {
    it("resolves with correct parameters", async () => {
        const stream = renderer({
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

        expect(stream).resolves.toHaveProperty("constructor");
        expect((await stream).constructor.name).toBe("Readable");
    });

    it("logs the progress into console when silent is false", async () => {
        const mockedLog = jest.fn();
        console.log = mockedLog;
        const stream = renderer({
            silent: false,
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

        expect(stream).resolves.toHaveProperty("constructor");
        expect(mockedLog).toHaveBeenCalled();
        expect((await stream).constructor.name).toBe("Readable");
    });

    it("rejects with false parameters", () => {
        const streamW = renderer({
            width: undefined,
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
        const streamH = renderer({
            width: 1920,
            height: undefined,
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
        const streamF = renderer({
            width: 1920,
            height: 1080,
            fps: undefined,
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
        const streamM = renderer({
            width: 1920,
            height: 1080,
            fps: 30,
            makeScene: undefined,
        });

        expect(streamW).rejects.toMatchObject(
            new Error("width should be a number. You provided undefined"),
        );
        expect(streamH).rejects.toMatchObject(
            new Error("height should be a number. You provided undefined"),
        );
        expect(streamF).rejects.toMatchObject(
            new Error("fps should be a number. You provided undefined"),
        );
        expect(streamM).rejects.toMatchObject(
            new Error("makeScene should be a function. You provided undefined"),
        );
    });
});
