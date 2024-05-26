import connect from "./api/connect/connect.js";
import { user } from "./api/user/main.js";
import "./sockets/init.js";
import "./config/init.js";
import chats from "./api/chats/main.js";


const cs = {
  connect,
  user,
  chats,
};

export default cs;
