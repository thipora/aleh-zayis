import jwt from 'jsonwebtoken';

export function createToken(payload) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new Error("Missing secret");
    // return jwt.sign(payload, secret);
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}