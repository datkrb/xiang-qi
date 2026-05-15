import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/token";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
  req.user = decoded as any;
  next();
};

// 2. Check Authorization (Does the user have the right role?)
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "Forbidden: User role not found in token",
      });
      return;
    }

    next();
  };
};
