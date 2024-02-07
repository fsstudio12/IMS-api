const allRoles = {
  employee: [],
  admin: ['getOwnEmployees', 'manageOwnEmployees'],
  super_admin: ['getEmployees', 'manageEmployees'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
