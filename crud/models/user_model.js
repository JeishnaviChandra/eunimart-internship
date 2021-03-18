const mongoose = require("../db");
const schema = new mongoose.Schema(
  {
    name: {
      desc: "user's name.",
      // trim: true,
      type: String,
      required: true,
    },
    age: {
      desc: "users's age.",
      type: Number,
    },
    gender: {
      desc: "gender.",
      // trim: true,
      type: String,
      enum: ["Male", "Female", "Others"],
      default: "Others",
      required: true,
    },
  },
  
);

module.exports = mongoose.model("Users", schema);