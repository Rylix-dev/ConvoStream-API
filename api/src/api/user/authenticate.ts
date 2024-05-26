import axios from "axios";
import { z } from "zod";
import Cookies from "js-cookie";
import Response from "../../@types/Response";

/**
 * Authenticates a user with the provided username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Response<{ token: string }>>} A promise containing authentication response.
 * @throws {string} Throws an error if authentication fails.
 */
const authenticate = (
  username: string,
  password: string
): Promise<Response<{ token: string }>> => {
  return new Promise((resolve, reject) => {
    const userObj = z.object({
      username: z.string().min(1),
      password: z.string().min(8),
    });

    try {
      userObj.parse({
        username,
        password,
      });
    } catch (error) {
      reject("Invalid user data");
    }

    axios
      .post(`${global.cs_apiUrl}/user/authenticate`, {
        username,
        password,
      })
      .then(
        (response: {
          data: Response<{
            token: string;
          }>;
        }) => {
          if (response.data.error) {
            reject(response.data.error);
          }
          Cookies.set("cs_auth", response.data?.data?.token as string, {
            expires: 7,
          });
          axios.defaults.headers.common[
            "user"
          ] = `Bearer ${response?.data?.data?.token}`;
          resolve(response.data);
        }
      )
      .catch((err) => {
        reject(err?.response?.data?.error || "Internal Server Error");
      });
  });
};

export default authenticate;
