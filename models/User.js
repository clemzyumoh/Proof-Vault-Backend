//const mongoose = require("mongoose");
import mongoose from "mongoose"



const userSchema = new mongoose.Schema(
  {
    civicId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
