const fsp = require('fs').promises;
const fs = require('fs');

const downloadFile = (buffer, dirPath, filePath) => {
  return new Promise((resolve, reject) => {
    fs.promises.mkdir(dirPath, { recursive: true }).then(() => {
      fs.writeFile(filePath, buffer, 'binary', err => {
        if (err) return reject(err);
        resolve();
      });
    }).catch(err => {
      return reject(err);
    });
  });
}

module.exports = downloadFile;
