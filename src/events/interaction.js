const { codeBlock, CommandInteraction } = require("discord.js");
const { registered } = require("../../registerSlash");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   *
   * @param {CommandInteraction} interaction
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
        if (interaction.isRepliable()) {
          return interaction.reply({
            content: "An error has occured. Please contact admin.",
          });
        } else {
          return interaction.editReply({
            content: "An error has occured. Please contact admin.",
          });
        }
      }
    }
  },
};
