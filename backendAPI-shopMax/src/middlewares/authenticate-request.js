import { verifyAccessToken } from "../services/token-service.js";

export function authenticateRequest(request, _response, next) {
  const header = request.headers.authorization;

  if (!header) {
    request.auth = null;
    next();
    return;
  }

  const [, token] = header.split(" ");

  try {
    request.auth = verifyAccessToken(token);
  } catch {
    request.auth = null;
  }

  next();
}
