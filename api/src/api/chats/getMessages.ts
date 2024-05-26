import axios from "axios";
import { z } from "zod";
import Response from "../../@types/Response";
import { Message } from "../../@types/Chat";

/**
 * Retrieves messages from a chat room.
 * @param {string} roomId - The ID of the chat room.
 * @param {number} [limit=100] - The maximum number of messages to retrieve. Defaults to 100.
 * @param {number} [offset=0] - The number of messages to skip before starting to collect the result set. Defaults to 0.
 * @returns {Promise<Response<{ messages: Message[] }>>} A promise containing the response with an array of messages.
 * @throws {string} Throws an error if the input data is invalid or if there's an internal server error.
 */
const getMessages = (
  roomId: string,
  limit: number = 100,
  offset: number = 0
): Promise<Response<{ messages: Message[] }>> => {
  return new Promise((resolve, reject) => {
    const schema = z.object({
      roomId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    });

    try {
      schema.parse({
        roomId,
        limit,
        offset,
      });
    } catch (error) {
      reject("Invalid input");
    }

    axios
      .post(`${global.cs_apiUrl}/chats/getMessages`, {
        roomId,
        limit,
        offset,
      })
      .then((response: { data: Response<{ messages: Message[] }> }) => {
        if (response.data.error) {
          reject(response.data.error);
          return;
        }
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data.error || "Internal server error");
      });
  });
};

export default getMessages;
