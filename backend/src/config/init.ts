import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import initDB from "./mongoose.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

dotenv.config();
initDB();

// SocketIO
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, { auth: false, mode: "development" });

export default app;
