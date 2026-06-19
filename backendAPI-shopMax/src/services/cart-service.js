import { AppError } from "../models/app-error.js";
import { serializeCart, serializeCartItem } from "../models/cart-model.js";
import {
  addCartItem,
  createCartSession,
  deleteCartItem,
  findCartBySessionToken,
  findCartItemById,
  findCartItems,
  findProductForCart,
  updateCartItemQuantity
} from "../repositories/cart-repository.js";
import { attachPromotionPricing } from "./pricing-service.js";

async function getOrFailCart(sessionToken) {
  if (!sessionToken) {
    throw new AppError("Session token do carrinho e obrigatorio.", {
      code: "CART_SESSION_REQUIRED",
      statusCode: 422
    });
  }

  const cart = await findCartBySessionToken(sessionToken);

  if (!cart) {
    throw new AppError("Carrinho nao encontrado.", {
      code: "CART_NOT_FOUND",
      statusCode: 404
    });
  }

  return cart;
}

export async function startCartSession() {
  const cart = await createCartSession();
  return serializeCart(cart, []);
}

export async function getCart(sessionToken) {
  const cart = await getOrFailCart(sessionToken);
  const items = (await findCartItems(cart.id)).map(serializeCartItem);
  return serializeCart(cart, items);
}

export async function addItemToCart(payload) {
  const cart = await getOrFailCart(payload.sessionToken);
  const [product] = await attachPromotionPricing([await findProductForCart(payload.productId)].filter(Boolean));

  if (!product) {
    throw new AppError("Produto nao encontrado.", {
      code: "PRODUCT_NOT_FOUND",
      statusCode: 404
    });
  }

  if (product.status === "inativo" || product.status === "rascunho") {
    throw new AppError("Produto indisponivel para venda.", {
      code: "PRODUCT_UNAVAILABLE",
      statusCode: 422
    });
  }

  if (Number(product.saldo ?? 0) < payload.quantity) {
    throw new AppError("Quantidade solicitada excede o estoque disponivel.", {
      code: "INSUFFICIENT_STOCK",
      statusCode: 422
    });
  }

  const unitPrice = product.preco_promocional_efetivo ?? product.preco_promocional ?? product.preco;

  await addCartItem(cart.id, {
    productId: payload.productId,
    productVariationId: payload.productVariationId ?? null,
    quantity: payload.quantity,
    unitPrice
  });

  return getCart(payload.sessionToken);
}

export async function updateCartItem(payload) {
  const cart = await getOrFailCart(payload.sessionToken);
  const item = await findCartItemById(cart.id, payload.itemId);

  if (!item) {
    throw new AppError("Item do carrinho nao encontrado.", {
      code: "CART_ITEM_NOT_FOUND",
      statusCode: 404
    });
  }

  if (payload.quantity <= 0) {
    await deleteCartItem(item.id);
    return getCart(payload.sessionToken);
  }

  const product = await findProductForCart(item.produto_id);

  if (Number(product?.saldo ?? 0) < payload.quantity) {
    throw new AppError("Quantidade solicitada excede o estoque disponivel.", {
      code: "INSUFFICIENT_STOCK",
      statusCode: 422
    });
  }

  await updateCartItemQuantity(item.id, payload.quantity);
  return getCart(payload.sessionToken);
}

export async function removeCartItem(payload) {
  const cart = await getOrFailCart(payload.sessionToken);
  const item = await findCartItemById(cart.id, payload.itemId);

  if (!item) {
    throw new AppError("Item do carrinho nao encontrado.", {
      code: "CART_ITEM_NOT_FOUND",
      statusCode: 404
    });
  }

  await deleteCartItem(item.id);
  return getCart(payload.sessionToken);
}
