import multer from "multer";
import path from "path";
import fs from "fs";

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      const folder =
        req.params.type as string;

      const uploadPath =
        path.join(
          process.cwd(),
          "uploads",
          "organization",
          folder
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

      cb(
        null,
        Date.now() +
          "-" +
          file.originalname
      );
    },
  });

export const organizationUpload =
  multer({
    storage,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });