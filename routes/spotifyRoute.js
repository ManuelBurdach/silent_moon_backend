import express from "express";
import { spotifyLogin } from "../controller/spotifyController.js";

//spotify_router erstellt und in index.js importiert
export const spotify_router = new express.Router();

// ----------------------------------------- POST Routes
spotify_router.post("/login", spotifyLogin);
