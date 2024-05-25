import axios from "axios";
import { z } from "zod";

const connect = (apiKey: string, apiSecret: string) => {
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
      .then((response) => {
        if (response.data.error) {
          reject(response.data.error);
        }

        global.cs_token = response.data.token;
        global.cs_apiSecret = apiSecret;
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${global.cs_token}`;

        resolve(response.data);
      })
      .catch(() => {
        reject("Internal Server Error");
      });
  });
};

export default connect;
