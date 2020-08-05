require('dotenv').config();
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const fileType = require('file-type');
const memeGenerator = require('../lib/meme-generator');
const fs = require('fs');

exports.run = async (bot, msg, args) => {
  const memeText = args.filter((item, index) => index !== 0).join(' ').split('|').map(item => item.trim());

  if (memeText.length !== 2) return msg.channel.send(`Invalid command!`);


  const url = args[0];
  const topText = memeText[0];
  const bottomText = memeText[1];

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
