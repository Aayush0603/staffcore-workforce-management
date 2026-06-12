import { Router } from "express";
import {
  applyLeave,
  getLeaveRequests,
  approveLeave,
  rejectLeave
} from "../controllers/leave.controller";

import { authorizeRoles } from "../middleware/role.middleware";

import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/apply",
  authenticateToken,
  applyLeave
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getLeaveRequests
);

router.put(
  "/approve/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  approveLeave
);

router.put(
  "/reject/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  rejectLeave
);

export default router;