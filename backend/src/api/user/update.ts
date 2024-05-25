import express from "express";
import { z } from "zod";
import verifyAccess from "../../middleware/verifyAccess";
import verifyUser from "../../middleware/verifyUser";
import reviseDB from "../../middleware/reviseDB";

const router = express.Router();

router.post("/", verifyAccess, verifyUser, reviseDB, async (req, res) => {
  const userObj = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    profilePicture: z.string(),
    bio: z.string(),
    email: z.string(),
  });

  try {
    userObj.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    await req.db.User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          profilePicture: req.body.profilePicture,
          bio: req.body.bio,
          email: req.body.email,
        },
      }
    );

    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (error.keyValue.username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
