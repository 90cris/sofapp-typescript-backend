import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(err.statusCode || 500).json({
    message: err.message || "Error Interno del Servidor",
  });
}
