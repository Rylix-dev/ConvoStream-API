import axios from "axios";
import { z } from "zod";

const resetPassword = (password: string, newPassword: string) => {
  return new Promise((resolve, reject) => {
    const userObj = z.object({
      password: z.string(),
      newPassword: z.string(),
    });

    try {
      userObj.parse({ password, newPassword });
    } catch (error) {
      reject("Invalid input");
    }

    axios
      .post(`${global.cs_apiUrl}/user/resetPassword`, {
        password,
        newPassword,
      })
      .then((response) => {
        if (response.data.error) {
          reject(response.data.error);
        }
        resolve(response.data);
      })
      .catch((err) => {
        reject(
          err?.response?.data?.error ||
            "Internal Server Error. Please try again later."
        );
      });
  });
};

export default resetPassword;
