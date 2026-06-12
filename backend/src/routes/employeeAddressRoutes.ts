import express from "express";

import {
  createAddress,
  getAddress,
  updateAddress,
} from "../controllers/employeeAddressController";

const router = express.Router();

router.post(
  "/:id/address",
  createAddress
);

router.get(
  "/:id/address",
  getAddress
);

router.put(
  "/:id/address",
  updateAddress
);

export default router;