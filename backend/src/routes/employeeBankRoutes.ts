import express from "express";

import {
  createBankDetails,
  getBankDetails,
  updateBankDetails,
} from "../controllers/employeeBankController";

const router = express.Router();

router.post(
  "/:id/bank-details",
  createBankDetails
);

router.get(
  "/:id/bank-details",
  getBankDetails
);

router.put(
  "/:id/bank-details",
  updateBankDetails
);

export default router;