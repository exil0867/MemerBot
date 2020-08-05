require('dotenv').config();
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const fileType = require('file-type');
const memeGenerator = require('../lib/meme-generator');
const fs = require('fs');

exports.run = async (bot, msg, args) => {
  const memeObject = args.filter((item, index) => index !== 0).join(' ').split('|').map(item => item.trim());

  if (memeObject !== 2) return msg.channel.send(`Invalid command!`);


  const url = args[0];
  const topText = memeObject[0];
  const bottomText = memeObject[0];

  const response = await fetch(url);
  const buffer = await response.buffer();
  const { ext } = await fileType.fromBuffer(buffer);
  const outputFileName = `meme.${ext}`;

  try {
    memeGenerator(buffer, outputFileName, ext, {top: topText, bottom: bottomText}).then(outBuffer => {
      const attachment = new MessageAttachment(outBuffer, outputFileName);
      msg.channel.send('Done!', attachment);
    })
  } catch (err) {
    msg.channel.send(`Error: ${err.message}`);
  }
};

exports.help = {
  name: 'meme',
  usage: 'meme',
  description: 'Generate a meme'
};
