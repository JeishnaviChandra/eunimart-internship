const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    accessToken: {
        type: String,
        required: true,
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model("Shop", schema);