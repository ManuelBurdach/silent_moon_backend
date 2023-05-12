// --------------------------------------------- IMPORTS
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
    if (!result) res.status(401).json(guestObj);
    else {
      const token = createJWT({ id: result._id, email: result.email, firstName: result.firstName }); //auch in register function ändern
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
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
    reminder: {}, //Muss noch angepasst werden (Default)
    favoriteYoga: [],
    favoriteMeditation: [],
  };

  try {
    const db = await getDb();
    //check email exists
    const checkEmail = await db.collection(USER_COL).findOne({ email: req.body.email });
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
