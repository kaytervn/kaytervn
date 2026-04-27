import { z } from "zod";
import type { BaseEntity } from "@/shared/types/common.types";
import type { Tag } from "@/features/tag/types";

export interface Bank extends BaseEntity {
  tag?: Tag;
  username?: string;
  password?: string; // encrypted
  numbers?: string; // JSON array
  pins?: string; // encrypted JSON array
  [key: string]: unknown;
}

export const bankSchema = z.object({
  tagId: z.number({ message: "Thẻ là bắt buộc" }),
  username: z.string().min(1, "Tài khoản không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không hợp lệ"),
  numbers: z.string().optional(),
  pins: z.string().optional(),
});

export const updateBankSchema = z.object({
  tagId: z.number().optional(),
  username: z.string().min(1, "Tài khoản không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không hợp lệ"),
  numbers: z.string().optional(),
  pins: z.string().optional(),
});

export type BankFormType = z.infer<typeof bankSchema>;

export interface BankPayload {
  id?: number;
  tagId?: number;
  username?: string;
  password?: string | null;
  numbers?: string | null;
  pins?: string | null;
}
