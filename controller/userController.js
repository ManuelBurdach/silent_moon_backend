// --------------------------------------------- IMPORTS
import { getDb } from "../util/dbConfig.js";
import { createJWT } from "../util/token.js";

// --------------------------------------------- DB_COLLECTION
const USER_COL = process.env.USER_COL;

// --------------------------------------------- USER_DETAILS
export const details = async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection(USER_COL).findOne(req.claim);
    res.json({
      reminder: result.reminder,
      favoriteYoga: result.favoriteYoga,
      favoriteMeditation: result.favoriteMeditation,
    });
  } catch (err) {
    res.status(500).end();
  }
};

// --------------------------------------------- LOGIN
export const login = async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection(USER_COL).findOne(req.body);
    if (!result) res.status(401).json({ id: 0, firstName: "guest", isLoggedIn: false });
    else {
      const token = createJWT({ email: result.email });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ id: result._id, firstName: result.email, isLoggedIn: true });
    }
  } catch (err) {
    res.status(500).json({ id: 0, firstName: "guest", isLoggedIn: false });
  }
};

// --------------------------------------------- REGISTER
export const register = async (req, res) => {
  //req.body + default properties
  const user = {
    ...req.body,
    reminder: {},
    favoriteYoga: {},
    favoriteMeditation: {},
  };

  try {
    const db = await getDb();
    //check email exists
    const checkEmail = await db.collection(USER_COL).findOne({ email: req.body.email });
    if (checkEmail) {
      res.status(500).json();
    } else {
      //user register
      const result = await db.collection(USER_COL).insertOne(user);
      res.json(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};
