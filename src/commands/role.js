const {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandStringOption,
  EmbedBuilder,
  codeBlock,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { database } = require("../../handler/database/mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Choose the role you want to join or leave.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("mode")
        .setDescription(
          "GUI will give you a panel to select, auto will assign you to the role automatically"
        )
        .addChoices(
          { name: "GUI", value: "gui" },
          { name: "Auto", value: "auto" }
        )
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("(Required if using auto mode) Select your role.")
        .setRequired(false)
    ),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const serverId = interaction.guildId;
    const mode = interaction.options.getString("mode");
    let response = "";

    switch (mode) {
      case "gui":
        const data = await database.findOne({ guild: serverId }).exec();

        if (!data) {
          await interaction.reply({
            content: codeBlock(
              "Data not found.\nPlease use /settings set [role] to use this command"
            ),
          });

          break;
        } else {
          const options = data.customs.roles.map((rl) =>
            new StringSelectMenuOptionBuilder()
              .setLabel(rl.name)
              .setValue(rl.id)
          );
          const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("role")
            .setPlaceholder("List of roles")
            .addOptions(options);

          const row = new ActionRowBuilder().addComponents(selectMenu);

          const ui = new EmbedBuilder()
            .setTitle("Role Selections")
            .setDescription("Please select desired role...")
            .setColor("Blue")
            .setTimestamp(Date.now())
            .setThumbnail(interaction.guild.iconURL());

          await interaction.reply({ embeds: [ui], components: [row] });
          break;
        }

      case "auto":
        const role = interaction.options.data[0].role;

        if (interaction.member.permissions.has(role)) {
          console.log("true");
        }

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
        break;

      default:
        break;
    }
  },
};
