import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {

  const authHeader =
    req.headers.authorization;

  const token =
    authHeader?.split(" ")[1];

  if (!token) {

    res.status(401).json({
      success: false,
      message:
        "Access token required",
    });

    return;
  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );

    req.user = decoded;

    next();

  } catch (error: any) {

  console.error(
    "JWT ERROR:",
    error
  );

  res.status(403).json({
    success: false,
    message:
      error?.message || "Invalid token",
  });
}
};