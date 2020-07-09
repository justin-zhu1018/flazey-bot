const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require("clash-royale-api");
// const clash = new Client(process.env.Test);
// console.log("Test1 ", process.env.Test1);
// console.log("Test2 ", process.env.Test2);
// console.log("Test3 ", process.env.Test3);
// const fetch = require("node-fetch");

//Used in testing
// const config = require("./config.json");
// const clash = new Client(config.testToken);

//Used for Heroku
const clash = new Client(process.env.CR_API_TOKEN);

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
        "!player [player-tag] ```"
    );
  } else if (primaryCommand === "help") {
    channel.send("You don't need help shhh...");
  } else if (primaryCommand === "clan") {
    processClan(channel);
  } else if (primaryCommand === "player") {
    processPlayer(secondaryCommand, channel);
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
  channel.send(
    "```Our clan: \n" +
      clan.data.name +
      "\nTag: " +
      clan.data.tag +
      "\nDescription: " +
      clan.data.description +
      "```"
  );
}

async function processPlayer(secondaryCommand, channel) {
  if (secondaryCommand === undefined) {
    channel.send("Invalid player tag, try again!");
  } else if (secondaryCommand.length <= 9) {
    channel.send("Invalid player tag, try again!");
  } else {
    // const player = await clash.player(secondaryCommand);
    if (secondaryCommand.substr(0, 1) !== "#") {
      let hash = "#";
      let secondaryCommand = hash + secondaryCommand;
    }
    const player = await clash.player(secondaryCommand.toUpperCase());
    const img = player.data.currentFavouriteCard.iconUrls.medium;
    // const attachment = new Discord.MessageAttachment(img);
    // console.log("Secondary Command: ", secondaryCommand);
    // console.log("Player data: ", player.data);
    console.log("Card: ", img);
    // channel.send(
    //   "Player " +
    //     player.data.name +
    //     ": \n" +
    //     player.data.trophies +
    //     " trophies \nLevel " +
    //     player.data.expLevel
    // );
    channel.send(
      "```Player: " +
        player.data.name +
        " \nTrophy Count: " +
        player.data.trophies +
        "  \nLevel " +
        player.data.expLevel +
        "\nRole: " +
        player.data.role +
        "\nWar Day Wins: " +
        player.data.warDayWins +
        "\nCurrent Favorite Card: " +
        player.data.currentFavouriteCard.name +
        "```"
    );
    // channel.send(
    //   "**Player: " +
    //     player.data.name +
    //     "** \nTrophy Count: " +
    //     player.data.trophies +
    //     "  \nLevel " +
    //     player.data.expLevel
    // );
  }

  // console.log("Test:)
  // try {
  //   const player = await clash.player(secondaryCommand);
  //   channel.send("Player: "+ player);
  // } catch (error) {
  //   channel.send("Player: "+ secondaryCommand+ " is invalid. Please try again.");

  //   console.log(error);
  // }
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

client.login(process.env.BOT_TOKEN);
// client.login(config.token);
