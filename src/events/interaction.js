const { codeBlock } = require("discord.js");
const { registered } = require("../../registerSlash");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = registered.get(interaction.commandName);

      // Unknown command
      if (!command) {
        return await interaction.reply({
          ephemeral: true,
          content: codeBlock("404 Error: Unknown command"),
        });
      }

      // Known command
      try {
        await command.execute(interaction);
      } catch (e) {
        console.log(e);
        if (interaction.replied()) {
          return interaction.editReply({
            content: "An error has occured. Please contact admin.",
          });
        } else {
          return interaction.reply({
            ephemeral: true,
            content: "An error has occured. Please contact admin.",
          });
        }
      }
    }
  },
};
