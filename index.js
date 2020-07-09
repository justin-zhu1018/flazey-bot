const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require("clash-royale-api");

//Used in testing
const config = require("./config.json");
const clash = new Client(config.testToken);

//Used for Heroku
// const clash = new Client(process.env.CR_API_TOKEN);

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("Clash Royale");

  client.guilds.cache.forEach((guild) => {
    console.log(guild.name);
    guild.channels.cache.forEach((channel) => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });
  });
  // let generalChannel = client.channels.cache.get("730295406189215747");
  let botChannel = client.channels.cache.get("730528385385889834");
  //   const attachment = new Discord.MessageAttachment(
  //     "https://clashroyale.com/uploaded-images-blog/CR_facebook_share_02_180403_175322.jpg?mtime=20180403175322"
  //   );

  // generalChannel.send("I am here! For a list of the commands, type !commands");

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
    channel.send(
      "List of commands: ```" +
        "!commands\n" +
        "!help\n" +
        "!clan\n" +
        "!player [player-tag]\n" +
        "!cards [player-tag]\n" +
        "```"
    );
  } else if (primaryCommand === "help") {
    channel.send("You don't need help shhh... just use **!commands**");
  } else if (primaryCommand === "clan") {
    processClan(channel);
  } else if (primaryCommand === "player") {
    processPlayer(secondaryCommand, channel);
  } else if (primaryCommand === "cards") {
    processCards(secondaryCommand, channel);
  } else {
    channel.send(
      "Error: No command specified. For a list of commands, type !commands"
    );
  }
}

async function processClan(channel) {
  // const res = await fetchData();
  // const res = await fetchCR();
  const clan = await clash.clan("#YQYYGC02");
  console.log("clan: ", clan.data.name, clan.data.tag, clan.data.description);
  // channel.send(
  //   "```Our clan: \n" +
  //     clan.data.name +
  //     "\nTag: " +
  //     clan.data.tag +
  //     "\nDescription: " +
  //     clan.data.description +
  //     "```"
  // );

  const embed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(clan.data.name + " " + clan.data.tag)
    .setURL("https://royaleapi.com/clan/" + clan.data.tag.substr(1))
    .setAuthor(
      "Flazey's Clan Thang",
      "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
      // "https://discord.js.org"
    )
    .setDescription("Clan Stuff")
    // .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
    .addFields(
      { name: "Description", value: clan.data.description, inline: false },
      { name: "Tag", value: clan.data.tag, inline: false }
      // { name: "Level 11", value: level11, inline: false },
      // { name: "Level 10", value: level10, inline: false }
    )
    .setTimestamp();

  channel.send(embed);
}

async function processPlayer(secondaryCommand, channel) {
  try {
    if (secondaryCommand.substr(0, 1) !== "#") {
      var secondaryCommand = "#" + secondaryCommand;
    }
    const player = await clash.player(secondaryCommand.toUpperCase());
    // const img = player.data.currentFavouriteCard.iconUrls.medium;

    // console.log("Card: ", img);

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(player.data.name + " " + player.data.tag)
      .setURL("https://royaleapi.com/player/" + player.data.tag.substr(1))
      .setAuthor(
        "Flazey's Player Profile Thang",
        "https://i.ytimg.com/vi/CCYCI9FINME/maxresdefault.jpg"
        // "https://discord.js.org"
      )
      .setDescription("Player Profile ez dab")
      .setThumbnail(player.data.currentFavouriteCard.iconUrls.medium)
      .addFields(
        { name: "Trophy Count", value: player.data.trophies, inline: false },
        { name: "Level", value: player.data.expLevel, inline: false },
        { name: "Role", value: player.data.role, inline: false },
        { name: "War Day Wins", value: player.data.warDayWins, inline: false }
      )
      .setTimestamp();

    channel.send(embed);
  } catch (error) {
    channel.send(
      "Invalid gamer tag: " +
        secondaryCommand +
        ". Try again! (ex: !player #YG200UJ0 or !player YG200UJ0)"
    );
  }
  // }
}

async function processCards(secondaryCommand, channel) {
  try {
    if (secondaryCommand.substr(0, 1) !== "#") {
      var secondaryCommand = "#" + secondaryCommand;
    }
    const player = await clash.player(secondaryCommand.toUpperCase());
    let arr = player.data.cards;
    let sortedArr = sortByKey(arr, "level");
    let level13 = [];
    let level12 = [];
    let level11 = [];
    let level10 = [];
    // console.log(sortedArr);
    for (i = 0; i < sortedArr.length; i++) {
      if (sortedArr[i].level === 10) {
        // console.log("level 10");
        level10.push(sortedArr[i].name);
      } else if (sortedArr[i].level === 11) {
        // console.log("level 11");
        level11.push(sortedArr[i].name);
      } else if (sortedArr[i].level === 12) {
        // console.log("level 12");
        level12.push(sortedArr[i].name);
      } else if (sortedArr[i].level === 13) {
        // console.log("level 13");
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
        // "https://discord.js.org"
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
      "Invalid gamer tag: " +
        secondaryCommand +
        ". Try again! (ex: !cards #YG200UJ0 or !cards YG200UJ0)"
    );
    console.log("error: ", error);
  }
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}
// async function fetchData() {
//   const response = await fetch(
//     "https://finnhub.io/api/v1/quote?symbol=MSFT&token=br906t7rh5ral083k820"
//   );
//   const json = await response.json();
//   // console.log("json: ", json);
//   return json;
// }

// async function fetchCR() {
//   console.log("try fetch start");
//   try {
//     const response = await fetch(
//       "https://api.clashroyale.com/v1/clans/%23YQYYGC02",
//       {
//         method: "get",
//         // url: ``,
//         // baseURL: 'https://api.clashroyale.com/v1/',
//         headers: {
//           Accept: "application/json",
//           authorization: `Bearer ${config.tokenCR}`,
//         },
//       }
//     );
//     console.log("response: ", response.body);
//   } catch (error) {
//     console.log("error: ");
//   }
// }

//Used in Heroku
// client.login(process.env.BOT_TOKEN);

//Used in testing
client.login(config.token);
