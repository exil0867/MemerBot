const fs = require('fs');
const path = require('path');
const pixelWidth = require('string-pixel-width');
const sizeOf = require('image-size');
const execa = require('execa');
const gifsicle = require('gifsicle');
const imagemagickCli = require('imagemagick-cli');
const dlFile = require('../utils/dl-file');
const { escaper } = require('../helpers/global-vars');

const getFontSize = (text, width, height) => {
  let fontSize = 175;
  let textWidth = 0;

  while(1) {
      textWidth = pixelWidth(text, {size:fontSize, font:'impact'});
      if(( textWidth < (width-40)) && (fontSize < height/8) ) {
          break;
      }
      fontSize-=1;
  }

  return fontSize;
}

const setFontSize = (textObj, imageSize) => {
  const { width, height } = imageSize;
  let fontSize = {};
  fontSize.top = getFontSize(textObj.top, width, height);
  fontSize.bottom = getFontSize(textObj.bottom, width, height);
  return fontSize;
}

const memeGenerator = (buffer, dirPath, ext, memeText) => {
  return new Promise((resolve,reject) => {

    dlFile(buffer, dirPath, 'input', ext)
    .then((inputPath) => {
      return generate(inputPath);
    })
    .catch((err) => {
      reject(err);
    })

    function generate(inputPath) {
      const imageSize = sizeOf(inputPath);
      const aspectRatio = imageSize.width / imageSize.height;
      const newWidth = 420;
      const newHeight = Math.round(newWidth / aspectRatio)
      const fontSize = setFontSize(memeText, { width: newWidth, height: newHeight });
      const unoptimizedOutputPath = path.resolve(dirPath, `unoptimized-output.${ext}`)
      imagemagickCli.exec(`convert ${escaper}( "${inputPath}" -coalesce -resize ${newWidth}x${newHeight} ${escaper}) -stroke black -fill white -font "./impact.ttf" ${escaper}( -strokewidth ${fontSize.top / 25} -pointsize ${fontSize.top} -annotate +0+10 "${memeText.top}" -gravity south ${escaper}) ${escaper}( -strokewidth ${fontSize.bottom / 25} -pointsize ${fontSize.bottom} -annotate +0+${10 - (fontSize.bottom / 20)} "${memeText.bottom}" -gravity north ${escaper}) "${unoptimizedOutputPath}"`)
      .then(() => {
        const outputPath = path.resolve(dirPath, `output.${ext}`)
        if (ext === 'gif') return execa(gifsicle, ['-O3', '--lossy=100', '-o', outputPath, unoptimizedOutputPath]).then(() => (outputPath));
        return unoptimizedOutputPath;
      })
      .then((output) => {
        return fs.readFileSync(output);
      }).then((buffer) => {
        return resolve(buffer);
      }).catch(err => {
        reject(err);
      }).finally(() => {
        fs.promises.rmdir(dirPath, {
          recursive: true
        })
      });
    }
  });

}

module.exports = memeGenerator;
