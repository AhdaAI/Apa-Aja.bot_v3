const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
  SlashCommandStringOption,
  SlashCommandChannelOption,
  codeBlock,
  ChannelType,
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
          { name: "broadcast", value: "broadcast" },
          { name: "add", value: "add" }
        )
        .setRequired(true)
    )
    .addChannelOption(
      new SlashCommandChannelOption()
        .setName("channel")
        .setDescription("Define channel.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("content")
        .setDescription(
          "[Required for broadcast and add] Role id or content of a simple broadcast."
        )
        .setRequired(false)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const server = interaction.guild;
    const option = interaction.options.get("command");
    const channel = interaction.options.get("channel")?.value ?? false;
    const content = interaction.options.get("content")?.value ?? false;

    switch (option.value) {
      // List Command
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

      // Add command
      case "add":
        if (!content) {
          await interaction.reply({
            ephemeral: true,
            content: "It seems empty, please add a role id.",
          });
          break;
        }

        const role = (await interaction.guild.roles.fetch(content)) ?? false;
        if (!role) {
          await interaction.reply({
            ephemeral: true,
            content: `FAILED TO FIND ROLE. Please enable your developer mode inside advanced settings and copy the role id inside server settings.`,
          });
          break;
        }

        /**
         * Need to finish this.
         */

        break;

      // Broadcast command
      case "broadcast":
        if (!channel) {
          await interaction.reply({
            ephemeral: true,
            content: "To use this command, please add a channel.",
          });
          break;
        } else if (!content.value) {
          await interaction.reply({
            ephemeral: true,
            content: "It seems empty, please add some content.",
          });
          break;
        }

        const bc = await interaction.guild.channels.fetch(channel);
        await interaction.reply({
          content: `Sending broadcast...\n${codeBlock(content)}`,
          ephemeral: true,
        });

        try {
          bc.send(`${content}\n@everyone`);
          await interaction.editReply({ content: `Broadcast sent to ${bc}` });
        } catch (err) {
          await interaction.editReply({
            content: "Something went wrong. Please contact your admin.",
          });
        }
        break;

      default:
        await interaction.reply({
          ephemeral: true,
          content: `WAIT!!! you should not be here. Please contact your admin.`,
        });

        break;
    }
  },
};
