import express from "express";
import verifyAccess from "../../middleware/verifyAccess";
import verifyUser from "../../middleware/verifyUser";
import reviseDB from "../../middleware/reviseDB";
const router = express.Router();

router.post("/", verifyAccess, verifyUser, reviseDB, async (req, res) => {
  const { userId2 } = req.body;
  if (!userId2) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const exists = await req.db.Chat.findOne({
    userId1: req.user._id,
    userId2,
  });

  if (exists) {
    res.status(400).json({ error: "Chat already exists" });
    return;
  }

  const userExists = await req.db.User.findById(userId2);
  if (!userExists) {
    res.status(400).json({ error: "User does not exist" });
    return;
  }

  const chat = await req.db.Chat.create({
    userId1: req.user._id,
    userId2,
    messages: [],
  });

  res.json({ message: "Success", data: { chat: chat } });
});

export default router;
