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

// 驗證 jwt token
export const verifyToken = (token: string) => {
  try {
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
