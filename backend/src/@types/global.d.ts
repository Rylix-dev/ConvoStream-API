// express.d.ts
import { Request } from "express";
import Payload from "./Payload";

declare module "express-serve-static-core" {
  interface Request {
    payload: Payload;
  }
}
