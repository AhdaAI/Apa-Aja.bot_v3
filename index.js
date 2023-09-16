const { config } = require("dotenv");
const { Client, GatewayIntentBits } = require("discord.js");
const { registering } = require("./registerSlash");
const mongoose = require("mongoose");
const { connecting } = require("./handler/database/mongoose");
const { readdirSync } = require("fs");
const { join } = require("path");
config();

const token = process.env.TOKEN;
const clientID = process.env.CLIENT;
const mongo = process.env.MONGODB;

console.log("\n\t|=====|");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// mongoose
//   .connect(mongo, { dbName: "Discord" })
//   .then(() => console.log("[!] Successfully connected to MongoDB Database."))
//   .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

connecting(mongo)
  .then(() => console.log("[!] Successfully connected to MongoDB Database."))
  .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

module.exports = client;

readdirSync(`${join(__dirname, "/src")}/events`).filter((file) => {
  if (file.endsWith(".js")) {
    console.log(`[*] Getting event => ${file}`);
    const event = require(`${join(__dirname, "/src")}/events/${file}`);

    if (event.once) {
      client.once(event.name, async (...args) => event.execute(...args));
    } else {
      client.on(event.name, async (...args) => event.execute(...args));
    }
  }
});

client.login(token).then(() => {
  console.log("[!] Connected to Discord Bot.");
});
registering(token, clientID, client);
