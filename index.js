//Imports
import "./util/envConfig.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { user_router } from "./routes/userRoute.js";
import { data_router } from "./routes/dataRoute.js";
import { spotify_router } from "./routes/spotifyRoute.js";
import bodyParser from "body-parser";

//Constants
const PORT = process.env.PORT;
const API_VERSION = process.env.API_VERSION;
const app = express();

//Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

//All user_routes (api/v1/user)
app.use(API_VERSION + "/user", user_router);

//All data_routes (api/v1/data)
app.use(API_VERSION + "/data", data_router);

//spotify
app.use(API_VERSION + "/spotify", spotify_router);

//next routes

//Server listen on PORT..
app.listen(PORT, () => {
    console.log("Server listen on port:", PORT);
});
