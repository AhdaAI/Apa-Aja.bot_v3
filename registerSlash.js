const { rejects } = require("assert");
const { REST, Routes, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
// const client = require(".");
// import { REST, Routes } from "discord.js";
// import { readdirSync } from "fs";
// import { join, dirname } from "path";
// import { fileURLToPath } from "url";

const commands = [];
const registered = new Collection();
const events = [];
const source = join(__dirname, "/src");
const slashFiles = readdirSync(`${source}/commands`).filter((file) =>
  file.endsWith(".js")
);
const eventFiles = readdirSync(`${source}/events`).filter((file) =>
  file.endsWith(".js")
);

const registering = (token, clientID, client) => {
  console.log("\n\t|=====|");

  slashFiles.forEach((file) => {
    console.log(`[*] Registering ${file}...`);
    const fileDatas = require(`${source}/commands/${file}`);
    commands.push(fileDatas.data.toJSON());
    registered.set(fileDatas.data.name, fileDatas);
  });

  eventFiles.forEach((file) => {
    const datas = require(`${source}/events/${file}`);
    if (datas.once) {
      console.log(`[*] Registering once.`);
      client.once(datas.name, async (...args) => datas.execute(...args));
    } else {
      console.log(`[*] Registering ${file}.`);
      client.on(datas.name, async (...args) => datas.execute(...args));
    }
  });

  return new Promise(async (resolve, rejects) => {
    const rest = new REST().setToken(token);
    resolve(
      await rest.put(Routes.applicationCommands(clientID), { body: commands })
    );
  });
};

module.exports = { registering, registered };
