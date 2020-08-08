const fetch = require('node-fetch');
const cheerio = require('cheerio');
const isImageUrl = require('is-image-url');
const url = require('url');

const tenorScraper = url => {
  return new Promise( async (resolve, reject) => {
    const hostName = url.parse(url).hostName;
    if (hostName !== 'tenor.com') reject(new Error('Hostname is not a tenor.com'))
    const response = await fetch('https://tenor.com/view/gintama-gif-9531144').catch(err => reject(err));
    const html = await response.text().catch(err => reject(err));
    const $ = cheerio.load(html);
    const directGifLink = $('[property="og:url"]')['0'].attribs.content;
    if (!isImageUrl(directGifLink)) return reject(new Error('Failed to extract a direct gif URL from Tenor'));
    resolve(directGifLink);
  });
}

module.exports = tenorScraper;
