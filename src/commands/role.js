// import { database } from "../../handler/mongodb.mjs";
// import { SlashCommandBuilder } from "discord.js";
const { database } = require("../../handler/mongodb");
const { SlashCommandBuilder } = require("discord.js");

/**
 *
 * @param {import("discord.js").Interaction} interaction
 */

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
  async execute(interaction) {
    interaction.reply({ ephemeral: true, content: "F U :)" });
  },
};
