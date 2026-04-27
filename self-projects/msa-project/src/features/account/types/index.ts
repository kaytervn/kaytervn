import { z } from "zod";
import type { BaseEntity, Platform } from "@/shared/types/common.types";
import type { Tag } from "@/features/tag/types";

export interface Account extends BaseEntity {
  username?: string;
  password?: string;
  note?: string;
  codes?: string; // encrypted JSON array string
  kind?: number; // 1: Parent, 2: Child
  platform?: Platform;
  tag?: Tag;
  parent?: Account;
  [key: string]: unknown;
}

export const baseAccountSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  platformId: z.number().optional(),
  note: z.string().optional(),
  codes: z.string().optional(),
});

export const createParentAccountSchema = z.object({
  username: z.string().min(1, "Tài khoản là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  platformId: z.number({ message: "Nền tảng là bắt buộc" }),
  note: z.string().optional(),
  codes: z.string().optional(),
});

export const updateParentAccountSchema = z.object({
  username: z.string().min(1, "Tài khoản là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  platformId: z.number().optional(),
  note: z.string().optional(),
  codes: z.string().optional(),
});

export const childAccountSchema = z.object({
  platformId: z.number({ message: "Nền tảng là bắt buộc" }),
  note: z.string().optional(),
  codes: z.string().optional(),
});

export type AccountFormType = z.infer<typeof baseAccountSchema>;

export interface AccountPayload {
  id?: number;
  username?: string;
  password?: string | null;
  note?: string;
  codes?: string | null;
  kind?: number;
  platformId?: number;
  parentId?: number;
  tagId?: number;
}
