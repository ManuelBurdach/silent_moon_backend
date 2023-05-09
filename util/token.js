import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
