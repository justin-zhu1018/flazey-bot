const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  client.user.setActivity("with Javascript");

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
  if (command === "help") {
    receivedMessage.channel.send("No you're not helping");
  }
  //   receivedMessage.channel.send("Yup", receivedMessage.content);
}

client.login(process.env.token);
