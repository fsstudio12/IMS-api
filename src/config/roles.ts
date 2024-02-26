const allRoles = {
  super_admin: ['getEmployees', 'manageEmployees'],
  admin: ['getOwnEmployees', 'manageOwnEmployees'],
  employee: [],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
