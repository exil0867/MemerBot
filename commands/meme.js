require('dotenv').config();
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const fileType = require('file-type');
const isImageUrl = require('is-image-url');
const memeGenerator = require('../lib/meme-generator');
const dlFile = require('../utils/dl-file');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const hostnameChecker = require('../utils/hostname-check');
const tenorScraper = require('../utils/tenor-scraper');

exports.run = async (bot, msg, args, rawArgs) => {
  let url;
  let memeText;

  const invalidArgsErr = `Please split top and bottom text using a | divider. Type: \`${process.env.PREFIX}help\` for more info`;

  // Yes i am aware of the bad code, i just don't have the enough energy to clean it up

  if (args.length === 0) return msg.channel.send(`Error: Missing command arguments!, Type: \`${process.env.PREFIX}help\` for more info`);

  if (msg.attachments.array()[0]) {
    url = msg.attachments.array()[0].url;
    memeText = args.join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(invalidArgsErr);
  } else if (isImageUrl(args[0])) {
    url = args[0];
    memeText = args.filter((item, index) => index !== 0).join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(invalidArgsErr);
  } else if (isTenor = hostnameChecker(args[0], 'tenor.com') || hostnameChecker(args[0], 'media1.tenor.com')) {
    url = await tenorScraper(args[0]);
    memeText = args.filter((item, index) => index !== 0).join(' ').toUpperCase().split('|').map(item => item.trim());
  } else {
    return msg.channel.send(`Error: Unknown!, type: \`${process.env.PREFIX}help\` for more info`);
  }
  const topText = memeText[0];
  const bottomText = memeText[1];

  if (!isImageUrl(url)) return msg.channel.send('Error: The file is not an image!');

  const response = await fetch(url);
  const buffer = await response.buffer();
  const { ext } = await fileType.fromBuffer(buffer);
  const sizeInMb = buffer.byteLength / Math.pow(1024,2);
  const instanceId = uuidv4();
  const dirPath = path.resolve(process.cwd(), 'tmp', instanceId);

  if (sizeInMb > 4) return msg.channel.send(`Error: File size is larger than 4MB, i don't wanna suffer`);

  const feedbackMsg = msg.channel.send(`Processing... This might take a while!`);

  memeGenerator(buffer, dirPath, ext, { top: topText, bottom: bottomText })
    .then((outputBuffer => {
      return feedbackMsg.then(msg => {
        const attachment = new MessageAttachment(outputBuffer, `${instanceId}.${ext}`);
        return msg.channel.send('', attachment)
      })
    }))
    .then(() => {
      return feedbackMsg.then(msg => {
        return msg.delete();
      })
    })
    .catch((err) => {
      msg.channel.send('Error: Cannot convert the file');
      console.log(err);
  });
};

exports.help = {
  name: 'meme',
  cooldown: 15,
  usage: 'meme',
  description: 'Generate a meme'
};
