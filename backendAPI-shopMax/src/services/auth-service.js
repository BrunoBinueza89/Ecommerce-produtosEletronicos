import { AppError } from "../models/app-error.js";
import { sanitizeUser } from "../models/user-model.js";
import {
  createCustomerAccount,
  findUserByEmail,
  findUserById,
  listUserPermissions,
  updateLastLogin
} from "../repositories/user-repository.js";
import { hashPassword, verifyPassword } from "./password-service.js";
import { signAccessToken } from "./token-service.js";

export async function login(payload) {
  const user = await findUserByEmail(payload.email);

  if (!user || !user.ativo) {
    throw new AppError("Credenciais invalidas.", { code: "INVALID_CREDENTIALS", statusCode: 401 });
  }

  const passwordMatches = await verifyPassword(payload.password, user.senha_hash);

  if (!passwordMatches) {
    throw new AppError("Credenciais invalidas.", { code: "INVALID_CREDENTIALS", statusCode: 401 });
  }

  const permissions = await listUserPermissions(user.id);
  const token = signAccessToken({
    sub: user.id,
    email: user.email,
    type: user.tipo,
    profileSlug: user.profile_slug,
    permissions
  });

  await updateLastLogin(user.id);

  return {
    token,
    user: sanitizeUser(user),
    permissions
  };
}

export async function registerCustomer(payload) {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError("Email ja cadastrado.", { code: "EMAIL_IN_USE", statusCode: 409 });
  }

  const passwordHash = await hashPassword(payload.password);
  const { userId } = await createCustomerAccount({
    ...payload,
    passwordHash
  });

  const user = await findUserById(userId);

  return {
    user: sanitizeUser(user)
  };
}

export async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuario nao encontrado.", { code: "USER_NOT_FOUND", statusCode: 404 });
  }

  return sanitizeUser(user);
}
