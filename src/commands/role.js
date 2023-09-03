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
    let response = "";

    const check = interaction.member.roles.cache.some(
      (r) => r.name === role.name
    );

    if (!check) {
      response = `Successfuly **adding** ${role.name}`;
      interaction.member.roles.add(role);
    } else {
      response = `Successfuly **removing** ${role.name}`;
      interaction.member.roles.remove(role);
    }
    await interaction.reply({ ephemeral: true, content: response });
  },
};
