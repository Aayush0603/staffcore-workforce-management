import { Router } from "express";

import {
  getOrganization,
  updateOrganization,
} from "../controllers/organization.controller";

const router = Router();

router.get("/", getOrganization);

router.put("/", updateOrganization);

export default router;