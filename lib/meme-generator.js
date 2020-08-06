const path = require('path')
const pixelWidth = require('string-pixel-width');
const gm = require('gm').subClass({imageMagick: false});
var sizeOf = require('image-size');

const getFontSize = (text, width, height) => {
  let fontSize = 175;
  let textWidth = 0;

  while(1) {
      textWidth = pixelWidth(text, {size:fontSize, font:'impact'});
      if(( textWidth < (width-15)) && (fontSize < height/10) ) {
          break;
      }
      fontSize-=2;
  }

  return fontSize;
}

const resizeBuffer = (buffer, fileName, fileType, newHeight) => {
  return new Promise((resolve, reject) => {
    gm(buffer, fileName)
    .coalesce()
    .resize(null, newHeight)
    .toBuffer(fileType, (err, bufferOutput) => {
      if (err) return reject(err);
      resolve(bufferOutput);
    });
  });
}

const setFontSize = (textObj, imageSize) => {
  const { width, height } = imageSize;
  let fontSize = {};
  fontSize.top = getFontSize(textObj.top, width, height);
  fontSize.bottom = getFontSize(textObj.bottom, width, height);
  return fontSize;
}

const memeGenerator = (file, fileName, fileType, textObj) => {
  return new Promise((resolve,reject) => {
    resizeBuffer(file, fileName, fileType, 720).then(resizedBuffer => {
      const imageSize = sizeOf(resizedBuffer);
      const fontSize = setFontSize(textObj, imageSize);
      gm(resizedBuffer, fileName)
      .font('./impact.ttf')
      .stroke('#000000')
      .fill('#ffffff')
      .fontSize(fontSize.top)
      .strokeWidth(1.5)
      .drawText(0, fontSize.top + 10, textObj.top, 'North')
      .fontSize(fontSize.bottom)
      .drawText(0, imageSize.height - (fontSize.bottom / 2), textObj.bottom, 'North')
      .toBuffer(fileType, (err, bufferOutput) => {
        if (err) return reject(err);
        resolve(bufferOutput);
      })
    })
    .catch(err => {
      reject(err);
    })
  });

}

module.exports = memeGenerator;
