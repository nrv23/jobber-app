import { sequelize } from '@auth/database';
import { IAuthDocument } from '@nrv23/jobber-shared';
import { compare, hash } from 'bcryptjs';
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize';

const SALT_ROUND = 10;

interface AuthModelInstanceMethods extends Model {
    prototype: {
        comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
        hassPassword: (password: string) => Promise<string>;
    }
}


type AuthUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetExpires' | 'passwordResetToken'>;

/*

    type AuthUserCreationAttributes = Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetExpires' | 'passwordResetToken'>;
    Aquí se define un nuevo tipo llamado AuthUserCreationAttributes que extiende IAuthDocument.
    Optional<IAuthDocument, 'id' | 'createdAt' | 'passwordResetExpires' | 'passwordResetToken'>: 
    Esto significa que todos los atributos de IAuthDocument se consideran obligatorios, excepto id, createdAt, 
    passwordResetExpires y passwordResetToken, que son opcionales. Esto es útil al crear nuevas instancias del modelo, 
    ya que es probable que no se necesiten todos estos campos al momento de la creación.
*/
const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods = sequelize.define('auths', {
    username: {
        type: DataTypes.STRING,
        allowNull: false // no permite valores nulos
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // no permite valores nulos
    },
    profilePublicId: {
        type: DataTypes.STRING,
        allowNull: false // no permite valores nulos
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now()
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
}, {
    // creacion de indices

    indexes: [
        {
            unique: true,
            fields: ['email'],

        },
        {
            unique: true,
            fields: ['username']
        }
    ]
}) as  ModelDefined<IAuthDocument, AuthUserCreationAttributes> & AuthModelInstanceMethods;

// agregar hooks 

AuthModel.addHook('beforeCreate', async (auth: Model<IAuthDocument>) => {

    const hashPass: string = await hash(auth.dataValues.password!, SALT_ROUND);
    auth.dataValues.password = hashPass;

});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
AuthModel.prototype.comparePassword = async function (password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
AuthModel.prototype.hassPassword = async function (password: string): Promise<string> {
    return await hash(password, SALT_ROUND);
};


// crear la tabla 

AuthModel.sync({
    alter: true
});

export default AuthModel;