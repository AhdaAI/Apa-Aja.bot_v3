const { REST, Routes, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const rest = require("../..");
require("dotenv").config();

// Variable
const source = join(__dirname, "../");
const list = {
  collect: new Collection(),
  commands: [],
  events: [],
};
const clientID = process.env.CLIENT;

// Exports
module.exports = {
  async register() {
    console.log("[ Slash Command ] Reading files...");
    const files = readdirSync(`${source}/commands`).filter((file) =>
      file.endsWith(".js")
    );

    files.forEach((file) => {
      let dat = require(`${source}/commands/${file}`);
      list.collect.set(dat.data.name, dat);
      list.commands.push(dat.data.toJSON());
    });

    console.log(`[ Slash Command ] Found ${list.commands.length} commands.`);

    console.log("[ Slash Command ] Registering to discord...");
    console.log("[ Slash Command ] Detecting testing server...");

    const guildID = process.argv.at(2);
    if (!guildID) {
      console.log("[ Slash Command ] No guild id.");
      await rest.put(Routes.applicationCommands(clientID), {
        body: list.commands,
      });
      console.log("[ Slash Command ] Registered.");
    } else {
      console.log("[ Slash Command ] Server found.");
      await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
        body: list.commands,
      });
      console.log("[ Slash Command ] Registered.");
    }

    return;
  },
  registered: list.collect,
};
