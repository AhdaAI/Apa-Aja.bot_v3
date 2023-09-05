const { config } = require("dotenv");
const { Client, GatewayIntentBits } = require("discord.js");
const { registering } = require("./registerSlash");
const mongoose = require("mongoose");
const { connecting } = require("./handler/database/mongoose");
config();

const token = process.env.TOKEN;
const clientID = process.env.CLIENT;
const mongo = process.env.MONGODB;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// mongoose
//   .connect(mongo, { dbName: "Discord" })
//   .then(() => console.log("[!] Successfully connected to MongoDB Database."))
//   .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

connecting(mongo)
  .then(() => console.log("[!] Successfully connected to MongoDB Database."))
  .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

module.exports = client;

client.login(token).then(() => {
  console.log("[!] Connected to Discord Bot.");
});
registering(token, clientID, client);
