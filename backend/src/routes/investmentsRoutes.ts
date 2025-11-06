import express from "express";
import {
  getMFs,
  mfBuyController,
  cancelMF,
  updateMF,
  confirmPayment,
} from "../controllers/investmentController";
import { verifyJWT } from "../middleware/auth.middleware";

const investmentRoutes = express.Router();

investmentRoutes.post("/mf-buy", verifyJWT, mfBuyController as any);
investmentRoutes.get("/mf-get", verifyJWT, getMFs as any);
investmentRoutes.post("/mf-cancel", verifyJWT, cancelMF as any);
investmentRoutes.post("/mf-update", verifyJWT, updateMF as any);
investmentRoutes.post("/confirm", verifyJWT, confirmPayment as any);

export default investmentRoutes;
