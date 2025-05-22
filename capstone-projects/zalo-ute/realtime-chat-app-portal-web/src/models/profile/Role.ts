import { Permission } from "./Permission";

export interface Role {
  _id: string;
  name: string;
  pernissions: Permission[];
}