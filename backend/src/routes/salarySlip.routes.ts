import { Router } from "express";

import {
  downloadSalarySlip,
  getSalarySlips
} from "../controllers/salarySlip.controller";
import { authenticateToken }
from "../middleware/auth.middleware";

import { authorizeRoles }
from "../middleware/role.middleware";

const router = Router();

router.get(
  "/download/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  downloadSalarySlip
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getSalarySlips
);

export default router;