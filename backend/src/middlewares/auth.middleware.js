import Joi from "joi";

//! Middleware to validate user registration data
const validateRegistration = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(12).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};


//! Middleware to validate user login data
const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(12).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

export {
    validateRegistration,
    validateLogin
};