const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
  SlashCommandStringOption,
  codeBlock,
} = require("discord.js");
const { database } = require("../../handler/database/mongoose");
const { EmbedBuilder } = require("@discordjs/builders");
const { readdirSync } = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription("Help admin to control the bot behavior.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("command")
        .setDescription("Give the bot a command to execute.")
        .addChoices(
          { name: "list", value: "ls" },
          { name: "send", value: "send" },
          { name: "broadcast", value: "broadcast" }
        )
        .setRequired(true)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const server = interaction.guild;
    const option = interaction.options.get("command");

    switch (option.value) {
      case "ls":
        const data =
          (await database.findOne({ guild: server.id }).exec()) ?? false;

        if (!data) break;

        const command_list = readdirSync("./src/commands")
          .filter((file) => file.endsWith(".js"))
          .join("\n");

        const list_embed = new EmbedBuilder()
          .setTitle("List all functionality and data.")
          .setDescription(server.name)
          .setThumbnail(server.iconURL());

        const fields = [
          {
            name: "Commands",
            value: codeBlock(command_list),
            inline: false,
          },
          {
            name: "Channels",
            value: codeBlock("json", data.customs.channels.join("\n")),
            inline: true,
          },
          {
            name: "Roles",
            value: codeBlock("json", data.customs.roles.join("\n")),
            inline: true,
          },
        ];

        list_embed.addFields(fields);

        await interaction.reply({
          ephemeral: true,
          embeds: [list_embed],
        });
        break;

      case "send":
        break;

      case "broadcast":
        break;

      default:
        console.log(option);

        break;
    }
  },
};
