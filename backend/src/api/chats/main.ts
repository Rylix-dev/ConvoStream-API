import express from "express"
const router = express.Router()

import create from "./create.js"
import getMessages from "./getMessages.js"

router.use("/create", create)
router.use("/getMessages", getMessages)

export default router