import { renderer, encoder } from "@pankod/canvas2video";
import { Power3 } from "gsap";

const helloWorld = async () => {
    try {
        const stream = await renderer({
            silent: false,
            width: 1920,
            height: 1080,
            fps: 30,
            makeScene: (fabric, canvas, anim, compose) => {
                const text = new fabric.Text("Hello world", {
                    left: 400,
                    top: 400,
                    fontSize: 100,
                    fill: "#f99339",
                    angle: 0,
                });
                canvas.add(text);
                anim.to(text, {
                    duration: 1,
                    angle: 360,
                    ease: Power3.easeOut,
                });
                compose();
            },
        });

        const output = await encoder({
            silent: false,
            frameStream: stream,
            output: "output/hello-world.mp4",
            fps: {
                input: 30,
                output: 30,
            },
        });
        console.log("process done,", output.path);
    } catch (e) {
        console.log("error", e);
    }
};

helloWorld();
