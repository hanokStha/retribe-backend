import express from "express";
import {
  configPayment,
  getPaymentIntent,
  pay,
  payment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/get-payment-intent", getPaymentIntent);
router.get("/config", configPayment);
router.post("/payment", payment);
router.post("/pay", pay);

export default router;
