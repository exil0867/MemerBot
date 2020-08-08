const fetch = require('node-fetch');
const cheerio = require('cheerio');
const isImageUrl = require('is-image-url');
const hostnameChecker = require('./hostname-check');

const tenorScraper = tenorUrl => {
  return new Promise( async (resolve, reject) => {
    if (!hostnameChecker(tenorUrl, 'tenor.com')) reject(new Error('Hostname is not a tenor.com'));
    const response = await fetch(tenorUrl).catch(err => reject(err));
    const html = await response.text().catch(err => reject(err));
    const $ = cheerio.load(html);
    const directGifLink = $('[property="og:url"]')['0'].attribs.content;
    if (!isImageUrl(directGifLink)) return reject(new Error('Failed to extract a direct gif URL from Tenor'));
    resolve(directGifLink);
  });
}

module.exports = tenorScraper;
