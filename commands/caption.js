require('dotenv').config();
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');
const fileType = require('file-type');
const isImageUrl = require('is-image-url');
const dlFile = require('../utils/dl-file');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const captionGenerator = require('../lib/caption-generator');
const hostnameChecker = require('../utils/hostname-check');
const tenorScraper = require('../utils/tenor-scraper');

exports.run = async (bot, msg, args) => {
  let url;
  let captionText;

  if (msg.attachments.array()[0]) {
    url = msg.attachments.array()[0].url;
    captionText = args.join(' ').trim();
  } else if (isImageUrl(args[0])) {
    url = args[0];
    captionText = args.filter((item, index) => index !== 0).join(' ').trim();
  } else if (isTenor = hostnameChecker(args[0], 'tenor.com') || hostnameChecker(args[0], 'media1.tenor.com')) {
    url = await tenorScraper(args[0]);
  } else {
    return msg.channel.send(`Error: Unknown!, type: \`${process.env.PREFIX}help\` for more info`);
  }

  if (!isImageUrl(url)) return msg.channel.send('Error: The file is not an image!');

  const response = await fetch(url);
  const buffer = await response.buffer();
  const { ext } = await fileType.fromBuffer(buffer);
  const sizeInMb = buffer.byteLength / Math.pow(1024,2);
  const instanceId = uuidv4();
  const fileName = `input.${ext}`;
  const captionName = `caption.jpg`;
  const outputFileName = `output.${ext}`;
  const dirPath = path.resolve(process.cwd(), 'tmp', instanceId);
  const filePath = path.resolve(dirPath, fileName);
  const captionPath = path.resolve(dirPath, captionName);
  const outputPath = path.resolve(dirPath, outputFileName);

  if (sizeInMb > 4) return msg.channel.send(`Error: File size is larger than 4MB, i don't wanna suffer`);

  const feedbackMsg = msg.channel.send(`Processing... This might take a while!`);

  dlFile(buffer, dirPath, filePath).then(() => {
    captionGenerator(filePath, outputPath, captionPath, captionText)
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
  name: 'caption',
  usage: 'caption',
  description: 'Generate a gif caption'
};
