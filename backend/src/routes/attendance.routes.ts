import { Router } from "express";
import {
  checkIn,
  checkOut,
  getAttendance,
  getMonthlyAttendance,
  getAttendanceDashboard,
  updateAttendance,
  bulkMarkAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller";

import { authorizeRoles } from "../middleware/role.middleware";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/check-in",
  authenticateToken,
  checkIn
);

router.post(
  "/check-out",
  authenticateToken,
  checkOut
);

router.get(
  "/",
  authenticateToken,
  getAttendance
);

router.get(
  "/monthly",
  authenticateToken,
  getMonthlyAttendance
);

router.get(
  "/dashboard",
  authenticateToken,
  getAttendanceDashboard
);

router.put(
  "/:id",
  authenticateToken,
  updateAttendance
);

router.post(
  "/bulk",
  authenticateToken,
  authorizeRoles("ADMIN"),
  bulkMarkAttendance
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteAttendance
);

export default router;