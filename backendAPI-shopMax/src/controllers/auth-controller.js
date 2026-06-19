import { getCurrentUser, login, registerCustomer } from "../services/auth-service.js";

export async function loginController(request, response, next) {
  try {
    const result = await login(request.validatedBody);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function registerCustomerController(request, response, next) {
  try {
    const result = await registerCustomer(request.validatedBody);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function meController(request, response, next) {
  try {
    const user = await getCurrentUser(request.auth.sub);
    response.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}
