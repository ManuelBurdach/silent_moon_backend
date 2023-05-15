import express from "express";
import { videos, videoById } from "../controller/dataController.js";
import { verifyUser } from "../middleware/verifyUser.js";

//data_router erstellt und in index.js importiert
export const data_router = new express.Router();

// ----------------------------------------- GET Routes
data_router.get("/videos", verifyUser, videos);
data_router.get("/videos/:id", verifyUser, videoById);
