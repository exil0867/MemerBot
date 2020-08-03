const fs = require('fs');
const pixelWidth = require('string-pixel-width');
const gm = require('gm');

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

const memeGenerator = (inBuffer, fileName, textObj) => {
  return new Promise((resolve,reject) => {
    gm(inBuffer, fileName)
    .size((err, size) => {
      if (err) reject(err);

      const { width, height } = size;

      let fontSize = {};

      fontSize.top = getFontSize(textObj.top, width, height);
      fontSize.bottom = getFontSize(textObj.bottom, width, height);

      gm(inBuffer, fileName)
      .coalesce()
      .font('../assets/impact.ttf')
      .stroke('#000000')
      .fill('#ffffff')
      .fontSize(fontSize.top)
      .strokeWidth(1.5)
      .drawText(0, fontSize.top + 20, textObj.top, 'North')
      .fontSize(fontSize.bottom)
      .drawText(0, height - (fontSize.bottom / 2), textObj.bottom, 'North')
      .toBuffer(fileName.split('.').pop().toUpperCase(), (err, outBuffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(outBuffer);
        }
      })
    })
  });

}

module.exports = memeGenerator;
