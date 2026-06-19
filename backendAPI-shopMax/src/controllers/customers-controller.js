import { addCustomerAddress, getCustomerProfile } from "../services/customer-service.js";

export async function getCustomerProfileController(request, response, next) {
  try {
    const profile = await getCustomerProfile(request.auth.sub);
    response.status(200).json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function createCustomerAddressController(request, response, next) {
  try {
    const address = await addCustomerAddress(request.auth.sub, request.validatedBody);
    response.status(201).json({ data: address });
  } catch (error) {
    next(error);
  }
}
