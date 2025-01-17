import jwt from "jsonwebtoken";
import redis from "./redis";

const secret = process.env.JWT_SECRET || "0.";

// 生成 jwt token
export const generateToken = (user: {
  uuid: string;
  email: string;
  name: string;
  role: string;
}) => {
  return jwt.sign(user, secret, { expiresIn: "1d" });
};

export const blocklistToken = async (token: string) => {
  try {
    const decoded = jwt.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token");
    }
    const expiration = decoded.exp - Math.floor(Date.now() / 1000);
    await redis.set(token, "blacklisted", "EX", expiration);
  } catch (err) {
    throw err;
  }
};

/**
 * 驗證 jwt token
 *
 * @param token - 要驗證的 jwt token
 * @returns 解碼後的用戶信息對象，包括 uuid、email、name 和 role
 * @throws 如果 token 無效或過期，則拋出錯誤
 */
export const verifyToken = async(token: string) => {
  try {
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) {
      throw new Error("Token is blacklisted");
    }

    const data = jwt.verify(token, secret) as {
      uuid: string;
      email: string;
      name: string;
      role: string;
    };
    return data;
  } catch (err) {
    throw err;
  }
};
