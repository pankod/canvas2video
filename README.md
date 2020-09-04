<div align="center">
 <img src="media/pankod.png" width="350">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

<br/>
<div align="center"> <h3><b>@pankod/canvas2video</b></h3> </div>

<div align="center">Create dynamic, data-driven videos on the fly.</div>
<br/>
<div align="center">

[![Maintainability](https://api.codeclimate.com/v1/badges/ce77e17d733e937fbf3b/maintainability)](https://codeclimate.com/github/pankod/canvas2video/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ce77e17d733e937fbf3b/test_coverage)](https://codeclimate.com/github/pankod/canvas2video/test_coverage)
[![npm version](https://img.shields.io/npm/v/@pankod/canvas2video.svg)](https://www.npmjs.com/package/@pankod/canvas2video)
![npm](https://img.shields.io/npm/dw/@pankod/canvas2video)
[![dependencies Status](https://david-dm.org/pankod/canvas2video/status.svg)](https://david-dm.org/pankod/canvas2video)
[![dev-dependencies Status](https://david-dm.org/pankod/canvas2video/dev-status.svg)](https://david-dm.org/pankod/canvas2video?type=dev)

</div>
<div align="center">
  <sub>Created by <a href="https://www.pankod.com">Pankod</a></sub>
</div>
<br/>
<br/>

## About

@pankod/canvas2video is a backend solution for creating and rendering dynamic videos. It lets you build web canvas scenes by using the *Cairo-backed* [fabric](https://github.com/fabricjs/fabric.js) library and add animations with [gsap](https://github.com/greensock/GSAP).
Your animation timeline will be rendered frame by frame and piped to ffmpeg renderer for the final video output.

## Use Cases

📺 Personalized video advertising

🎞️ Programmatical customization of video templates

⛅ Creating dynamic videos with real-time data (See: [Weather Example ](./examples) - [Youtube](https://www.youtube.com/watch?v=xv8M3ScElv0))


## Getting started

To install the module, run the following in the command line:

```bash
npm install @pankod/canvas2video --save
```

or

```bash
yarn add @pankod/canvas2video
```

## Usage

`renderer` expects a `makeScene` function where you create your canvas animation by using [fabric](https://github.com/fabricjs/fabric.js) and 
[gsap](https://github.com/greensock/GSAP) methods. It returns a *stream of frames* to be consumed by the `encoder` in the next step.

Below is a basic example of a one-second rotation animation of "Hello World" text. After rendering the animation and encoding the video, the output will be saved to `output/hello-world.mp4`.

```js
import { renderer, encoder } from "@pankod/canvas2video";

const helloWorld = async () => {
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
};
```

You may refer the following documentations to learn how the construct your own `makeScene` methods:

📃[Fabric.js Documentation](http://fabricjs.com/docs/)

📃[GSAP Documentation](https://greensock.com/docs/)

You can optionally provide the `encoder` function a `backgroundVideo` object. In this case, your animation will be used as an overlay layer and merged with the background video. More information about the usage of background videos is given in the *Options* section.


## Examples

<div align="center">
 <img width="600" src="media/pullr-gif.gif" >
</div>

<br/>

You'll find two working demos int the [examples](./examples) folder folder of the project. Give them a try by following the steps below:

#### **Check out examples**


```bash
$ git clone https://github.com/pankod/canvas2video.git
````
```
$ cd examples
```
```
$ npm i
```
After this, you can run commands at the below then check examples/output directory:
#### **Example 1**

```bash
$ npm run start:hello-world
```


#### **Example 2**

```bash
$ npm run start:weather
```

<br/>

## Options

### **Renderer**

| Properties                      | Type       | Description                          |
| ------------------------------- | ---------- | ------------------------------------ |
| **width** <br> \*_required_     | `number`   | canvas width                 |
| **height** <br> \*_required_    | `number`   | canvas height               |
| **fps** <br> \*_required_       | `number`   | animation fps |
| **makeScene** <br> \*_required_ | `function` | [See below](#makeScene)              |

<br/>

#### **_makeScene_**

The function takes 4 arguments(fabric, canvas, anim and compose) which is passed by the `renderer` function.

```js
renderer({
    /* .. */
    makeScene: (fabric, canvas, anim, compose) => {
        /**
         * your code to create and manipulate your canvas
         */
    },
});
```

| _Parameter_ | _Type_              |                                               |
| ----------- | ------------------- | --------------------------------------------- |
| **fabric**  | fabric.js instance  | [Repo](https://github.com/fabricjs/fabric.js) |
| **canvas**  | fabric.StaticCanvas | [Repo](https://github.com/fabricjs/fabric.js) |
| **anim**    | gsap.TimelineMax    | [Repo](https://github.com/greensock/GSAP)     |
| **compose** | () => void          |

<br/>

### **Encoder**

| Properties                        | Type       | Description                         |
| --------------------------------- | ---------- | ----------------------------------- |
| **frameStream** <br> \*_required_ | `Readable` |  `renderer` function return value    |
| **output** <br> \*_required_      | `string`   | output file path               |
| **fps** <br> \*_required_         | `Object`   | `{ input: number, output: number }` |
| **backgroundVideo**               | `Object`   | [See below](#backgroundVideo)       |

<br/>

#### **_backgroundVideo_**

```ts
backgroundVideo: {
  videoPath: string, // your background video path
  inSeconds: number, // video start time in seconds
  outSeconds: number, // video end time in seconds
}
```

<br/>

## To-do

📌 [Lottie](https://airbnb.design/lottie/) animation support

📌 Thread & concurrency management

📌 Finer control over encoder settings



## License

[License](./LICENSE)
