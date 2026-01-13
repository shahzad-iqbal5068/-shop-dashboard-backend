// src/config/rolePermissions.ts

import { Role } from "../types/role";
import { Permission } from "../types/permisisons";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),

  [Role.MANAGER]: [
    Permission.USER_VIEW,
    Permission.SALES_VIEW,
    Permission.SALES_CREATE,
    Permission.REPORT_VIEW,
  ],

  [Role.SALESPERSON]: [Permission.SALES_CREATE, Permission.SALES_VIEW],

  [Role.ACCOUNTANT]: [
    Permission.ACCOUNT_VIEW,
    Permission.ACCOUNT_MANAGE,
    Permission.REPORT_VIEW,
  ],
};
