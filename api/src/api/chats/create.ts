import axios from "axios";
import { z } from "zod";
import socket from "../../sockets/init.js";
import Cookies from "js-cookie";
import Response from "../../@types/Response.js";
import { Chats } from "../../@types/Chat.js";

/**
 * Creates a new chat with another user.
 * @param {string} userId2 - The ID of the second user to chat with.
 * @param {string} [userData] - Optional user data for authentication. If not provided, it will attempt to use the user data stored in the cookies.
 * @returns {Promise<Response<{ chat: Chats }>>} A promise containing the response with the created chat.
 * @throws {string} Throws an error if the input data is invalid or if there's an internal server error.
 */
const create = (
  userId2: string,
  userData?: string
): Promise<Response<{ chat: Chats }>> => {
  return new Promise((resolve, reject) => {
    const createSchema = z.object({
      userId2: z.string(),
    });

    try {
      createSchema.parse({ userId2 });
    } catch (err) {
      reject("Invalid input");
      return;
    }

    axios
      .post(`${global.cs_apiUrl}/chats/create`, {
        userId2,
      })
      .then((response: { data: Response<{ chat: Chats }> }) => {
        if (response.data.error) {
          reject(response.data.error);
        }
        socket.emit(
          "chat-connect-request",
          [response.data.data?.chat._id],
          Cookies.get("cs_auth") || userData || "",
          cs_token
        );
        resolve(response.data);
      })
      .catch((err) => {
        reject(err?.response?.data?.error || "Internal Server Error");
      });
  });
};

export default create;
