import jwt from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET || 'mySuperSecretKey123';

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

// export const createToken = (payload) => {
//     try {
//         if (!payload) {
//             throw new Error('Payload dont find');
//         }
//         const accessToken = jwt.sign(payload, secret);
//         return accessToken;
//     } catch (error) {
//         console.error('Error creating token:', error);
//         throw new Error('Internal server error');
//     }
// };