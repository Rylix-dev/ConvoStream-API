import mongoose, { Mongoose, Schema, model } from "mongoose";

const ReactionSchema = new Schema(
  {
    type: Map,
    of: Number,
  },
  { _id: false }
);

const MessageSchema = new Schema({
  _id: { type: Number, required: true },
  senderId: { type: Number, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ["standard", "reply"],
    required: true,
  },
  format: {
    type: String,
    enum: ["text", "image", "video", "audio", "file"],
    required: true,
  },
  url: { type: String },
  isDownloaded: { type: Boolean, default: false },
  replyTo: { type: String },
  reactions: { type: ReactionSchema, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ChatSchema = new Schema({
  userId1: { type: mongoose.Types.ObjectId, required: true },
  userId2: { type: mongoose.Types.ObjectId, required: true },
  messages: { type: [MessageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = model("Chat", ChatSchema);
export default Chat;
