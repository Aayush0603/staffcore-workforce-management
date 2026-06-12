import { Router } from "express";

import {
  generatePayroll,
  getPayrolls,
  updatePayrollForEmployee
} from "../controllers/payroll.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/generate",
  authenticateToken,
  authorizeRoles("ADMIN"),
  generatePayroll
);

router.post(
  "/recalculate",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updatePayrollForEmployee
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getPayrolls
);



export default router;