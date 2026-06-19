import { createAuditLog, listAuditLogs } from "../repositories/admin-repository.js";

export async function logAdminAction(request, payload) {
  await createAuditLog({
    userId: request.auth?.sub ?? null,
    ip: request.ip,
    ...payload
  });
}

export async function getAuditLogs() {
  return listAuditLogs();
}
