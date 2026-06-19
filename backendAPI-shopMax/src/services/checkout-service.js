import { AppError } from "../models/app-error.js";
import { getCustomerContext } from "./customer-service.js";
import { getCart } from "./cart-service.js";
import { checkoutCart, previewCheckoutTotals } from "../repositories/checkout-repository.js";
import { attachCustomerToCart } from "../repositories/cart-repository.js";
import { getOrderDetailForUser } from "./order-service.js";

export async function previewCheckout(userId, sessionToken, couponCode = null) {
  const { customer } = await getCustomerContext(userId);
  await attachCustomerToCart(sessionToken, customer.id);
  const cart = await getCart(sessionToken);

  if (!cart.items.length) {
    throw new AppError("Carrinho vazio.", {
      code: "EMPTY_CART",
      statusCode: 422
    });
  }

  const shipping = 29.9;
  const totals = await previewCheckoutTotals({
    customerId: customer.id,
    sessionToken,
    shippingPrice: shipping,
    paymentMethod: "pix",
    couponCode
  });
  const pixDiscount = totals.pixDiscount;

  return {
    customerId: customer.id,
    cart,
    appliedCoupon: totals.appliedCoupon,
    totals: {
      subtotal: totals.subtotal,
      couponDiscount: totals.couponDiscount,
      pixDiscount: totals.pixDiscount,
      shipping,
      totalWithPix: totals.total
    },
    shippingOptions: [
      { method: "standard", label: "Entrega padrao", price: shipping, etaDays: 5 },
      { method: "express", label: "Entrega expressa", price: 49.9, etaDays: 2 }
    ],
    paymentOptions: [
      { method: "pix", label: "PIX", discount: pixDiscount },
      { method: "cartao", label: "Cartao de credito", installments: [1, 2, 3] }
    ]
  };
}

export async function finalizeCheckout(userId, payload) {
  const { customer } = await getCustomerContext(userId);
  await attachCustomerToCart(payload.sessionToken, customer.id);
  const result = await checkoutCart({
    ...payload,
    customerId: customer.id
  });

  return getOrderDetailForUser(userId, result.orderId);
}
