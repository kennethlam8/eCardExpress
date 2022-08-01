import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

export async function compressImage(image: string) {
    console.log("compressing image: ", image);
    const files = await imagemin([`uploads/${image}`], { //.{jpeg,png}
        destination: 'build/images',
        plugins: [
            //compress rate much higher than imageminJpegtran
            imageminJpegRecompress([`uploads/${image}`]),
            //imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });

    console.log("compressed file: ", files);
}
