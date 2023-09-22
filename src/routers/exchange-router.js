import express from "express";
import { exchangeRateController } from "../controllers/exchange-rate-controller.js";

const router = express.Router();

router.get("/", exchangeRateController.index);

export default router;
