import { z } from "zod";
import type { BaseEntity } from "@/shared/types/common.types";

export interface Tag extends BaseEntity {
  name: string;
  kind: number;
  color: string;
  [key: string]: unknown;
}

export const tagSchema = z.object({
  name: z.string().min(1, "Tên không hợp lệ"),
});

export type TagForm = z.infer<typeof tagSchema>;

export interface TagPayload {
  id?: number;
  name: string;
  kind?: number;
  color?: string;
}
