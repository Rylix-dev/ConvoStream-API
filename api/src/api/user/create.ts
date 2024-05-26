import axios from "axios";
import { z } from "zod";
import nacl from "tweetnacl";
import authenticate from "./authenticate.js";
import Response from "../../@types/Response.js";

/**
 * Creates a new user with the provided information.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Response<{ response: any; secretKey: Uint8Array; auth: Response<{ token: string }> }>>} A promise containing the creation response, secret key, and authentication token.
 * @throws {string} Throws an error if user data is invalid or if there's an error during user creation or authentication.
 */
const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string
): Promise<
  Response<{
    response: any;
    secretKey: Uint8Array;
    auth: Response<{ token: string }>;
  }>
> => {
  return new Promise((resolve, reject) => {
    const userObj = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      username: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+$/)
        .trim(),
      password: z.string().min(8),
    });

    try {
      userObj.parse({
        firstName,
        lastName,
        email,
        username,
        password,
      });
    } catch (error) {
      reject("Invalid user data");
    }

    const keyPair = nacl.box.keyPair();
    const publicKey = keyPair.publicKey;
    const secretKey = keyPair.secretKey;

    axios
      .post(`${global.cs_apiUrl}/user/create`, {
        firstName,
        lastName,
        email,
        username,
        password,
        publicKey: Buffer.from(publicKey).toString("base64"),
      })
      .then((response: { data: Response }) => {
        if (response.data.error) {
          reject(response.data.error);
        }

        authenticate(username, password)
          .then((res) => {
            resolve({
              data: {
                response: response.data,
                secretKey,
                auth: res,
              },
            });
          })
          .catch((err) => {
            reject(err || "Internal Server Error");
          });
      })
      .catch((err) => {
        reject(err?.response?.data?.error || "Internal Server Error");
      });
  });
};

export default createUser;
