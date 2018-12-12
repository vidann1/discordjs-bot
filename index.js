const Discord = require("discord.js");
const client = new Discord.Client();
const botconfig = require("./botconfig.json");

const bot = new Discord.Client();

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
});

bot.on("ready", () => {
  if (message.content === "!avatar") {
    message.reply(message.author.avatarURL);
  }
});

bot.login(botconfig.token);
