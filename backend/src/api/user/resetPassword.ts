import express from "express";
import { z } from "zod";
import verifyAccess from "../../middleware/verifyAccess";
import verifyUser from "../../middleware/verifyUser";
import bcrypt from "bcryptjs";
import reviseDB from "../../middleware/reviseDB";
const router = express.Router();

router.post("/", verifyAccess, verifyUser, reviseDB, async (req, res) => {
  const userObj = z.object({
    password: z.string(),
    newPassword: z.string().min(8),
  });

  try {
    userObj.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const u = await req.db.User.findOne({ _id: req.user._id });
    if (!u) {
      return res.status(404).json({ error: "User not found" });
    }

    const compared = bcrypt.compareSync(req.body.password, u.password);
    if (!compared) {
      return res.status(404).json({ error: "Invalid Old password" });
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);

    await req.db.User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
