// --------------------------------------------- IMPORTS
import { ObjectId } from "mongodb";
import { getDb } from "../util/dbConfig.js";
import { createJWT } from "../util/token.js";

// --------------------------------------------- DB_COLLECTION
const USER_COL = process.env.USER_COL;
const isLoggedInObj = "";
const guestObj = { id: 0, email: "", firstName: "guest", isLoggedIn: false };

// --------------------------------------------- USER_VERIY
export const first_verify = async (req, res) => {
    res.json({ ...req.claim, isLoggedIn: true });
};

// --------------------------------------------- USER_REMINDER
export const addReminder = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).updateOne(
            { _id: new ObjectId(req.claim.id) },
            {
                $set: {
                    reminder: {
                        time: req.body.time,
                        su: req.body.su,
                        m: req.body.m,
                        t: req.body.t,
                        w: req.body.w,
                        th: req.body.th,
                        f: req.body.f,
                        s: req.body.s,
                    },
                },
            }
        );
        res.json("ok");
    } catch (err) {
        res.status(500).end();
    }
};

// --------------------------------------------- USER_ADDYOGAFAV
export const addYogaFav = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).updateOne(
            { _id: new ObjectId(req.claim.id) },
            {
                $push: {
                    favoriteYoga: req.body.favorite,
                },
            }
        );
        res.json("add a favorite");
    } catch (err) {
        res.status(500).end();
    }
};

// --------------------------------------------- USER_DELETEMEDITATEFAV
export const deleteYogaFav = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).updateOne(
            { _id: new ObjectId(req.claim.id) },
            {
                $pull: {
                    favoriteYoga: req.body.favorite,
                },
            }
        );
        res.json("delete a favorite");
    } catch (err) {
        res.status(500).end();
    }
};

// --------------------------------------------- USER_ADDMEDITATEFAV
export const addMeditateFav = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).updateOne(
            { _id: new ObjectId(req.claim.id) },
            {
                $push: {
                    favoriteMeditation: req.body.favorite,
                },
            }
        );
        res.json("add a favorite");
    } catch (err) {
        res.status(500).end();
    }
};

// --------------------------------------------- USER_DELETEMEDITATEFAV
export const deleteMeditateFav = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).updateOne(
            { _id: new ObjectId(req.claim.id) },
            {
                $pull: {
                    favoriteMeditation: req.body.favorite,
                },
            }
        );
        res.json("delete a favorite");
    } catch (err) {
        res.status(500).end();
    }
};

// --------------------------------------------- USER_DETAILS
export const details = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db
            .collection(USER_COL)
            .findOne({ _id: new ObjectId(req.claim.id) });
        res.json({
            favoriteYoga: result.favoriteYoga,
            favoriteMeditation: result.favoriteMeditation,
        });
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};

// --------------------------------------------- LOGIN
export const login = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(USER_COL).findOne(req.body);
        if (!result) res.status(401).json(guestObj);
        else {
            const token = createJWT({
                id: result._id,
                email: result.email,
                firstName: result.firstName,
            }); //auch in register function ändern
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.json({
                id: result._id,
                email: result.email,
                firstName: result.firstName,
                isLoggedIn: true,
            });
        }
    } catch (err) {
        res.status(500).json(guestObj);
    }
};

// --------------------------------------------- REGISTER
export const register = async (req, res) => {
    //req.body + default properties
    const user = {
        ...req.body,
        //Default profilImg
        profilImg:
            "https://assets-global.website-files.com/62d9141584e7b750edcafa6a/638dbccab55f597a69a4e794_Christian_Peters_Trainer_Fullstack.png",
        reminder: {
            time: "12:00 am",
            su: false,
            m: false,
            t: false,
            w: false,
            th: false,
            f: false,
            s: false,
        }, //Muss noch angepasst werden (Default)
        favoriteYoga: [],
        favoriteMeditation: [],
    };

    try {
        const db = await getDb();
        //check email exists
        const checkEmail = await db
            .collection(USER_COL)
            .findOne({ email: req.body.email });
        if (checkEmail) {
            res.status(550).json(guestObj); //550 = Email existiert schon
        } else {
            //user register
            const result = await db.collection(USER_COL).insertOne(user);
            console.log(result);
            const token = createJWT({
                id: result.insertedId,
                email: req.body.email,
                firstName: req.body.firstName,
            }); // auch in loggin func ändern
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            res.json({
                id: result.insertedId,
                email: req.body.email,
                firstName: req.body.firstName,
                isLoggedIn: true,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
};
