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
  const fileName = `input.${ext}`;
  const outputFileName = `output.${ext}`;
  const dirPath = path.resolve(process.cwd(), 'tmp', instanceId);
  const filePath = path.resolve(dirPath, fileName);
  const outputPath = path.resolve(dirPath, outputFileName);

  if (sizeInMb > 4) return msg.channel.send(`Error: File size is larger than 4MB, i don't wanna suffer`);

  const feedbackMsg = msg.channel.send(`Processing... This might take a while!`);

  dlFile(buffer, dirPath, filePath).then(() => {
    memeGenerator(filePath, outputPath, {top: topText, bottom: bottomText})
    .then(outputBuffer => {
      feedbackMsg.then(msg => {
        msg.delete({ timeout: 5000, reason: 'Because i can :D'}).catch(err => {
          console.log(err);
        })
        const attachment = new MessageAttachment(outputBuffer, outputFileName);
        msg.channel.send('', attachment).catch(err => {
          msg.channel.send(err.message)
        });
      })
    }).catch((err) => {
      msg.channel.send(`Error: Cannot convert the file`);
      console.log(err)
    }).finally(() => {
      fs.rmdir(dirPath, { recursive: true })
    })
  })
  .catch(err => {
    fs.rmdir(dirPath, { recursive: true })
    return msg.channel.send(`Error: ${err.message}`);
  })
};

exports.help = {
  name: 'meme',
  usage: 'meme',
  description: 'Generate a meme'
};
