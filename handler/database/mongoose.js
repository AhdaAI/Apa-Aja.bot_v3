const { model, connect, connection, default: mongoose } = require("mongoose");

const schematic = new mongoose.Schema({
  guild: String,
  GSHword: [String],
  settings: [
    {
      name: String,
      description: String,
      required: Boolean,
    },
  ],
  customs: {
    channels: [
      {
        name: String,
        id: String,
      },
    ],
    roles: [
      {
        name: String,
        id: String,
      },
    ],
    embeds: [
      {
        name: String,
        value: String,
        inline: Boolean,
      },
    ],
  },
});

const connecting = async (mongodbURL) => {
  await connect(mongodbURL, { dbName: "Discord" });

  return new Promise((resolve, reject) => {
    connection.once("error", (err) => {
      reject(err);
    });

    resolve(connection.db);
  });
};

module.exports = { database: model("server", schematic), connecting };
