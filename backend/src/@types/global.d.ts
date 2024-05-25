// express.d.ts
import { Request } from "express";
import Payload from "./Payload";
import Token from "./Token";
import { Model } from "mongoose";
import { UserSchema } from "../schemas/UserSchema";

declare module "express-serve-static-core" {
  interface Request {
    payload: Payload;
    user: Token;
    db: {
      User: Model<UserSchema>;
    };
  }
}
