import jwt from "jsonwebtoken";
import { env } from "./envConfig";

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string = env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
