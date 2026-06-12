import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {

    const uploadPath =
      path.join(
        process.cwd(),
        "uploads",
        "joining-letters"
      );

    if (
      !fs.existsSync(
        uploadPath
      )
    ) {
      fs.mkdirSync(
        uploadPath,
        {
          recursive: true,
        }
      );
    }

    cb(
      null,
      uploadPath
    );
  },

  filename: (
    req,
    file,
    cb
  ) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(
      null,
      uniqueName
    );
  },
});

export const upload =
  multer({
    storage,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });