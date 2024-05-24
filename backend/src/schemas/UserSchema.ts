import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  apiToken: {
    type: String,
  },
  apiSecret: {
    type: String,
  },
  dbId: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
