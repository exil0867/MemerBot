const fs = require('fs');
const gm = require('gm');

const buffertxt = fs.readFileSync('./bruh-done.txt');

const memeGenerator = (inBuffer, fileType, textObj) => {
  const fileName = `meme.${fileType}`;
    gm(buffertxt, fileName)
    .resize(240, 240)
    .write('./bruhfinal.gif', (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('done')
      }
    });

}

memeGenerator()
