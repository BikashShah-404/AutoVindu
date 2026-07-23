// const = can't reassign variable.
// as const = can't change values AND preserves literal types for type derivation.

export const ADMIN_ROLES = [
  "super_admin",
  "admin",
  "content_manager",
  "data_entry",
  "customer_support",
] as const;

export const USER_ROLES = [...ADMIN_ROLES, "user"] as const;

export type ADMIN_ROLES_TYPE = (typeof ADMIN_ROLES)[number];
export type USER_ROLES_TYPE = (typeof USER_ROLES)[number];
