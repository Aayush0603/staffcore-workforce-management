import { Router } from "express";

import {
  downloadPayrollExcel,
  downloadPayrollPdf,
} from "../controllers/payrollExport.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/excel",
  authenticateToken,
  authorizeRoles("ADMIN"),
  downloadPayrollExcel
);

router.get(
  "/pdf",
  authenticateToken,
  authorizeRoles("ADMIN"),
  downloadPayrollPdf
);

export default router;