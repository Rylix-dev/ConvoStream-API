import app from "./config/init.js";

import connect from "./api/connect/connect.js";
import user from "./api/user/main.js";
import chats from "./api/chats/main.js";

import "./api/sockets/main.js";

app.use("/connect", connect);
app.use("/user", user);
app.use("/chats", chats);
