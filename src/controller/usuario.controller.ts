import { Request, Response, NextFunction } from "express";
import { signToken } from "../helpers/jwt";
import * as Auth from "../modelo/usuario.model";
import { getUserDataByProduct } from "../modelo/usuario.model";
import {
  User,
  UserLoginRequest,
  UserRegisterRequest,
} from "../interfaces/user.interface";

export const handleLogin = async (
  req: Request<{}, {}, UserLoginRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, pass } = req.body;

    const emailExists = await Auth.checkIfExists(email);
    if (!emailExists) {
      return res.status(404).json({ msg: "EMAIL_NOT_FOUND" });
    }

    const user: User = await Auth.login(email, pass);

    if (!user) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    }

    const token = signToken(user);

    res.status(200).json({
      token,
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      pass: user.pass,
      fono: user.fono,
    });
  } catch (error: any) {
    console.error("Error en el login:", error.message);
    next(error);
  }
};

export const handleRegister = async (
  req: Request<{}, {}, UserRegisterRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nombre, apellido, email, pass, fono } = req.body;

    const user: User = await Auth.register(nombre, apellido, email, pass, fono);

    res.status(201).json({ msg: "Usuario registrado correctamente", user });
  } catch (error: any) {
    console.error("Error en el registro:", error);

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res
        .status(400)
        .json({ msg: "El email ya está registrado. Usa otro." });
    }

    next(error);
  }
};

export const getDatosUsuarioPorProducto = async (
  req: Request<{ idProducto: string }>,
  res: Response
) => {
  const { idProducto } = req.params;

  try {
    const usuario = await getUserDataByProduct(Number(idProducto));

    if (!usuario) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron datos para este producto" });
    }

    res.json(usuario);
  } catch (error: any) {
    console.error("Error al obtener datos del usuario:", error.message);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
