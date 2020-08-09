require('dotenv').config();

exports.run = (bot, msg, args, rawArgs) => {
  msg.channel.send({
    embed: {
      'title': 'Help command',
      'fields': [{
          'name': process.env.PREFIX + 'help',
          'value': 'List of all commands.'
        }, {
          'name': process.env.PREFIX + 'caption',
          'value': `Generate a GIF Caption meme (Supports normal images and GIFs). \nUsage: \`${process.env.PREFIX}caption\ <link> text\`\nUsage (with an image attachement): \`${process.env.PREFIX}caption\ text\``
        }, {
          'name': process.env.PREFIX + 'meme',
          'value': `Generate a meme (Supports normal images and GIFs). \nUsage: \`${process.env.PREFIX}meme\ <link> top text | bottom text\`\nUsage (with an image attachement): \`${process.env.PREFIX}meme\ top text | bottom text\``
        }, {
          'name': process.env.PREFIX + 'ping',
          'value': `Pings the bot`
        }, {
          'name': process.env.PREFIX + 'invite',
          'value': `Invite the bot to your server.`
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
