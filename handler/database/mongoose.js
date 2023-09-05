const { Schema, model, connect, connection } = require("mongoose");

const schematic = new Schema({
  id: Number,
  GSHword: [String],
  settings: [
    {
      name: String,
      description: String,
      required: Boolean,
    },
  ],
  customs: {
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

module.exports = model("servers", schematic);
module.exports = { connecting };
