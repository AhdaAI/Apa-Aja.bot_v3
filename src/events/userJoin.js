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
    const data = await database.findOne({ id: server.id }).exec();

    console.log(data);

    return member.send({ content: "hi" });
  },
};
