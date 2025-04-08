import jwt from 'jsonwebtoken';

export function createToken(payload) {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'mySuperSecretKey123';
    if (!secret) throw new Error("Missing secret");
    return jwt.sign(payload, secret);
}