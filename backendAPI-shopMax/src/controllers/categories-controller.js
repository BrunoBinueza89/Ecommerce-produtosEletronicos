import { createCategoryEntry, getCategories } from "../services/category-service.js";
import { logAdminAction } from "../services/audit-log-service.js";

export async function listCategoriesController(_request, response, next) {
  try {
    const categories = await getCategories();
    response.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
}

export async function createCategoryController(request, response, next) {
  try {
    const category = await createCategoryEntry(request.validatedBody);
    await logAdminAction(request, {
      module: "categories",
      entity: "categorias",
      entityId: category.id,
      action: "create",
      payloadJson: request.validatedBody
    });
    response.status(201).json({ data: category });
  } catch (error) {
    next(error);
  }
}
