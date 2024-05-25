import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { UserSchema } from "../schemas/UserSchema";

const reviseDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const current = mongoose.connection.useDb(req.payload.dbId);
    const User = current.model("User", UserSchema);

    const db = {
      User,
    };

    req.db = db;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default reviseDB;
