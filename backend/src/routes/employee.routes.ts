import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller";

import { authenticateToken } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get("/", authenticateToken, getEmployees);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  createEmployee
);

router.get("/:id", authenticateToken, getEmployeeById);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  updateEmployee
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteEmployee
);

export default router;