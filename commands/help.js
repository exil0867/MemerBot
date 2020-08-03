require('dotenv').config();

exports.run = (bot, msg, args) => {
  msg.channel.send({
    embed: {
      'title': 'Help command',
      'fields': [{
          'name': process.env.PREFIX + 'help',
          'value': 'List of all commands.'
        }
      ],
      'color': 3264944,
      'footer': {
        'text': msg + ''
      }
    }
  });
};
exports.help = {
  name: 'help',
  usage: 'help',
  description: 'Help command.'
};
