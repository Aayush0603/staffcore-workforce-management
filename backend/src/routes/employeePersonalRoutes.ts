import express from "express";

import {
  createPersonalDetails,
  getPersonalDetails,
  updatePersonalDetails,
} from "../controllers/employeePersonalController";

const router = express.Router();

router.post(
  "/:id/personal-details",
  createPersonalDetails
);

router.get(
  "/:id/personal-details",
  getPersonalDetails
);

router.put(
  "/:id/personal-details",
  updatePersonalDetails
);

export default router;