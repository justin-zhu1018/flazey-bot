const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require("clash-royale-api");
const axios = require("axios");

var config, clash, DB_URL;

//TODO: Work on being able to save data to the database
//TODO: Work on being able to get the data(DONE) and use it to create an embed with the war cards + personal levels

if (process.env.NODE_ENV === "production") {
  //Used for Heroku
  console.log("Currently in production! Bot is up and running!");
  clash = new Client(process.env.CR_API_TOKEN);
  client.login(process.env.BOT_TOKEN);
  DB_URL = process.env.DB_URL;
} else if (process.env.NODE_ENV === "development") {
  console.log(
    "Currently in development! Remember to turn worker back on in Heroku!"
  );
} else {
  //Used for testing
  config = require("./config.json");
  clash = new Client(config.testToken);
  client.login(config.token);
  DB_URL = config.DB_URL;
}

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("Clash Royale");

  client.guilds.cache.forEach((guild) => {
    console.log(guild.name);
    guild.channels.cache.forEach((channel) => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });
  });
  let generalChannel = client.channels.cache.get("730295406189215747");
  let botChannel = client.channels.cache.get("730528385385889834");
  //   const attachment = new Discord.MessageAttachment(
  //     "https://clashroyale.com/uploaded-images-blog/CR_facebook_share_02_180403_175322.jpg?mtime=20180403175322"
  //   );

  // generalChannel.send("I am here! For a list of the commands, type !commands.");

  // botChannel.send(
  //   "I am here! List of commands: ```" +
  //     "!commands\n" +
  //     "!help\n" +
  //     "!clan\n" +
  //     "!player [player-tag] ```"
  // );
});

client.on("message", (receivedMessage) => {
  if (receivedMessage.author == client.user) {
    return;
  }
  if (receivedMessage.content.startsWith("!")) {
    processCommand(receivedMessage);
  }
});

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let secondaryCommand = splitCommand[1];

  const channel = receivedMessage.channel;

  if (primaryCommand === "commands") {
    processCommandsList(channel);
  } else if (primaryCommand === "help") {
    processHelp(channel);
  } else if (primaryCommand === "clan") {
    processClan(secondaryCommand, channel);
  } else if (primaryCommand === "player") {
    processPlayer(secondaryCommand, channel);
  } else if (primaryCommand === "cards") {
    processCards(secondaryCommand, channel);
  } else if (primaryCommand === "get") {
    processGet(secondaryCommand, channel);
  } else if (primaryCommand === "save") {
    processSave(fullCommand.substr(5), channel);
  } else if (primaryCommand === "d") {
    processDelete(channel);
  } else {
    // channel.send(
    //   "Error: No command specified. For a list of commands, type !commands"
    // );
    return;
  }
}

function processCommandsList(channel) {
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("The Great Information Board")
    .setAuthor(
      "Flazey's Command List Thang",
      "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg",
      "https://github.com/justin-zhu1018/flazey-bot"
    )
    .setDescription(
      "Here is a list of all resources that you could make use of."
    )
    .addFields(
      {
        name: "!commands",
        value: "To bring this thing up again.",
        inline: false,
      },
      {
        name: "!clan [clan-tag] || !clan",
        value: "Look up a clan!",
        inline: false,
      },
      {
        name: "!player [player-tag]",
        value: "Stalk your special someone <3",
        inline: false,
      },
      {
        name: "!cards [player-tag]",
        value: "Admire your special someone's cards <33",
        inline: false,
      },
      {
        name: "!help",
        value: "For when you need help.",
        inline: false,
      }
    )
    .setTimestamp();

  channel.send(embed);
}

function processHelp(channel) {
  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Need help?")
    .setAuthor(
      "Flazey's Helper Thang",
      "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
      // "https://discord.js.org"
    )
    .setThumbnail("https://cdn.frankerfacez.com/emoticon/263833/4")
    .setDescription(
      "You don't need help shhh... just use **!commands**. But if you insist... follow this [link](https://www.youtube.com/watch?v=dQw4w9WgXcQ)."
    )
    .setTimestamp();

  channel.send(embed);
}

async function processClan(secondaryCommand, channel) {
  var clan = undefined;
  if (secondaryCommand === undefined) {
    clan = await clash.clan("#YQYYGC02");
    // console.log("clan: ", clan.data.name, clan.data.tag, clan.data.description);
  } else {
    try {
      if (secondaryCommand.substr(0, 1) !== "#") {
        var secondaryCommand = "#" + secondaryCommand;
      }
      clan = await clash.clan(secondaryCommand.toUpperCase());
    } catch (error) {
      channel.send(
        "Invalid clan tag: **" +
          secondaryCommand +
          "**. Try again! (ex: !clan #YQYYGC02 or !clan YQYYGC02)"
      );
    }
  }
  try {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(clan.data.name + " " + clan.data.tag)
      .setURL("https://royaleapi.com/clan/" + clan.data.tag.substr(1))
      .setAuthor(
        "Flazey's Clan Thang",
        "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
      )
      .setDescription("Clan Stuff")
      .addFields(
        { name: "Description", value: clan.data.description, inline: false },
        { name: "Tag", value: clan.data.tag, inline: false }
      )
      .setTimestamp();

    channel.send(embed);
  } catch (error) {}
}

