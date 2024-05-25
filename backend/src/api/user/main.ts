import express from "express";
import create from "./create.js";
import authenticate from "./authenticate.js";
import update from "./update.js";
import resetPassword from "./resetPassword.js"
const router = express.Router();

router.use("/create", create);
router.use("/authenticate", authenticate);
router.use("/update", update);
router.use("/resetPassword", resetPassword);

export default router;
