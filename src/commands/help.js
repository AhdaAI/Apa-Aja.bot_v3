const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help is on its way."),
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    const embedText = new EmbedBuilder()
      .setTitle("Help is here.")
      .setDescription("All the help you need")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      });

    const fields = [];

    fields.push({
      name: "Role Selections",
      value: codeBlock(
        "Put the bot's role on top of the desired role to add. Remember to never put the role of this bot on top of admin role."
      ),
      inline: true,
    });

    embedText.addFields(fields);
    await interaction.reply({ embeds: [embedText] });
  },
};
