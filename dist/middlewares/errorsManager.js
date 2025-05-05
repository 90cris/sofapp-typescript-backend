export function errorMiddleware(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        message: err.message || "Error Interno del Servidor",
    });
}
