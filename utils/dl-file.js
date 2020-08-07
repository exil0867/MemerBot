const fs = require('fs');

const downloadFile = (buffer, dirPath, filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
      fs.writeFile(filePath, buffer, 'binary', err => {
        if (err) return reject(err);
        resolve();
      });

  });
}

module.exports = downloadFile;
