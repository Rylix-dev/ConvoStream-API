import axios from "axios";
import { z } from "zod";

const update = (
  firstName: string,
  lastName: string,
  username: string,
  profilePicture: string,
  bio: string,
  email: string
) => {
  return new Promise((resolve, reject) => {
    const userObj = z.object({
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      profilePicture: z.string(),
      bio: z.string(),
      email: z.string(),
    });

    try {
      userObj.parse({
        firstName,
        lastName,
        username,
        profilePicture,
        bio,
        email,
      });
    } catch (error) {
      reject("Invalid input");
    }

    axios
      .post(`${global.cs_apiUrl}/user/update`, {
        firstName,
        lastName,
        username,
        profilePicture,
        bio,
        email,
      })
      .then((response) => {
        if (response.data.error) {
          reject(response.data.error);
        }
        resolve(response.data);
      })
      .catch((err) => {
        reject(err?.response?.data?.error || "Internal Server Error");
      });
  });
};

export default update;
