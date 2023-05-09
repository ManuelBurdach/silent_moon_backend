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
    if (!result) res.status(401).json({ id: 0, email: "", firstName: "guest", isLoggedIn: false });
    else {
      const token = createJWT({ email: result.email });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({
        id: result._id,
        email: result.email,
        firstName: result.firstName,
        isLoggedIn: true,
      });
    }
  } catch (err) {
    res.status(500).json({ id: 0, email: "", firstName: "guest", isLoggedIn: false });
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
    reminder: {}, //Muss noch angepasst werden (Default)
    favoriteYoga: [],
    favoriteMeditation: [],
  };

  try {
    const db = await getDb();
    //check email exists
    const checkEmail = await db.collection(USER_COL).findOne({ email: req.body.email });
    if (checkEmail) {
      res.status(550).end(); //550 = Email existiert schon
    } else {
      //user register
      const result = await db.collection(USER_COL).insertOne(user);
      console.log(result);
      const token = createJWT({ email: req.body.email });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
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
