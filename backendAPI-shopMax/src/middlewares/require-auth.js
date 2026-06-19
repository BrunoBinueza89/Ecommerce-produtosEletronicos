import { AppError } from "../models/app-error.js";

export function requireAuth(request, _response, next) {
  if (!request.auth) {
    next(new AppError("Autenticacao obrigatoria.", { code: "UNAUTHORIZED", statusCode: 401 }));
    return;
  }

  next();
}

export function requirePermission(permissionKey) {
  return function permissionMiddleware(request, _response, next) {
    if (!request.auth) {
      next(new AppError("Autenticacao obrigatoria.", { code: "UNAUTHORIZED", statusCode: 401 }));
      return;
    }

    const hasPermission = request.auth.permissions?.includes(permissionKey);

    if (!hasPermission) {
      next(new AppError("Permissao insuficiente.", { code: "FORBIDDEN", statusCode: 403 }));
      return;
    }

    next();
  };
}
