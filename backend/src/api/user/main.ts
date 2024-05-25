import express from "express";
import create from "./create.js";
import authenticate from "./authenticate.js";
const router = express.Router();

router.use("/create", create);
router.use("/authenticate", authenticate);

export default router;
