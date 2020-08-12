const fs = require('fs');
const path = require('path');

const downloadFile = (buffer, dirPath, name, ext) => {
  const filePath = path.resolve(dirPath, `${name}.${ext}`)
  return new Promise((resolve, reject) => {
    fs.promises.mkdir(dirPath, { recursive: true }).then(() => {
      fs.writeFile(filePath, buffer, 'binary', err => {
        if (err) return reject(err);
        resolve(filePath);
      });
    }).catch(err => {
      return reject(err);
    });
  });
}

module.exports = downloadFile;
