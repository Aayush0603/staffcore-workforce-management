import express from "express";

import {
  createEmploymentDetails,
  getEmploymentDetails,
  updateEmploymentDetails,
} from "../controllers/employeeEmploymentController";

const router = express.Router();

router.post(
  "/:id/employment-details",
  createEmploymentDetails
);

router.get(
  "/:id/employment-details",
  getEmploymentDetails
);

router.put(
  "/:id/employment-details",
  updateEmploymentDetails
);

export default router;