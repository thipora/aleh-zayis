import jwt from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
    const token = req?.query?.token || req?.cookies["x-access-token"];
    console.log(token)
    if (!token)
        return res.sendStatus(403).send("not access Token");

    try {
        const verified = jwt.verify(token, secret);
        req.body.userId = verified.id;
        return next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
};