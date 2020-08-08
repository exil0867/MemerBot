const url = require('url');

const hostnameCheck = (_url, hostname) => {
  const _hostname = url.parse(_url).hostname;
  if (_hostname !== hostname) return false;
  return true;
}

module.exports = hostnameCheck;
