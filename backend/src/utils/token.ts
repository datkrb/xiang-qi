import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env["ACCESS_TOKEN_SECRET"] || "AKRongXanh";
const REFRESH_TOKEN_SECRET =
  process.env["REFRESH_TOKEN_SECRET"] || "MP40MangXa";

export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};
