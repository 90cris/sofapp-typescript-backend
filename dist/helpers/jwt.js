import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
}
export const signToken = (data) => {
    return jwt.sign(data, JWT_SECRET, {
        expiresIn: "1d",
    });
};