async function processPlayer(secondaryCommand, channel) {
  try {
    if (secondaryCommand.substr(0, 1) !== "#") {
      var secondaryCommand = "#" + secondaryCommand;
    }
    var player = await clash.player(secondaryCommand.toUpperCase());

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(player.data.name + " " + player.data.tag)
      .setURL("https://royaleapi.com/player/" + player.data.tag.substr(1))
      .setAuthor(
        "Flazey's Player Profile Thang",
        "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
      )
      .setDescription("Player Profile ez dab")
      .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
      .addFields(
        { name: "Trophy Count", value: player.data.trophies, inline: false },
        { name: "Level", value: player.data.expLevel, inline: false },
        { name: "Role", value: player.data.role, inline: false },
        { name: "War Day Wins", value: player.data.warDayWins, inline: false },
        {
          name: "Favorite Card: ",
          value: player.data.currentFavouriteCard.name,
          inline: false,
        }
      )
      .setTimestamp();

    channel.send(embed);
  } catch (error) {
    channel.send(
      "Invalid gamer tag: **" +
        secondaryCommand +
        "**. Try again! (ex: !player #YG200UJ0 or !player YG200UJ0)"
    );
  }
}

async function processCards(secondaryCommand, channel) {
  try {
    if (secondaryCommand.substr(0, 1) !== "#") {
      var secondaryCommand = "#" + secondaryCommand;
    }

    var player = await clash.player(secondaryCommand.toUpperCase());

    //Testing
    // const player = await clash.player("#YG200UJ0");

    // console.log(player.data.cards);

    let arr = player.data.cards;
    let sortedArr = sortByKey(arr, "level", "maxLevel");
    let level13 = [];
    let level12 = [];
    let level11 = [];
    let level10 = [];

    // console.log(sortedArr);

    for (i = 0; i < sortedArr.length; i++) {
      var level = 13 - (sortedArr[i].maxLevel - sortedArr[i].level);
      if (level === 10) {
        level10.push(sortedArr[i].name);
      } else if (level === 11) {
        level11.push(sortedArr[i].name);
      } else if (level === 12) {
        level12.push(sortedArr[i].name);
      } else if (level === 13) {
        level13.push(sortedArr[i].name);
      }
    }
    if (level13.length === 0) {
      level13.push("N/A");
    }
    if (level12.length === 0) {
      level12.push("N/A");
    }
    if (level11.length === 0) {
      level11.push("N/A");
    }
    if (level10.length === 0) {
      level10.push("N/A");
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(player.data.name + " " + player.data.tag)
      .setURL("https://royaleapi.com/player/" + player.data.tag.substr(1))
      .setAuthor(
        "Flazey's Card Thang",
        "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
      )
      .setDescription("Cards")
      .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
      .addFields(
        { name: "Level 13", value: level13, inline: false },
        { name: "Level 12", value: level12, inline: false },
        { name: "Level 11", value: level11, inline: false },
        { name: "Level 10", value: level10, inline: false }
      )
      .setTimestamp();

    channel.send(embed);
  } catch (error) {
    channel.send(
      "Invalid gamer tag: **" +
        secondaryCommand +
        "**. Try again! (ex: !cards #YG200UJ0 or !cards YG200UJ0)"
    );
  }
}

function sortByKey(array, key, maxLevel) {
  return array.sort(function (a, b) {
    var x = 13 - (a[maxLevel] - a[key]);
    var y = 13 - (b[maxLevel] - b[key]);
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

processGet = async (secondaryCommand, channel) => {
  axios
    .get(DB_URL + "/api")
    .then((response) => {
      const data = response.data;
      console.log("Data retrieved: ", data[data.length - 1]);
      sendRetrievedData(data[data.length - 1], secondaryCommand, channel);
    })
    .catch((error) => {
      console.log(error);
    });
};

sendRetrievedData = (data, secondaryCommand, channel) => {
  console.log("data: ", data.WarCards);
  // channel.send("Warcard list: " + data.WarCards);
  // var war = "mega knight, musketeer, justin,jay,ja ";
  console.log("SPLIT! ", data.WarCards.split(/, |,| ,/));
  let arr = data.WarCards.split(/, |,| ,/);
};

processSave = async (data, channel) => {
  console.log("data: ", data);
  let arr = data.split(/, |,| ,/);
  console.log("arr ", arr);

  let payload = { WarCards: data };
  await axios
    .post(DB_URL + "/api/save", payload)
    .then((response) => {
      console.log("Saved: ", response.data);
      channel.send("Data saved!");
    })
    .catch((error) => {
      console.log(error);
    });
};

processDelete = async (channel) => {
  channel.send("delete!");
  // const wc = WarCardData();
  // WarCards.deleteMany({});

  console.log(returnStuff());
};

returnStuff = async () => {
  var WarCards = require("./models/warCards");

  const wc = await WarCards.findOne({ warcards: "yep warcards!" }).exec();
  return wc;
};

//await axios
// .post(MAILER_API_URL + "/api/Mailer/sendBlastEmail", {
//   recipientEmail: emailList,
//   blastSubject: subject,
//   blastContent: content,
// })
// .then((response) => {
//   console.log("Response? ", response.data);
// })
// .catch((error) => {
//   status.error = true;
//   status.responseData = error;
//   console.log("Wrong: ", error);
// });
