const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return ping."),

  async execute(interaction) {
    return interaction.reply({ ephemeral: true, content: "Ping!" });
  },
};
