require('dotenv').config();
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const fileType = require('file-type');
const isImageUrl = require('is-image-url');
const memeGenerator = require('../lib/meme-generator');
const fs = require('fs');

exports.run = async (bot, msg, args) => {
  let url;
  let memeText;

  if (msg.attachments.array()[0]) {
    url = msg.attachments.array()[0].url;
    memeText = args.join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(`Invalid command!`);
  } else if (isImageUrl(args[0])) {
    url = args[0];
    memeText = args.filter((item, index) => index !== 0).join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(`Invalid command!`);
  } else {
    return msg.channel.send(`Error: Unknown!`);
  }
  const topText = memeText[0];
  const bottomText = memeText[1];

  if (!isImageUrl(url)) return msg.channel.send(`Error: The file is not an image!`);

  const response = await fetch(url);
  const buffer = await response.buffer();
  const { ext } = await fileType.fromBuffer(buffer);
  const outputFileName = `meme.${ext}`;

  memeGenerator(buffer, outputFileName, ext, {top: topText, bottom: bottomText}).then(outputBuffer => {
    const attachment = new MessageAttachment(outputBuffer, outputFileName);
    msg.channel.send('Done!', attachment);
  }).catch(err => {
    msg.channel.send(`Error: ${err.message}`);
  });
};

exports.help = {
  name: 'meme',
  usage: 'meme',
  description: 'Generate a meme'
};
