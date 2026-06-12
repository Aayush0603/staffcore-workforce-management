import {
  Request,
  Response,
} from "express";

export const uploadJoiningLetter =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      if (!req.file) {

        res.status(400).json({
          success: false,
          message:
            "No file uploaded",
        });

        return;
      }

      res.status(200).json({
  success: true,

  fileUrl:
    `/uploads/joining-letters/${req.file.filename}`,
});

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Upload failed",
      });
    }
  };