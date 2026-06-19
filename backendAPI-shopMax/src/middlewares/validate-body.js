import { AppError } from "../models/app-error.js";

export function validateBody(schema) {
  return function bodyValidationMiddleware(request, _response, next) {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(
        new AppError("Dados invalidos.", {
          code: "VALIDATION_ERROR",
          statusCode: 422,
          details: result.error.flatten()
        })
      );
      return;
    }

    request.validatedBody = result.data;
    next();
  };
}
