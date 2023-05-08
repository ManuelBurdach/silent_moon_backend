import "./util/envConfig.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/user", (req, res) => {
  res.json("hallo");
});

app.listen(PORT, () => {
  console.log("Server listen on port:", PORT);
});
