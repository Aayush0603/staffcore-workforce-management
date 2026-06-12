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

export default router;