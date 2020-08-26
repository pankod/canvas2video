import { Readable, Writable } from "stream";
import fabric from "fabric/fabric-impl";

type mediaPath = string;

interface BaseConfig {
    silent?: boolean;
}

interface EncoderConfig extends BaseConfig {
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
interface EncoderOutput {
    path: mediaPath;
    stream: Writable;
}

type makeSceneFunction = (
    fabricInstance: typeof fabric,
    canvas: fabric.StaticCanvas,
    anim: TimelineMax,
    compose: () => void,
) => void;

interface RendererConfig extends BaseConfig {
    width: number;
    height: number;
    fps: number;
    makeScene: makeSceneFunction;
}

export type Encoder = (config: EncoderConfig) => Promise<EncoderOutput>;
export type Renderer = (config: RendererConfig) => Promise<Readable>;
