import { renderer, encoder } from "@pankod/canvas2video";
import { Linear, Bounce } from "gsap";

const weatherJSON = [
    {
        day: "MON",
        maxTemp: 29,
        sky: "sunny",
    },
    {
        day: "TUE",
        maxTemp: 30,
        sky: "sunny",
    },
    {
        day: "WED",
        maxTemp: 28,
        sky: "partly_cloudy",
    },
    {
        day: "THU",
        maxTemp: 29,
        sky: "partly_cloudy",
    },
    {
        day: "FRI",
        maxTemp: 32,
        sky: "sunny",
    },
];

const weather = async () => {
    const stream = await renderer({
        silent: false,
        width: 1920,
        height: 1080,
        fps: 30,
        makeScene: async (fabric, canvas, anim, compose) => {
            const loadImage: (
                url: string,
                options?: fabric.IImageOptions,
            ) => Promise<fabric.Image> = async (url, options) => {
                return new Promise((resolve, reject) => {
                    fabric.Image.fromURL(
                        "file://" + __dirname + "/media/" + url,
                        (image) => {
                            resolve(image);
                        },
                        options,
                    );
                });
            };

            const run = async () => {
                /** Add Elements to Canvas */
                const background = new fabric.Rect({
                    left: 348,
                    top: 184,
                    fill: "464646",
                    width: 1225,
                    height: 713,
                    opacity: 0.3,
                    rx: 10,
                    ry: 10,
                });
                canvas.add(background);

                const title = new fabric.Textbox("ISTANBUL", {
                    left: 463,
                    top: 273,
                    width: 1000,
                    fill: "#fff",
                    fontFamily: "OpenSans",
                    fontSize: 48,
                    textAlign: "left",
                    fontWeight: "bold",
                });
                canvas.add(title);

                const titleLine = new fabric.Line([0, 0, 1000, 0], {
                    left: 463,
                    top: 330,
                    stroke: "#fff",
                    strokeWidth: 2,
                });
                canvas.add(titleLine);

                const days: Array<fabric.Textbox> = [],
                    temps: Array<fabric.Textbox> = [],
                    icons: Array<fabric.Image> = [],
                    seperators: Array<fabric.Line> = [];

                for (let i = 0; i < weatherJSON.length; i++) {
                    const w = weatherJSON[i];

                    // Days
                    days.push(
                        new fabric.Textbox(w.day, {
                            left: 500 + i * 160,
                            top: 441,
                            width: 167,
                            fill: "#fff",
                            fontFamily: "OpenSans",
                            fontSize: 30,
                            textAlign: "center",
                        }),
                    );

                    canvas.add(days[i]);

                    // Temperatures
                    temps.push(
                        new fabric.Textbox(w.maxTemp + "°", {
                            left: 525 + i * 160,
                            top: 594,
                            width: 134,
                            fill: "#fff",
                            fontFamily: "OpenSans",
                            fontSize: 64,
                            textAlign: "center",
                        }),
                    );

                    canvas.add(temps[i]);

                    // Seperators
                    seperators.push(
                        new fabric.Line([0, 0, 0, 264], {
                            left: 665 + i * 160,
                            top: 428,
                            stroke: "#fff",
                            strokeWidth: 2,
                        }),
                    );

                    if (i != 4) {
                        canvas.add(seperators[i]);
                    }

                    // Icons
                    const icon = await loadImage(w.sky + ".png", {
                        left: 580 + i * 160,
                        top: 540,
                        originX: "center",
                        originY: "center",
                        scaleX: 0.9,
                        scaleY: 0.9,
                    });

                    icons.push(icon);

                    canvas.add(icons[i]);
                }

                /** Animation Sequence */

                /** Animation: Background in */
                anim.from([background], 0.5, {
                    ease: Linear.easeOut,
                    opacity: 0,
                    left: -300,
                    width: 0,
                });
                /** Animation: Title in */
                anim.from([title, titleLine], 0.5, { opacity: 0 });

                /** Animation: Weather info in */
                weatherJSON.forEach((_, i) => {
                    anim.from(
                        [seperators[i], days[i], temps[i]],
                        0.3,
                        { left: 200, opacity: 0 },
                        "-=" + i * 0.05,
                    );
                });

                /** Animation: Weather icons in */
                anim.from(
                    icons,
                    1.0,
                    { ease: Linear.easeOut, scaleX: 0.0001, scaleY: 0.0001 },
                    "-=0.5",
                );

                /** Animation: Weather icons out */
                anim.to(icons, 1, { ease: Linear.easeOut, scaleX: 1.05, scaleY: 1.005 });
                anim.to(icons, 1, { ease: Linear.easeOut, scaleX: 1.0, scaleY: 1.0 });
                anim.to(icons, 1.0, { ease: Bounce.easeOut, scaleX: 0.0001, scaleY: 0.0001 });

                /** Animation: Weather info out */
                weatherJSON.forEach((_, i) => {
                    anim.to(
                        [seperators[i], days[i], temps[i]],
                        0.3,
                        { left: 200, opacity: 0 },
                        "-=" + i * 0.05,
                    );
                });

                /** Animation: Title out */
                anim.to([title, titleLine], 0.5, { opacity: 0 });

                /** Animation Background out */
                anim.to([background], 0.5, {
                    ease: Linear.easeOut,
                    opacity: 0,
                    width: 0,
                    left: -300,
                });

                compose();
            };

            run();
        },
    });

    const result = await encoder({
        silent: false,
        frameStream: stream,
        backgroundVideo: {
            videoPath: "src/media/clouds.mp4",
            inSeconds: 1.5,
            outSeconds: 10,
        },
        output: "output/weather.mp4",
        fps: {
            input: 30,
            output: 30,
        },
    });

    console.log("done");
    console.log("filepath", result.path);
};

weather();
