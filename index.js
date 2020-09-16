const Discord = require('discord.js');
const client = new Discord.Client();
const CLASH_ROYALE_API = require('clash-royale-api');
const CLASH_ROYALE_FUNCTIONS = require('./bot_functions/ClashRoyaleFunctions');
var config, CR_API, DB_URL, cr_functions;

if (process.env.NODE_ENV === 'production') {
  //Used for Heroku
  console.log('Currently in production! Bot is up and running!');
  CR_API = new CLASH_ROYALE_API(process.env.CR_API_TOKEN);
  client.login(process.env.BOT_TOKEN);
  DB_URL = process.env.DB_URL;
} else if (process.env.NODE_ENV === 'development') {
  console.log(
    'Currently in development! Remember to turn worker back on in Heroku!'
  );
} else {
  //Used for testing
  config = require('./config.json');
  CR_API = new CLASH_ROYALE_API(config.testToken);
  client.login(config.token);
  DB_URL = config.DB_URL;
}

client.on('ready', () => {
  console.log('Connected as ' + client.user.tag);
  client.user.setActivity('Clash Royale');

  client.guilds.cache.forEach((guild) => {
    console.log(guild.name);
    guild.channels.cache.forEach((channel) => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });
  });
  let botChannel = client.channels.cache.get('730528385385889834');

  const embed = new Discord.MessageEmbed()
    .setColor('#E5A823')
    .setTitle('Welcome!')
    .setAuthor(
      "Flazey's Welcome Thang",
      'https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg',
      'https://github.com/justin-zhu1018/flazey-bot'
    )
    .setDescription("I am here! Here's some info to help get you started!")
    .addFields(
      {
        name: '!commands',
        value: 'To bring up the bot commands.',
        inline: false,
      },
      {
        name: 'To wake me up (after 30 mins of inactivity)',
        value:
          'https://flazey-bot.herokuapp.com/ Quick visit and I should be back in 30 seconds!',
        inline: false,
      },
      {
        name: 'My GitHub 😉',
        value: 'https://github.com/justin-zhu1018/flazey-bot',
        inline: false,
      }
    )
    .setTimestamp();
  botChannel.send(embed);
});

client.on('message', (receivedMessage) => {
  if (receivedMessage.author == client.user) {
    return;
  }
  if (receivedMessage.content.startsWith('!')) {
    // getRoles(receivedMessage);
    processCommand(receivedMessage, verifyRole(receivedMessage));
  }
});

getRoles = (receivedMessage) => {
  let cachedRoles = receivedMessage.member.roles.cache;
  console.log(cachedRoles);
};

verifyRole = (receivedMessage) => {
  const member = receivedMessage.guild.members.cache.get(
    receivedMessage.author.id
  );
  var isRole = false;
  for (i = 0; i < member._roles.length; i++) {
    // console.log(member._roles);
    if (member._roles[i] === '733042943883214868') {
      isRole = true;
    }
    if (member._roles[i] === '730298484409761802') {
      isRole = true;
    }
  }
  if (isRole) {
    // receivedMessage.reply("Hi admin");
    return true;
  } else {
    // receivedMessage.reply("YOU have no power");
    return false;
  }
};

function processCommand(receivedMessage, roleVerified) {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(' ');
  let primaryCommand = splitCommand[0];
  let secondaryCommand = splitCommand[1];

  const channel = receivedMessage.channel;
  cr_functions = new CLASH_ROYALE_FUNCTIONS(
    primaryCommand,
    secondaryCommand,
    channel,
    CR_API,
    DB_URL
  );

  if (primaryCommand === 'commands') {
    cr_functions.processCommandsList();
  } else if (primaryCommand === 'help') {
    cr_functions.processHelp();
  } else if (primaryCommand === 'clan') {
    cr_functions.processClan();
  } else if (primaryCommand === 'player') {
    cr_functions.processPlayer();
  } else if (primaryCommand === 'cards') {
    cr_functions.processCards();
  } else if (primaryCommand === 'get') {
    cr_functions.processGet();
  } else if (primaryCommand === 'glitch') {
    cr_functions.processGlitch();
  } else if (primaryCommand === 'update') {
    if (roleVerified) {
      cr_functions.processUpdate(fullCommand.substr(7), channel);
    } else {
      channel.send("You don't have the powers to run this command!");
    }
  } else if (primaryCommand === 'online') {
    cr_functions.processOnline(secondaryCommand, channel);
  } else if (primaryCommand === 'd') {
    cr_functions.processDelete(channel);
  } else {
    return;
  }
}
