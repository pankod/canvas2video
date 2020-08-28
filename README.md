<div align="center">
 <img src="media/pankod.png" width="250">
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</div>

<br/>
<div align="center"> <h3><b>Puulr Canvas to Video</b><h3> </div>

<div align="center"> Simplyfies the way to create a video from canvas content </div>
<br/>
<div align="center">

[![Maintainability](https://api.codeclimate.com/v1/badges/e298d0770a36e222a6b3/maintainability)](https://api.codeclimate.com/v1/badges/e298d0770a36e222a6b3/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e298d0770a36e222a6b3/test_coverage)](https://codeclimate.com/github/pankod/puulr/test_coverage)
[![npm version](https://img.shields.io/npm/v/@pankod/puulr.svg)](https://www.npmjs.com/package/@pankod/puulr)
![npm](https://img.shields.io/npm/dw/@pankod/puulr)
[![dependencies Status](https://david-dm.org/pankod/puulr/status.svg)](https://david-dm.org/pankod/puulr)
[![dev-dependencies Status](https://david-dm.org/pankod/puulr/dev-status.svg)](https://david-dm.org/pankod/puulr?type=dev)

</div>
<div align="center">
  <sub>Created by <a href="https://www.pankod.com">Pankod</a></sub>
</div>
<br/>
<br/>

## About

Puulr helps you to create videos with ease by using [gsap](https://github.com/greensock/GSAP) and [fabric](https://github.com/fabricjs/fabric.js) libraries.

## Getting started

To install the module, run the following in the command line:

```
$ npm install puulr --save
```

or

```
$ yarn add puulr
```

## Usage

Library exports two different functions `renderer` and `encoder`.

Define canvas properties and create stream with makeScene function by using fabric and gsap animation library methods. You get a stream as a return which then you'll use in the `encoder` function which convert canvas to video output.

You can also define a background video in `encoder` function which will be applied to your canvas with a beautiful filter.

For more detailed usage, checkout our examples.

## Examples

<div>
 <img width="500" src="media/pullr-gif.gif" >
</div>

We've provided two examples to demonstrate how puulr works and what can be done. See [examples](./examples)

### Installation

```
git clone https://github.com/pankod/puulr.git
cd examples
npm i
```

### Hello World

```
npm run start:hello-world
```

### Weather

```
npm run start:weather
```

<br/>

## Options

<br/>

### **Renderer**

| Properties                        | Type       | Description                          |
| --------------------------------- | ---------- | ------------------------------------ |
| **width** <br> \*_required_       | `number`   | Width of your canvas                 |
| **height** <br> \*_required_      | `number`   | Height of your canvas                |
| **fps** <br> \*_required_         | `number`   | Frames per second of your animations |
| **makeScene\*** <br> \*_required_ | `function` | [See below](#makeScene)              |
| ----------------                  | ---        | ----                                 |

<br/>

#### **_makeScene_**

You can create contents by using fabric, gsap library methods which comes default with makeScene function.

This function takes 4 arguments(fabric, canvas, anim and compose) which is passed by the `renderer` function.

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
| **frameStream** <br> \*_required_ | `Readable` | Output of your `renderer` call      |
| **output** <br> \*_required_      | `string`   | Your output file path               |
| **fps\*** <br> \*_required_       | `Object`   | `{ input: number, output: number }` |
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

## Notes

As of version 1.1.0 this package is compatible with both iOS and Android.

## License

[License](./LICENSE)
