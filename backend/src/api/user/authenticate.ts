import express from "express";
import { z } from "zod";
import verifyAccess from "../../middleware/verifyAccess";
import mongoose from "mongoose";
import { UserSchema } from "../../schemas/UserSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/", verifyAccess, async (req, res) => {
  const { username, password } = req.body;

  const userObj = z.object({
    username: z.string().min(1).regex(/^[a-z0-9]+$/).trim(),
    password: z.string().min(8),
  });

  try {
    userObj.parse({
      username,
      password,
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  // Authenticate user
  const c = mongoose.connection.useDb(req.payload.dbId);
  const User = c.model("User", UserSchema);
  const u = await User.findOne({ username });

  if (!u) {
    return res.status(404).json({ error: "Invalid username or password" });
  }

  const compared = bcrypt.compareSync(password, u.password);
  if (!compared) {
    return res.status(404).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    {
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      status: u.status,
      profilePic: u.profilePic,
      bio: u.bio,
      keys: u.keys,
    },
    process.env.USER_SECRET as string
  );

  res.json({ message: "Authenticated", token });
});

export default router;
