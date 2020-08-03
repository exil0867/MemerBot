const path = require('path');
const fs = require('fs');
const { Client } = require('discord.js');
const discordClient = new Client();
const commandsMap = new Map();

const config = process.env;

discordClient.config = config;
discordClient.commands = commandsMap;

fs.readdirSync(path.resolve(__dirname, 'commands'))
  .filter(f => f.endsWith('.js'))
  .forEach(f => {
    console.log(`Loading command ${f}`);
    try {
      let command = require(`./commands/${f}`);
      if (typeof command.run !== 'function') {
        throw 'Command is missing a run function!';
      }
      else if (!command.help || !command.help.name) {
        throw 'Command is missing a valid help object!';
      }
      commandsMap.set(command.help.name, command);
    }
    catch (error) {
      console.error(`Couldn't load command ${f}: ${error}`);
    }
  });

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag} (ID: ${discordClient.user.id})!`);
  discordClient.generateInvite([
    'SEND_MESSAGES',
    'MANAGE_MESSAGES',
  ]).then(invite => {
    console.log(`Click here to invite the bot to your server:\n${invite}`);
  });
});

discordClient.on('message', message => {
  if (message.author.bot || !message.guild) {
    return;
  }
  let { content } = message;
  if (!content.startsWith(config.PREFIX)) {
    return;
  }
  let split = content.substr(config.PREFIX.length).split(' ');
  let label = split[0];
  let args = split.slice(1);
  if (commandsMap.get(label)) {
    commandsMap.get(label).run(discordClient, message, args);
  }
});

config.TOKEN && discordClient.login(config.TOKEN);
