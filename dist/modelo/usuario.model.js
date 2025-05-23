import { db } from "../config/db";
import format from "pg-format";
const { errorMiddleware } = require("../middlewares/errorsManager");
export const validateCredentials = async (email, pass) => {
    try {
        const SQLQuery = format(`SELECT * FROM usuario WHERE email = %L AND pass = %L`, email, pass);
        const { rows: [user], rowCount, } = await db.query(SQLQuery);
        if (!rowCount) {
            throw new Error("NOT_FOUND");
        }
        return user;
    }
    catch (error) {
        throw error;
    }
};
export const login = async (email, pass) => {
    try {
        const { rows } = await db.query("SELECT * FROM usuario WHERE email = $1 AND pass = $2", [email, pass]);
        if (rows.length === 0) {
            throw new Error("AUTH_ERROR");
        }
        return rows[0];
    }
    catch (error) {
        console.error("Error en el login:", error instanceof Error ? error.message : error);
        throw new Error("AUTH_ERROR");
    }
};
export const checkIfExists = async (email) => {
    try {
        const SQLQuery = "SELECT 1 FROM usuario WHERE email = $1";
        const { rowCount } = await db.query(SQLQuery, [email]);
        return rowCount > 0;
    }
    catch (error) {
        console.error("Error en checkIfExists:", error instanceof Error ? error.message : error);
        throw new Error("ERROR_CHECKING_USER");
    }
};
export const register = async (nombre, apellido, email, pass, fono) => {
    try {
        const emailExists = await checkIfExists(email);
        if (emailExists) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }
        const SQLQuery = format(`INSERT INTO usuario (nombre, apellido, email, pass, fono)
       VALUES (%L, %L, %L, %L, %L)
       RETURNING *`, nombre, apellido, email, pass, fono);
        const { rows, rowCount } = await db.query(SQLQuery);
        if (!rowCount) {
            throw new Error("BAD_REQUEST");
        }
        return rows[0];
    }
    catch (error) {
        console.error("Error en register:", error instanceof Error ? error.message : error);
        throw error;
    }
};
export const getUserDataByProduct = async (idProducto) => {
    try {
        const query = `
      SELECT u.nombre, u.apellido, u.email, u.fono
      FROM usuario u
      JOIN productos p ON u.id_usuario = p.id_usuario
      WHERE p.id = $1;
    `;
        const { rows } = await db.query(query, [idProducto]);
        if (rows.length === 0) {
            throw new Error("No se encontró el usuario asociado a este producto.");
        }
        return rows[0];
    }
    catch (error) {
        console.error("Error en getUserDataByProduct:", error instanceof Error ? error.message : error);
        throw new Error("Error al buscar el usuario en la base de datos.");
    }
};
