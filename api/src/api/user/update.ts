import axios from "axios";
import { z } from "zod";
import Response from "../../@types/Response";

/**
 * Updates user information with the provided data.
 * @param {Object} params - The parameters for updating user information.
 * @param {string} [params.firstName] - The first name of the user.
 * @param {string} [params.lastName] - The last name of the user.
 * @param {string} [params.username] - The username of the user.
 * @param {string} [params.profilePicture] - The URL of the user's profile picture.
 * @param {string} [params.bio] - The bio of the user.
 * @param {string} [params.email] - The email address of the user.
 * @returns {Promise<Response>} A promise that resolves with the server response.
 * @throws {string} Throws an error if the input data is invalid or if there's an error during the update process.
 */

const update = ({
  firstName,
  lastName,
  username,
  profilePicture,
  bio,
  email,
}: {
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  email?: string;
}): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      username: z.string().optional(),
      profilePicture: z.string().optional(),
      bio: z.string().optional(),
      email: z.string().optional(),
    });

    try {
      updateSchema.parse({
        firstName,
        lastName,
        username,
        profilePicture,
        bio,
        email,
      });
    } catch (err) {
      reject("Invalid input");
      return;
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
      .then((response: { data: Response }) => {
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
