import { JwtPayload } from "jsonwebtoken";
import { de } from "zod/v4/locales";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
