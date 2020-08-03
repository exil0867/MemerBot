require('dotenv').config();

exports.run = (bot, msg, args) => {
  bot.generateInvite([
    'SEND_MESSAGES',
    'MANAGE_MESSAGES',
  ]).then(invite => {
    msg.channel.send(`Invite the bot to your server:\n${invite}`)
    .catch(err => {
      msg.channel.send(`Error: ${err.message}`);
    });
  });

};

exports.help = {
  name: 'invite',
  usage: 'invite',
  description: 'Invite the bot to your server'
};
