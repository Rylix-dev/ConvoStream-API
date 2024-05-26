import axios from "axios";
import { z } from "zod";
import Response from "../../@types/Response";

/**
 * Connects to the API using the provided API key and secret.
 * @param {string} apiKey - The API key, must be 32 characters long.
 * @param {string} apiSecret - The API secret, must be 32 characters long.
 * @returns {Promise<Response<{ token: string }>>} A promise containing the connection response with a token.
 * @throws {string} Throws an error if the API key or secret is invalid or if there's an internal server error.
 */

const connect = (
  apiKey: string,
  apiSecret: string
): Promise<Response<{ token: string }>> => {
  return new Promise((resolve, reject) => {
    const apiKeySchema = z.string().length(32);
    const apiSecretSchema = z.string().length(32);

    try {
      apiKeySchema.parse(apiKey);
      apiSecretSchema.parse(apiSecret);
    } catch (error) {
      reject("Invalid API Key or Secret");
    }

    axios
      .post(`${global.cs_apiUrl}/connect`, {
        apiKey,
        apiSecret: apiSecret,
      })
      .then((response: { data: Response<{ token: string }> }) => {
        if (response.data.error) {
          reject(response.data.error);
        }

        global.cs_token = response?.data?.data?.token as string;
        global.cs_apiSecret = apiSecret;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${global.cs_token}`;

        resolve(response.data);
      })
      .catch(() => {
        reject("Internal Server Error");
      });
  });
};

export default connect;
