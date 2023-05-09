import { verifyJWT } from "../util/token.js";

export const verifyUser = (req, res, next) => {
  try {
    // const token = req.cookies.token;
    const token =
      "aeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NWEwNzI1MGYzZTZjNDIwNmMzYzk0MSIsImVtYWlsIjoiYWJAYS5kZSIsImlhdCI6MTY4MzYyNTEwNCwiZXhwIjoxNjgzNjI4NzA0fQ.55k4PigbcQUgbV4xTYJM0u9JStXB74BkN17xOI6KlI0";
    const result = verifyJWT(token);
    req.claim = { email: result.email };
    next();
  } catch (err) {
    res.status(401).json({ id: 0, firstName: "guest", isLoggedIn: false });
  }
};
