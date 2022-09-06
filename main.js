require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = process.env.SECRET_KEY;

let data = [];

// edit-api // hi
fetch("https://gdscyzu.github.io/rss-friend/sorted.json")
  .then((res) => res.json())
  .then((json) => {
    data = json;
  });

// When the client is ready, run this code (only once)
// main edit
client.once("ready", (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  // logged out if no News aka. we have no new post yesterday.
  const yesterday = new Date();
  const firstDate = new Date(data[0].date);
  if (
    firstDate.getDate() != yesterday.getDate() ||
    firstDate.getMonth() != yesterday.getMonth() ||
    firstDate.getFullYear() != yesterday.getFullYear()
  ) {
    console.log("No Avilable News");
    process.exit();
  }

  // edit-channel-id
  let channel = client.channels.cache.get("834803077131010078");
  let returnData = String();
  returnData += "> **NewsLetter :**\n";
  for (let i = 0; i < 3 && i < data.length; i++) {
    const tempDate = new Date(data[i].date);
    if (!samedate(tempDate, yesterday)) continue;
    if (i != 0) returnData += "> \n";
    returnData += "> ";
    if (tempDate.getMonth() < 9) returnData += "0";
    returnData += String(tempDate.getMonth() + 1) + "/";
    if (tempDate.getDate() < 10) returnData += "0";

    returnData += String(tempDate.getDate()) + " ";

    returnData += String(data[i].title) + "\n";
    returnData += "> link: " + String(data[i].link) + "\n";
  }
  channel.send(returnData).then(() => {
    client.destroy();
  });
});

function samedate(a, b) {
  if (
    a.getDate() != b.getDate() ||
    a.getMonth() != b.getMonth() ||
    a.getFullYear() != b.getFullYear()
  ) {
    return false;
  }
  return true;
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user") {
    await interaction.reply(
      `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
    );
  } else if (commandName === "newsletter") {
    let returnData = String();
    returnData += "> **NewsLetter :**\n";
    for (let i = 0; i < 3 && i < data.length; i++) {
      const tempDate = new Date(data[i].date);
      returnData += "> ";
      if (tempDate.getMonth() < 9) returnData += "0";
      returnData += String(tempDate.getMonth() + 1) + "/";
      if (tempDate.getDate() < 10) returnData += "0";

      returnData += String(tempDate.getDate()) + " ";

      returnData += String(data[i].title) + "\n";
      returnData += "> link: " + String(data[i].link) + "\n";
      if (i + 1 < 3 && i + 1 < data.length) returnData += "> \n";
    }
    await interaction.reply(returnData);
  }
});

// console.log(process.env.SECRET_KEY)
client.login(token);
