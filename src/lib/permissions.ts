/**
 * Permission utility functions for role-based access control
 * RoleID 1: Admin (Full access)
 * RoleID 2: Manager (Limited access)
 */

export const ROLES = {
  ADMIN: "1",
  MANAGER: "2",
} as const;

export interface Permission {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

/**
 * Check if user can perform CRUD operations on products
 */
export const getProductPermissions = (roleId?: string | number): Permission => {
  if (!roleId)
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };

  // Convert to string for comparison
  const roleIdStr = String(roleId);

  // Both Admin and Manager can CRUD products
  if (roleIdStr === ROLES.ADMIN || roleIdStr === ROLES.MANAGER) {
    return { canCreate: true, canEdit: true, canDelete: true, canView: true };
  }

  return { canCreate: false, canEdit: false, canDelete: false, canView: false };
};

/**
 * Check if user can perform CRUD operations on categories
 * Only Admin can create/edit/delete categories
 * Manager can only view categories
 */
export const getCategoryPermissions = (roleId?: string | number): Permission => {
  if (!roleId)
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };

  // Convert to string for comparison
  const roleIdStr = String(roleId);

  // Only Admin can CRUD categories
  if (roleIdStr === ROLES.ADMIN) {
    return { canCreate: true, canEdit: true, canDelete: true, canView: true };
  }

  // Manager can only view
  if (roleIdStr === ROLES.MANAGER) {
    return { canCreate: false, canEdit: false, canDelete: false, canView: true };
  }

  return { canCreate: false, canEdit: false, canDelete: false, canView: false };
};

/**
 * Check if user can perform operations on discounts
 * Managers can only view, not edit or delete
 */
export const getDiscountPermissions = (roleId?: string): Permission => {
  if (!roleId)
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };

  // Admin has full access
  if (roleId === ROLES.ADMIN) {
    return { canCreate: true, canEdit: true, canDelete: true, canView: true };
  }

  // Manager can only view
  if (roleId === ROLES.MANAGER) {
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
    };
  }

  return { canCreate: false, canEdit: false, canDelete: false, canView: false };
};

/**
 * Check if user can access IoT features
 * Only Admin can access
 */
export const IsAccessWithAdmin = (roleId?: string | number): boolean => {
  return String(roleId) === ROLES.ADMIN;
};

/**
 * Check if user can access inventory features
 */
export const getInventoryPermissions = (roleId?: string): Permission => {
  if (!roleId)
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };

  // Both Admin and Manager have full access
  if (roleId === ROLES.ADMIN || roleId === ROLES.MANAGER) {
    return { canCreate: true, canEdit: true, canDelete: true, canView: true };
  }

  return { canCreate: false, canEdit: false, canDelete: false, canView: false };
};

/**
 * Check if user can access order management
 * Both Admin and Manager can view and edit orders
 * Only Admin can delete orders
 */
export const getOrderPermissions = (roleId?: string): Permission => {
  if (!roleId)
    return {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: false,
    };

  // Admin has full access
  if (roleId === ROLES.ADMIN) {
    return { canCreate: true, canEdit: true, canDelete: true, canView: true };
  }

  // Manager can view and edit, but not delete
  if (roleId === ROLES.MANAGER) {
    return { canCreate: false, canEdit: true, canDelete: false, canView: true };
  }

  return { canCreate: false, canEdit: false, canDelete: false, canView: false };
};

/**
 * Check if user can access order management page
 */
export const canAccessOrders = (roleId?: string): boolean => {
  return roleId === ROLES.ADMIN || roleId === ROLES.MANAGER;
};

/**
 * Check if user is admin
 */
export const isAdmin = (roleId?: string): boolean => {
  return roleId === ROLES.ADMIN;
};

/**
 * Check if user is manager
 */
export const isManager = (roleId?: string): boolean => {
  return roleId === ROLES.MANAGER;
};
