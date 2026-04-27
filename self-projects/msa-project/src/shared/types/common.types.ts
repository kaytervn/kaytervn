/** Base entity with numeric ID — all API models extend this */
export interface BaseEntity {
  id: number;
}

/** User profile returned by /v1/user/profile */
export interface UserProfile extends BaseEntity {
  username: string;
  fullName: string;
  email: string;
  kind: number;
  authorities?: string[];
}

/** Platform entity */
export interface Platform extends BaseEntity {
  name: string;
  url?: string | null;
}

/** Tag entity */
export interface Tag extends BaseEntity {
  name: string;
  kind: number;
  color: string;
}

/** Account entity */
export interface Account extends BaseEntity {
  username?: string;
  password?: string;
  note?: string;
  codes?: string;
  kind: number;
  platform?: Platform;
  parent?: Account;
  tag?: Tag;
}

/** Bank entity */
export interface Bank extends BaseEntity {
  username: string;
  password?: string;
  pins?: string;
  numbers?: string;
  tag?: Tag;
}

/** Note entity */
export interface Note extends BaseEntity {
  name?: string;
  content?: string;
}

/** Decoded JWT payload structure */
export interface JwtPayload {
  user_id: string;
  username: string;
  authorities?: string[];
  exp?: number;
  iat?: number;
}

/** Session key data persisted to localStorage */
export interface SessionData {
  key: string;
  expirationTime: number;
}

/** JSON list item used in recovery codes / bank numbers / pins */
export interface JsonListItem {
  index?: number;
  name: string;
  note: string;
}

/** Dialog type constants */
export const DIALOG_TYPE = {
  FORM: "FORM",
  DELETE: "DELETE",
} as const;

export type DialogType = (typeof DIALOG_TYPE)[keyof typeof DIALOG_TYPE];

/** Generic dialog state */
export interface DialogState<T = unknown> {
  visible: boolean;
  type: DialogType;
  data?: T;
}

/** Pagination state for grid views */
export interface PaginationState {
  page: number;
  totalPages: number;
}

/** Grid query parameters */
export interface GridQuery {
  page: number;
  size: number;
  [key: string]: unknown;
}
