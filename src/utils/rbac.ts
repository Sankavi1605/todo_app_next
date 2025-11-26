export const ROLE_VALUES = ["USER", "MANAGER", "ADMIN"] as const;

// All roles can be selected during signup (ADMIN requires secret code)
export const SIGNUP_ROLE_VALUES = ["USER", "MANAGER", "ADMIN"] as const;

// Secret code required to create ADMIN account
export const ADMIN_SECRET_CODE = "ADMIN2024";

export type Role = (typeof ROLE_VALUES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  USER: "User – manage only your own todos",
  MANAGER: "Manager – view and edit all todos, delete only your own",
  ADMIN: "Admin – full control over all todos",
};

type TodoAction = "toggle" | "edit" | "delete";

export type TodoPermissions = {
  canToggle: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

function isOwner(currentUserId: string, ownerId: string) {
  return currentUserId === ownerId;
}

export function getTodoPermissions(
  role: Role,
  currentUserId: string,
  ownerId: string,
): TodoPermissions {
  const own = isOwner(currentUserId, ownerId);

  if (role === "ADMIN") {
    return { canToggle: true, canEdit: true, canDelete: true };
  }

  if (role === "MANAGER") {
    return { canToggle: true, canEdit: true, canDelete: own };
  }

  return { canToggle: own, canEdit: own, canDelete: own };
}

export function ensureTodoPermission(
  role: Role,
  currentUserId: string,
  ownerId: string,
  action: TodoAction,
) {
  const permissions = getTodoPermissions(role, currentUserId, ownerId);
  const key =
    action === "toggle"
      ? "canToggle"
      : action === "edit"
        ? "canEdit"
        : "canDelete";

  if (!permissions[key]) {
    throw new Error("You do not have permission to perform this action.");
  }
}

export function canViewAllTodos(role: Role) {
  return role === "MANAGER" || role === "ADMIN";
}

export function describeRole(role: Role) {
  return ROLE_LABELS[role];
}
