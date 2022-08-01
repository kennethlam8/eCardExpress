import { Plugin } from 'imagemin';

declare function imageminJpegRecompress(input: ReadonlyArray<string>, options?: imageminJpegRecompress.Options): Plugin;

declare namespace imageminJpegRecompress {
    interface Options {
        accurate?: boolean | undefined;
        quality?: string | undefined;
        method?: string | undefined;
        target?: number | undefined;
        min?: number | undefined;
        max?: number | undefined;
        loops?: number | undefined;
        defish?: number | undefined;
        progressive?: boolean | undefined;
        subsample?: string | undefined;
        strip?: boolean | undefined;
    }
}

export = imageminJpegRecompress;