// --------------------------------------------- IMPORTS
import { getDb } from "../util/dbConfig.js";
import { ObjectId } from "mongodb";

// --------------------------------------------- DB_COLLECTION
const DATA_COL = process.env.DATA_COL;

// --------------------------------------------- DATA_VIDEOS
export const videos = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(DATA_COL).find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).end();
        console.log(err);
    }
};

// --------------------------------------------- DATA_VIDEOBYID
export const videoById = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db
            .collection(DATA_COL)
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!result) {
            res.status(404).json({ error: "Video not found" });
        } else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
        console.log(err);
    }
};
