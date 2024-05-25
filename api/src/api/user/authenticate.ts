import axios from "axios";
import { z } from "zod";
import Cookies from "js-cookie";

const authenticate = (username: string, password: string) => {
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
      .then((response) => {
        if (response.data.error) {
          reject(response.data.error);
        }
        Cookies.set("cs_auth", response.data.token, { expires: 7 });
        resolve(response.data);
      })
      .catch((err) => {
        reject(err?.response?.data?.error || "Internal Server Error");
      });
  });
};

export default authenticate;