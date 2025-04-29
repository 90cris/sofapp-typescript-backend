import { db } from "../config/db";
import format from "pg-format";
import { Product } from "../interfaces/product.interface";

export const getAllProducts = async () => {
  const result = await db.query("SELECT * FROM productos;");
  return result.rows;
};

export const insertProduct = async (producto: Product) => {
  const {
    id_usuario,
    nombre,
    marca,
    tipo,
    cuerpo,
    alto,
    ancho,
    precio,
    foto,
    detalle,
    stock,
    color,
  } = producto;

  if (
    !nombre || !marca || !tipo || cuerpo === undefined ||
    alto === undefined || ancho === undefined ||
    precio === undefined || !foto || !detalle ||
    stock === undefined || !color
  ) {
    throw new Error("Faltan campos obligatorios para insertar el producto.");
  }

  const result = await db.query(
    `INSERT INTO productos (id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *;`,
    [
      id_usuario,
      nombre,
      marca,
      tipo,
      cuerpo,
      alto,
      ancho,
      precio,
      foto,
      detalle,
      stock,
      color,
    ]
  );
  return result.rows[0];
};

export const getProductsByUser = async (id_usuario: number | string) => {
  const { rows } = await db.query(
    "SELECT * FROM productos WHERE id_usuario = $1;",
    [id_usuario]
  );
  return rows;
};

export const getProductById = async (id: number | string) => {
  const productoId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(productoId)) return null;

  const { rows } = await db.query(
    "SELECT * FROM productos WHERE id_producto = $1;",
    [productoId]
  );
  return rows[0] || null;
};

export const getProductsByBrand = async (marca: string) => {
  const { rows } = await db.query(
    "SELECT * FROM productos WHERE marca ILIKE $1;",
    [marca]
  );
  return rows;
};

export const getProductsByType = async (tipo: string) => {
  const { rows } = await db.query(
    "SELECT * FROM productos WHERE tipo ILIKE $1;",
    [tipo]
  );
  return rows;
};

export const getProductsByBody = async (cuerpo: number | string) => {
  const { rows } = await db.query(
    "SELECT * FROM productos WHERE cuerpo = $1;",
    [cuerpo]
  );
  return rows;
};

export const getLatest5Products = async () => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM productos ORDER BY id_producto DESC LIMIT 5;'
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener los últimos 5 productos:", error instanceof Error ? error.message : error);
    throw new Error("Error al obtener productos");
  }
};

export const modifyStock = async (id_producto: number, cantidad: number) => {
  try {
    const query = `
      UPDATE productos
      SET stock = stock + $1
      WHERE id_producto = $2
      RETURNING *;
    `;
    const result = await db.query(query, [cantidad, id_producto]);
    return result.rows[0]; 
  } catch (error) {
    console.error("Error al modificar el stock:", error instanceof Error ? error.message : error);
    throw new Error("Error al modificar el stock");
  }
};