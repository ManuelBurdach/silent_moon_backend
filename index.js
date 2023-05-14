//Imports
import "./util/envConfig.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { user_router } from "./routes/userRoute.js";
import { data_router } from "./routes/dataRoute.js";
import SpotifyWebApi from "spotify-web-api-node";
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
app.post("/spotify/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/music",
        clientId: "ab15df07233441198e07735bdb853e7b",
        clientSecret: "7322bd6f3a6548ceaf4d2c468aa69ce1",
    });
    spotifyApi
        .authorizationCodeGrant(code)
        .then((data) => {
            const accessToken = data.body.access_token;
            const refreshToken = data.body.refresh_token;
            const expiresIn = data.body.expires_in;

            //res.cookie("accessToken", accessToken, { httpOnly: true });

            res.json({
                accessToken,
                refreshToken,
                expiresIn,
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.post("/spotify/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:5173/music",
        clientId: "ab15df07233441198e07735bdb853e7b",
        clientSecret: "7322bd6f3a6548ceaf4d2c468aa69ce1",
        refreshToken,
    });

    spotifyApi
        .refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.get("/test", (req, res) => {
    console.log("COOKIE in /test route:", req.cookies.spotifyAccessToken);
    res.sendStatus(200);
});

//next routes

//Server listen on PORT..
app.listen(PORT, () => {
    console.log("Server listen on port:", PORT);
});
