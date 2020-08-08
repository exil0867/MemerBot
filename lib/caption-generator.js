const fs = require('fs');
const imagemagickCli = require('imagemagick-cli');
var sizeOf = require('image-size');

const captionGenerator = (filePath, outputPath, captionPath, captionText) => {
  return new Promise((resolve,reject) => {
    const imageSize = sizeOf(filePath);
    let resizedImageSize = {};
    const aspectRatio = imageSize.width / imageSize.height;
    const newWidth = 420;
    const newHeight = Math.round(newWidth / aspectRatio)
    resizedImageSize.width = newWidth;
    resizedImageSize.height = newHeight;
    const platform = process.platform;
    const escaper = (platform === 'win32') ? '' : '\\';
    imagemagickCli.exec(`convert -background white  -fill black  -font Arial -stroke black -strokeWidth 1 -extent ${resizedImageSize.width}x100 -pointsize 33 -size ${resizedImageSize.width}x -gravity Center  caption:"${captionText}" PNG24:${captionPath}`)
    .then((stdout, sterr) => {
      imagemagickCli.exec(`convert ${captionPath} -alpha set -background none ${escaper}( ${filePath} -coalesce -resize ${resizedImageSize.width}x${resizedImageSize.height} ${escaper}) -set page "%[fx:u.w]x%[fx:u.h+v.h]+%[fx:t?(u.w-v.w)/2:0]+%[fx:t?u.h:0]" -coalesce null: -insert 1 -layers composite -loop 0 -define colorspace:auto-grayscale=off ${outputPath}`)
      .then((stdout, sterr) => {
        const outputBuffer = fs.readFileSync(outputPath);
        resolve(outputBuffer)
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });

}

module.exports = captionGenerator;
