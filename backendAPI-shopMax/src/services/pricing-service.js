import { listApplicablePromotions } from "../repositories/content-repository.js";

function calculatePromotionPrice(basePrice, promotion) {
  if (promotion.percentual !== null && promotion.percentual !== undefined) {
    return Math.max(basePrice - basePrice * (Number(promotion.percentual) / 100), 0);
  }

  if (promotion.valor !== null && promotion.valor !== undefined) {
    return Math.max(basePrice - Number(promotion.valor), 0);
  }

  return basePrice;
}

export async function attachPromotionPricing(rows) {
  if (!rows.length) {
    return rows;
  }

  const productIds = [...new Set(rows.map((row) => row.id ?? row.produto_id).filter(Boolean))];
  const categoryIds = [...new Set(rows.map((row) => row.categoria_id).filter(Boolean))];
  const promotions = await listApplicablePromotions(productIds, categoryIds);

  return rows.map((row) => {
    const productId = row.id ?? row.produto_id;
    const basePrice = Number(row.preco);
    const manualPromoPrice =
      row.preco_promocional === null || row.preco_promocional === undefined
        ? null
        : Number(row.preco_promocional);

    let bestPromotion = null;
    let bestPrice = manualPromoPrice ?? basePrice;

    for (const promotion of promotions) {
      const matchesProduct = promotion.produto_id && Number(promotion.produto_id) === Number(productId);
      const matchesCategory =
        promotion.categoria_id && Number(promotion.categoria_id) === Number(row.categoria_id);

      if (!matchesProduct && !matchesCategory) {
        continue;
      }

      const candidatePrice = calculatePromotionPrice(basePrice, promotion);

      if (candidatePrice < bestPrice) {
        bestPrice = candidatePrice;
        bestPromotion = promotion;
      }
    }

    return {
      ...row,
      preco_promocional_efetivo: bestPrice < basePrice ? bestPrice : manualPromoPrice,
      promocao_nome: bestPromotion?.nome ?? null,
      promocao_percentual: bestPromotion?.percentual ?? null,
      promocao_valor: bestPromotion?.valor ?? null
    };
  });
}
