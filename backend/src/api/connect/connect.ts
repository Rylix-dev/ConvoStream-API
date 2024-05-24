import express from "express";
import { UserSchema } from "../../schemas/UserSchema";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../@types/User";
const router = express.Router();

router.post("/", async (req, res) => {
  const { apiKey, apiSecret } = req.body;

  if (!apiKey || !apiSecret) {
    return res
      .status(400)
      .json({ message: "apiKey and apiSecret are required" });
  }

  try {
    const rootConnection = mongoose.connection.useDb("root");
    const usersDB = rootConnection.model("User", UserSchema);

    const u = await usersDB.findOne({ apiToken: apiKey });

    if (!u) {
      return res.status(404).json({ message: "Invalid API Key or Secret" });
    }

    const compared = bcrypt.compareSync(apiSecret, u?.apiSecret || "");
    if (!compared) {
      return res.status(404).json({ message: "Invalid API Key or Secret" });
    }

    res.json({ message: "Connected", dbId: u?.dbId});
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
