// import { database } from "../../handler/mongodb.mjs";
// import { SlashCommandBuilder } from "discord.js";
const { database } = require("../../handler/mongodb");
const { SlashCommandBuilder, CommandInteraction } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Choose the role you want to join or leave.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select your role.")
        .setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const serverId = interaction.guildId;
    const role = interaction.options.data[0].role;

    // interaction.member.roles

    // if (interaction.member.roles) {
    //   interaction.member.roles.remove(role);
    // } else {
    //   interaction.member.roles.add(role);
    // }
    await interaction.reply({ ephemeral: true, content: "running..." });
  },
};
