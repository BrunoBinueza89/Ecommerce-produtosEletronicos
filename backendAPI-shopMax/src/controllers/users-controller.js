import { getCurrentUser } from "../services/auth-service.js";

export async function getMyUserController(request, response, next) {
  try {
    const user = await getCurrentUser(request.auth.sub);
    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
