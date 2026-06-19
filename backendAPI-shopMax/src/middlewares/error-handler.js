export function errorHandlerMiddleware(error, _request, response, _next) {
  if (error?.name === "MulterError") {
    const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 422;

    response.status(statusCode).json({
      error: error.code ?? "UPLOAD_ERROR",
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Arquivo excede o tamanho maximo permitido."
          : error.message ?? "Falha ao processar upload.",
      details: null
    });
    return;
  }

  response.status(error.statusCode ?? 500).json({
    error: error.code ?? "INTERNAL_SERVER_ERROR",
    message: error.message ?? "Unexpected error",
    details: error.details ?? null
  });
}
