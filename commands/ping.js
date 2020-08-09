require('dotenv').config();

exports.run = async (bot, msg, args, rawArgs) => {
  const m = await msg.channel.send('Pinging...');
    m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. Web Socket is ${Math.round(bot.ws.ping)}ms`);
};

exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'Pings the bot'
};
