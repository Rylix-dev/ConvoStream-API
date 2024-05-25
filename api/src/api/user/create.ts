import axios from "axios";
import { z } from "zod";
import nacl from "tweetnacl";
import authenticate from "./authenticate.js";

const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string
) => {
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
      .then((response) => {
        if (response.data.error) {
          reject(response.data.error);
        }

        authenticate(username, password)
          .then((res) => {
            resolve({ response: response.data, secretKey, auth: res });
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
