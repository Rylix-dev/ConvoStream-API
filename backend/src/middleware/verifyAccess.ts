import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Payload from "../@types/Payload";

const verifyAccess = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as Payload;

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid token");
    }

    req.payload = payload;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

export default verifyAccess;
