const { Events, GuildMember } = require("discord.js");
const { database } = require("../../handler/database/mongoose");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    const server = member.guild;
    const data = await database.findOne({ guild: server.id }).exec();

    const channel = member.guild.channels.fetch(
      data.customs.channels.filter((ch) => ch.name === "welcome").id
    );

    console.log(data);

    return channel.send({ content: "hi" });
  },
};
