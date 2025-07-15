import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: Object,
      default: {},
    },
  },
  { minimize: false } // To ensure empty objects are stored in MongoDB
);

const User = mongoose.model("User", userSchema);

export default User;
