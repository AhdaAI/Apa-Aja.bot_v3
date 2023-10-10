const {
  SlashCommandBuilder,
  SlashCommandStringOption,
  CommandInteraction,
  codeBlock,
  EmbedBuilder,
  SlashCommandChannelOption,
  SlashCommandRoleOption,
} = require("discord.js");
const { database } = require("../../handler/database/mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Setting options and setup.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("mode")
        .setDescription("What you want to do?")
        .addChoices(
          { name: "show", value: "show" },
          { name: "set", value: "set" },
          { name: "delete", value: "delete" }
        )
        .setRequired(true)
    )
    .addChannelOption(
      new SlashCommandChannelOption()
        .setName("channel")
        .setDescription("Adding channel to database.")
        .setRequired(false)
    )
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName("role")
        .setDescription("Adding role to database.")
        .setRequired(false)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const server = interaction.guild;
    const mode = interaction.options.getString("mode");
    const channel = interaction.options.getChannel("channel") ?? false;
    const role = interaction.options.getRole("role") ?? false;

    // Setting embed
    const setting = new EmbedBuilder()
      .setTitle("Settings")
      .setColor("DarkOrange");

    const data =
      (await database.findOne({ guild: server.id }).exec()) ??
      new database({ guild: server.id });

    switch (mode) {
      case "show":
        setting.setDescription(
          "show | `/settings show`\nset | `/settings set [channel]`\nupdate | `settings update [embed]`"
        );

        if (data.customs.channels.length > 0) {
          const channels = data.customs.channels.map((ch) => ch.name);

          setting.addFields({
            name: "Channels",
            value: codeBlock(channels.join("\n")),
            inline: true,
          });
        } else {
          setting.addFields({
            name: "Channels",
            value: codeBlock("Empty"),
            inline: true,
          });
        }

        if (data.customs.roles.length > 0) {
          const Roles = data.customs.roles.map((ch) => ch.name);

          setting.addFields({
            name: "Roles",
            value: codeBlock(Roles.join("\n")),
            inline: true,
          });
        } else {
          setting.addFields({
            name: "Roles",
            value: codeBlock("Empty"),
            inline: true,
          });
        }
        await interaction.reply({ embeds: [setting], ephemeral: true });
        break;

      case "set":
        if (!channel && role) {
          data.customs.roles.push({ name: role.name, id: role.id });
        } else if (!role && channel) {
          data.customs.channels.push({ name: channel.name, id: channel.id });
        } else {
          data.customs.channels.push({ name: channel.name, id: channel.id });
          data.customs.roles.push({ name: role.name, id: role.id });
        }

        data.save();

        await interaction.reply({
          ephemeral: true,
          content: codeBlock("json", data.customs),
        });
        break;

      case "delete":
        if (!channel && !role) {
          await interaction.reply({
            ephemeral: true,
            content: codeBlock("Please spesified the deleted data."),
          });
          break;
        }

        if (channel) {
          const temp = data.customs.channels.filter(
            (ch) => ch.name != channel.name
          );
          data.customs.channels = temp;
        }

        if (role) {
          const temp = data.customs.roles.filter((rl) => rl.name != role.name);
          data.customs.roles = temp;
        }

        data.save();

        await interaction.reply({
          ephemeral: true,
          content: codeBlock("json", data.customs),
        });
        break;

      default:
        await interaction.reply({
          content: codeBlock("Interaction failed."),
          ephemeral: true,
        });
        break;
    }
  },
};
