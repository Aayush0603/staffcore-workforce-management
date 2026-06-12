import { Router } from "express";
import {
  getDepartments,
  createDepartment,
} from "../controllers/department.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/", authenticateToken, getDepartments);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createDepartment
);

export default router;