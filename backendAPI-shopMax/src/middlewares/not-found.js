export function notFoundMiddleware(_request, response) {
  response.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found"
  });
}
