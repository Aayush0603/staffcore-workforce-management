import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

export default router;