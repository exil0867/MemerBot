const path = require('path')
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
    const newWidth = 520;
    const newHeight = Math.round(newWidth / aspectRatio)
    resizedImageSize.width = newWidth;
    resizedImageSize.height = newHeight;
    const fontSize = setFontSize(textObj, resizedImageSize);
    imagemagickCli.exec(`convert ( "${filePath}" -coalesce -resize ${resizedImageSize.width}x${resizedImageSize.height} ) -stroke #000000 -fill white -font "./impact.ttf" ( -strokewidth ${fontSize.top / 40} -pointsize ${fontSize.top} -annotate +0+10 "${textObj.top}" -gravity south ) ( -strokewidth ${fontSize.bottom / 40} -pointsize ${fontSize.bottom} -annotate +0+${10 - (fontSize.bottom / 20)} "${textObj.bottom}" -gravity north ) "${outputPath}"`)
    .then((stdout, sterr) => {
      const outputBuffer = fs.readFileSync(outputPath);
      resolve(outputBuffer)
    }).catch(err => {
      reject(err);
    });
  });

}

module.exports = memeGenerator;
