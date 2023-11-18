const { Events, Client } = require("discord.js");
const { register } = require("../components/slashcommand.js");
const { connecting } = require("../../handler/database/mongoose.js");

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log("[ Client ] Discord client ready!");
    console.log("[ Client ] Registering slash command...");
    register();
    console.log("[ Client ] Connecting to mongodb...");
    connecting()
      .then(() => console.log("[ Mongodb ] Connected to mongodb."))
      .catch((e) => console.log(`[ Mongodb ] An error has occured.\n${e}`));
  },
};
