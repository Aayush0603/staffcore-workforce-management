import {
  Router,
} from "express";

import {
  upload,
} from "../middleware/upload.middleware";

import {
  uploadJoiningLetter,
} from "../controllers/upload.controller";

import {
  authenticateToken,
} from "../middleware/auth.middleware";

import {
  organizationUpload,
} from "../middleware/organizationUpload.middleware";

import {
  uploadOrganizationFile,
} from "../controllers/upload.controller";

const router =
  Router();

router.post(
  "/joining-letter",
  authenticateToken,
  upload.single(
    "file"
  ),
  uploadJoiningLetter
);

router.post(
  "/organization/:type",
  authenticateToken,
  organizationUpload.single("file"),
  uploadOrganizationFile
);

export default router;