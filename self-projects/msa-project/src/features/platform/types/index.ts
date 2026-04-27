import { z } from "zod";
import type { BaseEntity } from "@/shared/types/common.types";

export interface Platform extends BaseEntity {
  name: string;
  url?: string;
  [key: string]: unknown;
}

export const platformSchema = z.object({
  name: z.string().min(1, "Tên không hợp lệ"),
  url: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

export type PlatformForm = z.infer<typeof platformSchema>;

export interface PlatformPayload {
  id?: number;
  name: string;
  url?: string;
}
