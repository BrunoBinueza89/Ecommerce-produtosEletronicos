import { createBrandEntry, getBrands } from "../services/brand-service.js";
import { logAdminAction } from "../services/audit-log-service.js";

export async function listBrandsController(_request, response, next) {
  try {
    const brands = await getBrands();
    response.status(200).json({ data: brands });
  } catch (error) {
    next(error);
  }
}

export async function createBrandController(request, response, next) {
  try {
    const brand = await createBrandEntry(request.validatedBody);
    await logAdminAction(request, {
      module: "brands",
      entity: "marcas",
      entityId: brand.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data: brand });
  } catch (error) {
    next(error);
  }
}
