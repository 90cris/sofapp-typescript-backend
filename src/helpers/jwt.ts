import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}


interface TokenPayload {
  id_usuario: number | string;
  email: string;
  [key: string]: any; 
}

export const signToken = (data: TokenPayload): string => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: "1d",
  });
};

