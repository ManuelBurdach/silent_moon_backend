import express from "express";
import { login, register, details } from "../controller/userController.js";
import { encryptPassword } from "../middleware/encryptPassword.js";
import { verifyUser } from "../middleware/verifyUser.js";

//user_router erstellt und in index.js importiert
export const user_router = new express.Router();

// ----------------------------------------- GET Routes
user_router.get("/details", verifyUser, details);

// ----------------------------------------- POST Routes
user_router.post("/login", encryptPassword, login);
user_router.post("/register", encryptPassword, register);
