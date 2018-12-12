const Discord = require("discord.js");
const client = new Discord.Client();
const botconfig = require("./botconfig.json");

const bot = new Discord.Client();

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
});

// greeting
bot.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find(ch => ch.name === "welcome");
  if (!channel) return;
  channel.send(`Welcome, ${member}`);
});

// display user avatar on !avatar command
bot.on("message", message => {
  if (message.content === "!avatar") {
    message.reply(message.author.avatarURL);
    console.log(message.author.avatarURL);
  }
});

bot.on("message", message => {
  const args = message.content
    .slice(botconfig.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "invite") {
    if (!message.member.roles.some(r => ["Admin"].includes(r.name)))
      return "you don't have the permission";
  }
  message.guild.channels
    .get("general")
    .createInvite()
    .then(invite => message.channel.send(invite.url));
});

// Kick
bot.on("message", async message => {
  const args = message.content
    .slice(botconfig.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "kick") {
    if (
      !message.member.roles.some(r =>
        ["Admin", "Moderator", "Owner", "Boss"].includes(r.name)
      )
    )
      return message.reply("Sorry, you don't have permissions to use this!");
    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.kickable)
      return message.reply(
        "I cannot kick this user! Do they have a higher role? Do I have kick permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member
      .kick(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't kick because of : ${error}`
        )
      );
    message.reply(
      `${member.user.tag} has been kicked by ${
        message.author.tag
      } because: ${reason}`
    );
  }

  // Ban
  if (command === "ban") {
    if (!message.member.roles.some(r => ["Admin"].includes(r.name)))
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server");
    if (!member.bannable)
      return message.reply(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    await member
      .ban(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't ban because of : ${error}`
        )
      );
    message.reply(
      `${member.user.tag} has been banned by ${
        message.author.tag
      } because: ${reason}`
    );
  }
});

bot.login(botconfig.token);
