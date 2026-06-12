import { Router } from "express";

import {
  createSalaryStructure,
  getSalaryStructures,
  getSalaryHistory,
} from "../controllers/salaryStructure.controller";

const router = Router();

router.post(
  "/",
  createSalaryStructure
);

router.get(
  "/",
  getSalaryStructures
);

router.get(
  "/history/:employeeId",
  getSalaryHistory
);

export default router;