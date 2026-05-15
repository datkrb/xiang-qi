import { User as PrismaUser, type User } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends PrismaUser {}

    interface Request {
      user?: User;
    }
  }
}
