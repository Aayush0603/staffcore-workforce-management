import { Router } from "express";

import {
  createPayrollAdjustment,
  getPayrollAdjustments,
  updatePayrollAdjustment,
  getAdjustmentByEmployee,
} from "../controllers/payrollAdjustment.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createPayrollAdjustment
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getPayrollAdjustments
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updatePayrollAdjustment
);

router.get(
  "/employee",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getAdjustmentByEmployee
);

export default router;