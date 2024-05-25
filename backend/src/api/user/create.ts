import express from "express";
import verifyAccess from "../../middleware/verifyAccess.js";
import { z } from "zod";
import mongoose from "mongoose";
import { UserSchema } from "../../schemas/UserSchema.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", verifyAccess, async (req, res) => {
  const { firstName, lastName, email, username, password, publicKey } =
    req.body;

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
    publicKey: z.string().min(1),
  });

  try {
    userObj.parse({
      firstName,
      lastName,
      email,
      username,
      password,
      publicKey,
    });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const conn = mongoose.connection.useDb(req.payload.dbId);
    const User = conn.model("User", UserSchema);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hashedPassword,
      keys: {
        publicKey: publicKey,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Invalid user data" });

    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ error: "Email already exists" });
      } else if (error.keyPattern.username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }

    return res.status(500).json({ error: error.message });
  }
});

export default router;
