import SpotifyWebApi from "spotify-web-api-node";

export const spotifyLogin = async (req, res) => {
    const code = req.body.code;
    const referrer = req.body.referrer;
    console.log(referrer);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: `http://localhost:5173/music/login/${referrer}`,
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
            console.log("referrer im backend: " + req.body.referrer);

            res.sendStatus(400);
        });
};
