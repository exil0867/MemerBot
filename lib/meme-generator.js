const fs = require('fs');
const pixelWidth = require('string-pixel-width');
var sizeOf = require('image-size');
const imagemagickCli = require('imagemagick-cli');

const getFontSize = (text, width, height) => {
  let fontSize = 175;
  let textWidth = 0;

  while(1) {
      textWidth = pixelWidth(text, {size:fontSize, font:'impact'});
      if(( textWidth < (width-75)) && (fontSize < height/10) ) {
          break;
      }
      fontSize-=2;
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

const memeGenerator = (filePath, outputPath, textObj) => {
  return new Promise((resolve,reject) => {
    const imageSize = sizeOf(filePath);
    let resizedImageSize = {};
    const aspectRatio = imageSize.width / imageSize.height;
    const newWidth = 420;
    const newHeight = Math.round(newWidth / aspectRatio)
    resizedImageSize.width = newWidth;
    resizedImageSize.height = newHeight;
    const fontSize = setFontSize(textObj, resizedImageSize);
    const platform = process.platform;
    const escaper = (platform === 'win32') ? '' : '\\';
    imagemagickCli.exec(`convert ${escaper}( "${filePath}" -coalesce -resize ${resizedImageSize.width}x${resizedImageSize.height} ${escaper}) -stroke black -fill white -font "./impact.ttf" ${escaper}( -strokewidth ${fontSize.top / 40} -pointsize ${fontSize.top} -annotate +0+10 "${textObj.top}" -gravity south ${escaper}) ${escaper}( -strokewidth ${fontSize.bottom / 40} -pointsize ${fontSize.bottom} -annotate +0+${10 - (fontSize.bottom / 20)} "${textObj.bottom}" -gravity north ${escaper}) "${outputPath}"`)
    .then((stdout, sterr) => {
      const outputBuffer = fs.readFileSync(outputPath);
      resolve(outputBuffer)
    }).catch(err => {
      reject(err);
    });
  });

}

module.exports = memeGenerator;
