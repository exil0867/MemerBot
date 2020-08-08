const url = require('url');

const hostNameCheck = (url, hostName) => {
  const _hostName = url.parse(tenorUrl).hostname;
  if (_hostName !== hostName) return false;
  return true;
}

module.exports = hostNameCheck;
