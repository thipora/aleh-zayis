import jwt from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const token = tokenFromHeader || req?.query?.token || req?.cookies["x-access-token"];
    console.log(token)
    if (!token)
        return res.sendStatus(403).send("not access Token");

    try {
        const verified = jwt.verify(token, secret);
        req.body.userId = verified.idUser || verified.id;
        return next();
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
};