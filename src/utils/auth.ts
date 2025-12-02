export enum Role {
  ADMIN = 1,
  SELLER = 2,
  USER = 3,
}

export interface User {
  id: number;
  name: string;
  roleId: Role;
}

export const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    let role: Role;
    switch (payload.roleId) {
      case 1:
        role = Role.ADMIN;
        break;
      case 2:
        role = Role.SELLER;
        break;
      case 3:
        role = Role.USER;
        break;
      default:
        role = Role.USER;
    }

    return {
      id: payload.sub,
      name: payload.email,
      roleId: role,
    };
  } catch {
    return null;
  }
};
