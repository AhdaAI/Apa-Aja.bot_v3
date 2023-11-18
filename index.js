const { config } = require("dotenv");
const { Client, GatewayIntentBits, ActivityType, REST } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
config();

const token = process.env.TOKEN;

const rest = new REST().setToken(token);

console.log("\n\t|=====|");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  presence: {
    activities: [{ name: "With Your Sibling...", type: ActivityType.Playing }],
  },
});
// mongoose
//   .connect(mongo, { dbName: "Discord" })
//   .then(() => console.log("[!] Successfully connected to MongoDB Database."))
//   .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

// connecting(mongo)
//   .then(() => console.log("[!] Successfully connected to MongoDB Database."))
//   .catch((e) => console.log(`[?] ERROR!!!\n${e}`));

module.exports = rest;

readdirSync(`${join(__dirname, "/src")}/events`).filter((file) => {
  if (file.endsWith(".js")) {
    console.log(`[ Events ] Getting event => ${file}`);
    const event = require(`${join(__dirname, "/src")}/events/${file}`);

    if (event.once) {
      client.once(event.name, async (...args) => event.execute(...args));
    } else {
      client.on(event.name, async (...args) => event.execute(...args));
    }
  }
});

client.login(token);
