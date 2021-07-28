const Jimp = require("jimp");
const { compress } = require("compress-images/promise");
const path = require("path");

// const compress_images = require("compress-images");
// const INPUT_path_to_your_images = "src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}";
// const OUTPUT_path = "build/img/";

// compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
//                 { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
//                 { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
//                 { svg: { engine: "svgo", command: "--multipass" } },
//                 { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
//   function (error, completed, statistic) {
//     console.log("-------------");
//     console.log(error);
//     console.log(completed);
//     console.log(statistic);
//     console.log("-------------");
//   }
// );

const compressImage = async (inputPath, outputPath) => {
  const result = await compress({
    source: inputPath,
    destination: outputPath || path.resolve(process.cwd(), "public/arts//"),
    enginesSetup: {
      jpg: { engine: "mozjpeg", command: ["-quality", "60"] },
      png: { engine: "pngquant", command: ["--quality=20-50", "-o"] },
      svg: { engine: "svgo", command: "--multipass" },
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    params: { compress_force: false, statistic: true, autoupdate: true },
  });

  const { statistics, errors } = result;
  // statistics - all processed images list
  // errors - all errros happened list
};

const waterMark = async () => {
  // reads the watermark image
  let watermark = await Jimp.read(
    path.resolve(process.cwd(), "public/images/logo.png")
  );
  // resizes the watermark image
  watermark = watermark.resize(100, 100);
  // reads the image
  const image = await Jimp.read("art.png");

  // reduce image quality
  image.quality(10);

  await image.composite(
    watermark,
    image.getWidth() - watermark.getWidth(),
    image.getHeight() / 2 - watermark.getHeight() / 2,
    {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    }
  );

  await image.composite(
    watermark,
    0,
    image.getHeight() / 2 - watermark.getHeight() / 2,
    {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    }
  );
  //Saves the image into the file system

  const outPath = path.resolve(process.cwd(), "public/arts/art2.png");
  await image.writeAsync(outPath);

  return outPath;
};

(async () => {
  const path = await waterMark("logo.png");
  await compressImage(path);
})();
