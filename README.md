<div align="center">
 <img src="media/pankod.png" width="350">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

<br/>
<div align="center"> <h3><b>@pankod/canvas2video</b></h3> </div>

<<<<<<< HEAD
<div align="center">Create dynamic, data-driven videos on the fly.</div>
=======
<div align="center"> Simplifies the way to create a video from Canvas </div>
>>>>>>> eb667f679d005f18a811204103f91c35652cff44
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

<<<<<<< HEAD

@pankod/canvas2video is a backend solution for creating and rendering dynamic videos. It lets you build web canvas scenes by using the *Cairo-backed* [fabric](https://github.com/fabricjs/fabric.js) library and add animations with [gsap](https://github.com/greensock/GSAP).
Your animation timeline will be rendered frame by frame and piped to ffmpeg renderer for the final video output.


=======
@pankod/canvas2video helps you to create a video from Canvas with ease by using  [ffmpeg](https://ffmpeg.org/), [gsap](https://github.com/greensock/GSAP), [fabric](https://github.com/fabricjs/fabric.js) libraries and [Node.js Stream](https://nodejs.org/api/stream.html).
>>>>>>> eb667f679d005f18a811204103f91c35652cff44

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

The module exports two different functions `renderer` and `encoder`.

Define canvas properties and create stream with makeScene function by using fabric and gsap animation library methods. You get a stream as a return value which then you'll use in the `encoder` function to get video output.

You can also set a background video in `encoder` function which will be applied to video with a beautiful filter.

```js
import { renderer, encoder } from "@pankod/canvas2video";

const helloWorld = async () => {
    const stream = await renderer({
        silent: false,
        width: 1920,
        height: 1080,
        fps: 30,
        makeScene: (fabric, canvas, anim, compose) => {
            var text = new fabric.Text("Hello world", {
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

For more detailed usage, checkout our examples.

## Examples

<div align="center">
 <img width="600" src="media/pullr-gif.gif" >
</div>

<br/>

We've provided two examples to demonstrate how canvas2video works and what can be done. See [examples](./examples)

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

Creates a content by using fabric, gsap library methods which comes default with makeScene function.

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

## License

[License](./LICENSE)
