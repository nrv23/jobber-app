import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object({
    username: Joi.string()
        .required()
        .custom((value, helpers) => {
            const isEmail = Joi.string().email().validate(value).error === undefined;
            const isUsername = Joi.string().min(4).max(12).validate(value).error === undefined;

            if (!isEmail && !isUsername) {
                return helpers.error('any.invalid', {
                    message: 'username must be a valid email or between 4 and 12 characters',
                });
            }
            return value;
        })
        .messages({
            'any.invalid': 'Invalid username: must be a valid email or between 4 and 12 characters',
            'string.empty': 'username is a required field',
        }),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('(?=.*[a-z])')) // Al menos una letra minúscula
        .pattern(new RegExp('(?=.*[A-Z])')) // Al menos una letra mayúscula
        .pattern(new RegExp('(?=.*[0-9])')) // Al menos un número
        .required()
        .messages({
            'string.base': 'Invalid Password',
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password cannot be longer than 30 characters',
            'string.pattern.base': 'Password must include lower case, upper case, and numbers',
        }),
});

export { loginSchema };