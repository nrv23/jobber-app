import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
    username: Joi.string()
        .min(4)
        .max(12)
        .required()
        .messages({
            'string.base': 'username must be of type sttring',
            'string.min': 'Invalid username',
            'string.max': 'Invalid username',
            'string.empty': 'username is a required field'
        }),
    password: Joi.string()
        .min(8) // Longitud mínima de 8 caracteres
        .max(30) // Longitud máxima de 30 caracteres
        .pattern(new RegExp('(?=.*[a-z])')) // Al menos una letra minúscula
        .pattern(new RegExp('(?=.*[A-Z])')) // Al menos una letra mayúscula
        .pattern(new RegExp('(?=.*[0-9])')) // Al menos un número
        .messages({
            'string.base': 'Invalid Password',
        }),
    country: Joi.string()
        .min(4)
        .max(12)
        .required()
        .messages({
            'string.base': 'country must be of type sttring',
            'string.empty': 'country is a required field'
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Verifica que sea un email válido
        .required(), // Campo requerido,
    profilePicture: Joi.string()
        .required()
        .messages({
            'string.base': 'profilePicture must be of type sttring',
            'string.empty': 'profilePicture is a required field'
        }),
});

export { signupSchema };