const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: "Name is required",
    },
    githubID: {
      type: Number,
      required: [true],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
