import express from "express";
import { z } from "zod";
import verifyAccess from "../../middleware/verifyAccess";
import verifyUser from "../../middleware/verifyUser";
import reviseDB from "../../middleware/reviseDB";

const router = express.Router();

router.post("/", verifyAccess, verifyUser, reviseDB, async (req, res) => {
  const userObj = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    profilePicture: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().optional(),
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
          ...req.body,
          updatedAt: new Date(),
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
