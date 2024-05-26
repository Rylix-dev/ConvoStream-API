import { io } from "../../config/init";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Token from "../../@types/Token";
import Payload from "../../@types/Payload";
import mongoose from "mongoose";
import { UserSchema } from "../../schemas/RootSchema";
import { ChatSchema } from "../../schemas/ChatsSchema";
import { Chats } from "../../@types/Chat";

io.on("connection", (socket: Socket) => {
  console.log("User connected");
  socket.on(
    "chat-connect-request",
    (rooms: string[], userToken: string, apiToken: string) => {
      rooms.forEach((room) => {
        try {
          verifyAccess(userToken, apiToken, room);
          socket.join(room);
        } catch (error) {
          console.log(error);
          return;
        }
      });
    }
  );
});

const verifyAccess = async (token: string, apiToken: string, room: string) => {
  const user: Token = jwt.verify(token, process.env.USER_SECRET!) as Token;
  if (!user) {
    throw new Error("Invalid token");
  }

  const api: Payload = jwt.verify(apiToken, process.env.JWT_SECRET!) as Payload;
  if (!api) {
    throw new Error("Invalid API token");
  }

  const c = mongoose.connection.useDb(api.dbId);
  const Chat = c.model("Chat", ChatSchema);
  const r = (await Chat.findById(room)) as Chats;

  console.log(r);

  if (!r) {
    throw new Error("Invalid room " + room);
  }

  if (r.userId1.toString() !== user._id && r.userId2.toString() !== user._id) {
    throw new Error("Unauthorized");
  }

  return user;
};
