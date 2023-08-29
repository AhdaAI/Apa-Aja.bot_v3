const { config } = require("dotenv");
const { Client, GatewayIntentBits } = require("discord.js");
const { connection } = require("./handler/mongodb");
const { registering } = require("./registerSlash");
config();

const token = process.env.TOKEN;
const clientID = process.env.CLIENT;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
connection()
  .then(() => console.log("[!] Successfully connected to MongoDB Database."))
  .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

module.exports = client;

client.login(token).then(() => {
  console.log("[!] Connected to Discord Bot.");
});
registering(token, clientID, client);
