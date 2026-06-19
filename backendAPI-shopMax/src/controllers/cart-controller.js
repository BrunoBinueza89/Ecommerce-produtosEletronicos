import {
  addItemToCart,
  getCart,
  removeCartItem,
  startCartSession,
  updateCartItem
} from "../services/cart-service.js";

export async function createCartSessionController(_request, response, next) {
  try {
    const cart = await startCartSession();
    response.status(201).json({ data: cart });
  } catch (error) {
    next(error);
  }
}

export async function getCartController(request, response, next) {
  try {
    const cart = await getCart(request.query.sessionToken);
    response.status(200).json({ data: cart });
  } catch (error) {
    next(error);
  }
}

export async function addCartItemController(request, response, next) {
  try {
    const cart = await addItemToCart(request.validatedBody);
    response.status(200).json({ data: cart });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItemController(request, response, next) {
  try {
    const cart = await updateCartItem({
      ...request.validatedBody,
      itemId: Number(request.params.itemId)
    });
    response.status(200).json({ data: cart });
  } catch (error) {
    next(error);
  }
}

export async function deleteCartItemController(request, response, next) {
  try {
    const cart = await removeCartItem({
      sessionToken: request.query.sessionToken,
      itemId: Number(request.params.itemId)
    });
    response.status(200).json({ data: cart });
  } catch (error) {
    next(error);
  }
}
