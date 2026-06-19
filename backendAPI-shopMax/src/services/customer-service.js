import { AppError } from "../models/app-error.js";
import { serializeAddress } from "../models/address-model.js";
import { sanitizeUser } from "../models/user-model.js";
import {
  createAddress,
  findCustomerByUserId,
  listAddressesByCustomerId
} from "../repositories/customer-repository.js";
import { findUserById } from "../repositories/user-repository.js";

export async function getCustomerContext(userId) {
  const user = await findUserById(userId);
  const customer = await findCustomerByUserId(userId);

  if (!user || !customer) {
    throw new AppError("Cliente nao encontrado.", {
      code: "CUSTOMER_NOT_FOUND",
      statusCode: 404
    });
  }

  return {
    user,
    customer
  };
}

export async function getCustomerProfile(userId) {
  const { user, customer } = await getCustomerContext(userId);
  const addresses = await listAddressesByCustomerId(customer.id);

  return {
    user: sanitizeUser(user),
    customer: {
      id: customer.id,
      name: customer.nome,
      cpf: customer.cpf,
      phone: customer.telefone,
      active: Boolean(customer.ativo)
    },
    addresses: addresses.map(serializeAddress)
  };
}

export async function addCustomerAddress(userId, payload) {
  const { customer } = await getCustomerContext(userId);
  const address = await createAddress(customer.id, payload);
  return serializeAddress(address);
}
