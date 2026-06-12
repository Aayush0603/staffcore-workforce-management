import { Router } from "express";
import {
  getShifts,
  createShift,
  assignShift,
  getCurrentShift,
  getShiftHistory
} from "../controllers/shift.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticateToken,
  getShifts
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createShift
);

router.post(
  "/assign",
  authenticateToken,
  authorizeRoles("ADMIN"),
  assignShift
);

router.get(
  "/current/:employeeId",
  authenticateToken,
  getCurrentShift
);

router.get(
  "/history/:employeeId",
  authenticateToken,
  getShiftHistory
);

export default router;