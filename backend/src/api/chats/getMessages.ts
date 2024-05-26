import express from "express";
import { z } from "zod";
import verifyAccess from "../../middleware/verifyAccess";
import verifyUser from "../../middleware/verifyUser";
import reviseDB from "../../middleware/reviseDB";
import { Chats } from "../../@types/Chat";
const router = express.Router();

router.post("/", verifyAccess, verifyUser, reviseDB, async (req, res) => {
  try {
    const { roomId, limit, offset } = req.body;
    const schema = z.object({
      roomId: z.string(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    });

    try {
      schema.parse({
        roomId,
        limit,
        offset,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const c = req.db.Chat;
    const r = (await c.findById(roomId).limit(limit).skip(offset)) as Chats;

    if (!r) {
      res.status(400).json({ error: "Invalid Chat" });
      return;
    }

    if (
      r.userId1.toString() !== req.user._id &&
      r.userId2.toString() !== req.user._id
    ) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.json({ message: "Success", data: { messages: r.messages } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
