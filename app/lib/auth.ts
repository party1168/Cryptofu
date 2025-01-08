import jwt from "jsonwebtoken";

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
