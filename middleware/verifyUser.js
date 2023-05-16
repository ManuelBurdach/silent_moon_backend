import { verifyJWT } from "../util/token.js";

export const verifyUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const result = verifyJWT(token);
        req.claim = {
            id: result.id,
            email: result.email,
            firstName: result.firstName,
        };
        next();
    } catch (err) {
        res.status(401).json({ id: 0, firstName: "guest", isLoggedIn: false });
    }
};
