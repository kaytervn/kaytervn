import { z } from "zod";

export const inputKeySchema = z.object({
  sessionKey: z.string().min(1, "Khoá giải mã là bắt buộc"),
});

export type InputKeyForm = z.infer<typeof inputKeySchema>;
