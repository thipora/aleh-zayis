import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().regex(/^[a-zA-Z0-9]*$/i).min(2).max(20).required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    isEmployee: Joi.boolean().required()
});