import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

import initDB from "./mongoose.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

dotenv.config();
initDB();

export default app;
