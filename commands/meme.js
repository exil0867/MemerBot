require('dotenv').config();

exports.run = (bot, msg, args) => {
  const argParts = args.split(' ');

  if (argParts.length !== 3) return msg.channel.send(`Invalid command!`);

  const url = argParts[0];
  const topText = argParts[1];
  const bar = argParts[2];
  const bottomText = argParts[3];


  // msg.channel.send(`Invite the bot to your server:\n${invite}`)
  // .catch(err => {
  //   msg.channel.send(`Error: ${err.message}`);
  // });
};

exports.help = {
  name: 'meme',
  usage: 'meme',
  description: 'Generate a meme'
};
