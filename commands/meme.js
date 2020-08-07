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

exports.run = async (bot, msg, args) => {
  let url;
  let memeText;

  const invalidArgsErr = `Please split top and bottom text using a | divider. Type: \`${process.env.PREFIX}help\` for more info`;

  if (msg.attachments.array()[0]) {
    url = msg.attachments.array()[0].url;
    memeText = args.join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(invalidArgsErr);
  } else if (isImageUrl(args[0])) {
    url = args[0];
    memeText = args.filter((item, index) => index !== 0).join(' ').toUpperCase().split('|').map(item => item.trim());
    if (memeText.length !== 2) return msg.channel.send(invalidArgsErr);
  } else {
    return msg.channel.send(`Error: Unknown!, type: \`${process.env.PREFIX}help\` for more info`);
  }
  const topText = memeText[0];
  const bottomText = memeText[1];

  if (!isImageUrl(url)) return msg.channel.send('Error: The file is not an image!');

  const response = await fetch(url);
  const buffer = await response.buffer();
  const { ext } = await fileType.fromBuffer(buffer);
  const instanceId = uuidv4();
  const fileName = `input.${ext}`;
  const outputFileName = `output.${ext}`;
  const dirPath = path.resolve(process.cwd(), 'tmp', instanceId);
  const filePath = path.resolve(dirPath, fileName);
  const outputPath = path.resolve(dirPath, outputFileName);

  dlFile(buffer, dirPath, filePath).then(() => {
    memeGenerator(filePath, outputPath, {top: topText, bottom: bottomText})
    .then(outputBuffer => {
      const attachment = new MessageAttachment(outputBuffer, outputFileName);
      msg.channel.send('Done!', attachment).catch(err => {
        msg.channel.send(err.message)
      });
    }).catch((err) => {
      msg.channel.send(`Error: ${err.message}`);
    }).finally(() => {
      setTimeout(() => {
        fs.rmdir(dirPath, { recursive: true })
      }, 6000)
    })
  })
  .catch(err => {
    setTimeout(() => {
      fs.rmdir(dirPath, { recursive: true })
    }, 6000)
    return msg.channel.send(`Error: ${err.message}`);
  })
};

exports.help = {
  name: 'meme',
  usage: 'meme',
  description: 'Generate a meme'
};
