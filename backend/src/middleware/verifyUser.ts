import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Token from "../@types/Token";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.headers as { user: string };
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = user.split(" ")[1];
    const payload = jwt.verify(token, process.env.USER_SECRET!) as Token;

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid token");
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default verifyUser;
