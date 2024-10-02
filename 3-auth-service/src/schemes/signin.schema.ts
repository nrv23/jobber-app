import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
    username: Joi.alternatives().conditional('.username', {
        is: Joi.string().email(), // Verificamos si el valor es un email
        then: Joi.string()
            .email({ tlds: { allow: false } }) // Verifica que sea un email válido
            .required(), // Campo requerido si es un email
        otherwise: Joi.string()
            .min(4)
            .max(12)
            .required()
            .messages({
                'string.base': 'username must be of type string',
                'string.min': 'Invalid username',
                'string.max': 'Invalid username',
                'string.empty': 'username is a required field'
            })
    }),
    password: Joi.string()
        .min(8) // Longitud mínima de 8 caracteres
        .max(30) // Longitud máxima de 30 caracteres
        .pattern(new RegExp('(?=.*[a-z])')) // Al menos una letra minúscula
        .pattern(new RegExp('(?=.*[A-Z])')) // Al menos una letra mayúscula
        .pattern(new RegExp('(?=.*[0-9])')) // Al menos un número
        .required() // Campo requerido
        .messages({
            'string.base': 'Invalid Password',
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password cannot be longer than 30 characters',
            'string.pattern.base': 'Password must include lower case, upper case, and numbers',
        })
});

export { loginSchema };
