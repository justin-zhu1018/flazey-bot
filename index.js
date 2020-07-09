const Discord = require("discord.js");
const client = new Discord.Client();
const Client = require("clash-royale-api");
const clash = new Client(process.env.Test1);

//Used in testing
// const config = require("./config.json");
// const clash = new Client(config.tokenCR);
// const fetch = require("node-fetch");

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("Clash Royale");

  client.guilds.cache.forEach((guild) => {
    console.log(guild.name);
    guild.channels.cache.forEach((channel) => {
      console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
    });
  });
  let generalChannel = client.channels.cache.get("730511965092446361");
  //   const attachment = new Discord.MessageAttachment(
  //     "https://clashroyale.com/uploaded-images-blog/CR_facebook_share_02_180403_175322.jpg?mtime=20180403175322"
  //   );
  generalChannel.send("I am here! For a list of the commands, type !commands");
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
  let command = receivedMessage.content.substr(1);
  const channel = receivedMessage.channel;
  if (command === "commands") {
    channel.send("Here's a list of commands: !help, !clan, !player");
  } else if (command === "help") {
    channel.send("You don't need help shhhssssss...");
  } else if (command === "clan") {
    processClan(channel);
  } else if (command === "player") {
    channel.send("yes");
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
    "Our clan: " +
      clan.data.name +
      ", " +
      clan.data.tag +
      ", " +
      clan.data.description
  );
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
