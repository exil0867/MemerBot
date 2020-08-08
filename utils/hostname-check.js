const url = require('url');

const hostnameCheck = (url, hostname) => {
  const _hostname = url.parse(tenorUrl).hostname;
  if (_hostname !== hostname) return false;
  return true;
}

module.exports = hostnameCheck;
