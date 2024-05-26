import express from "express";
import { UserSchema } from "../../schemas/RootSchema";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/", async (req, res) => {
  const { apiKey, apiSecret } = req.body;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({
      error: "apiKey and apiSecret are required",
    });
  }

  try {
    const rootConnection = mongoose.connection.useDb("root");
    const usersDB = rootConnection.model("User", UserSchema);

    const u = await usersDB.findOne({ apiToken: apiKey });

    if (!u) {
      return res.status(404).json({
        error: "Invalid API Key or Secret",
      });
    }

    const compared = bcrypt.compareSync(apiSecret, u?.apiSecret || "");
    if (!compared) {
      return res.status(404).json({
        error: "Invalid API Key or Secret",
      });
    }

    const signed = jwt.sign(
      { dbId: u?.dbId, apiKey: u?.apiToken },
      process.env.JWT_SECRET!
    );

    res.json({
      message: "Connected",
      data: { token: signed },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
