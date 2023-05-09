import { createHmac } from "crypto";

export const encryptPassword = (req, _, next) => {
  const hmac = createHmac("sha256", req.body.password);
  req.body.password = hmac.digest("hex");
  next();
};
