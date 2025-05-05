import { getAllProducts, insertProduct, getProductById, getProductsByBrand, getProductsByType, getProductsByBody, getProductsByUser, getLatest5Products, modifyStock } from "../modelo/producto.model";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
}
export const validateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ error: "No autorizado. Token no presente." });
        return;
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "No autorizado. Token inválido." });
    }
};
export const HandleGetProducts = async (req, res) => {
    try {
        const productos = await getAllProducts();
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener los productos." });
    }
};
export const HandleNewProduct = async (req, res) => {
    const { id_usuario, nombre, marca, tipo, cuerpo, alto, ancho, precio, foto, detalle, stock, color } = req.body;
    if (!nombre || !marca || !tipo || !cuerpo || !alto || !ancho || !precio || !foto || !detalle || !stock || !color) {
        return res.status(400).json({ msg: "Los campos obligatorios no pueden estar vacíos." });
    }
    try {
        const response = await insertProduct(req.body);
        res.status(201).json({ msg: "Producto creado con éxito!", data: response });
    }
    catch (error) {
        console.error("Error en HandleCrearProducto:", error.message);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};
export const HandleGetProductsByUser = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const productos = await getProductsByUser(id_usuario);
        if (!productos.length) {
            return res.status(404).json({ msg: "No se encontraron productos para este usuario." });
        }
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener productos del usuario.", error: error.message });
    }
};
export const HandleGetProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await getProductById(id);
        if (!producto) {
            return res.status(404).json({ msg: "No se encontró el producto con ese ID o el formato es incorrecto." });
        }
        res.status(200).json(producto);
    }
    catch (error) {
        res.status(500).json({ msg: "Error interno del servidor.", error: error.message });
    }
};
export const HandleGetProductsByBrand = async (req, res) => {
    try {
        const { marca } = req.params;
        const productos = await getProductsByBrand(marca);
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener productos por marca.", error: error.message });
    }
};
export const HandleGetProductsByType = async (req, res) => {
    try {
        const { tipo } = req.params;
        const productos = await getProductsByType(tipo);
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener productos por tipo.", error: error.message });
    }
};
export const HandleGetProductsByBody = async (req, res) => {
    try {
        const { cuerpo } = req.params;
        const productos = await getProductsByBody(cuerpo);
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener productos por cuerpo.", error: error.message });
    }
};
export const HandleGetLatest5Products = async (req, res) => {
    try {
        const productos = await getLatest5Products();
        res.status(200).json(productos);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener los productos", error: error.message });
    }
};
export const updateStock = async (req, res) => {
    try {
        const { id_producto, cantidad } = req.body;
        if (!id_producto || cantidad === undefined) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        const cantidadNumerica = Number(cantidad);
        if (isNaN(cantidadNumerica)) {
            return res.status(400).json({ error: "Cantidad debe ser un número válido" });
        }
        const productoActualizado = await modifyStock(id_producto, cantidadNumerica);
        if (!productoActualizado) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({ mensaje: "Stock actualizado correctamente", producto: productoActualizado });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
