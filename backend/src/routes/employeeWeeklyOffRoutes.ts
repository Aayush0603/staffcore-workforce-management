import express from "express";

import {
  createWeeklyOff,
  getWeeklyOff,
  updateWeeklyOff,
} from "../controllers/employeeWeeklyOffController";

const router = express.Router();

router.post(
  "/:id/weekly-off",
  createWeeklyOff
);

router.get(
  "/:id/weekly-off",
  getWeeklyOff
);

router.put(
  "/:id/weekly-off",
  updateWeeklyOff
);

export default router;