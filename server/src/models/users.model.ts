import { DataTypes, DATE, Model, type Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import { USER_ROLES, type USER_ROLES_TYPE } from "../config/rolePermissions.js";
import { envVariables } from "../config/env.js";

export interface UserAttributes {
  id: string;
  email: string;
  username: string;
  password: string;
  phone: string | null;
  role: USER_ROLES_TYPE;
  refreshToken: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Defines the optional Fields during the creation of the user object
interface UserCreationAttributes extends Optional<
  UserAttributes,
  | "id"
  | "role"
  | "phone"
  | "refreshToken"
  | "created_at"
  | "updated_at"
  | "deleted_at"
> {}

// Overriding the Model Class to extend and add the methods which can be directly used to each user model instance
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare username: string;
  declare password: string;
  declare phone: string | null;
  declare role: USER_ROLES_TYPE;
  declare refreshToken: string | null;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date | null;

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  // When we basically call res.json(user) with our model instance, Express calls JSON.stringify(user) on our model, this looks for toJSON() method for our model, the Sequelize ORM already provides its default one, but we override that toJSON() to not send the password field in the response
  toJSON(): Omit<UserAttributes, "password" | "refreshToken"> {
    const { password, refreshToken, ...values } = this.get() as UserAttributes;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...USER_ROLES),
      allowNull: false,
      defaultValue: "user",
    },
    refreshToken: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, envVariables.hashSalt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password"))
          user.password = await bcrypt.hash(
            user.password,
            envVariables.hashSalt,
          );
      },
    },
    indexes: [
      { fields: ["email"], unique: true },
      {
        fields: ["username"],
        unique: true,
      },
      { fields: ["role"] },
      {
        fields: ["phone"],
        unique: true,
      },
    ],
  },
);

export default User;
