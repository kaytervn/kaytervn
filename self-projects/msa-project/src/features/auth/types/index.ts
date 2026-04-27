import { z } from "zod";
import { VALID_PATTERN } from "@/shared/constants";

// --- API Request Payloads ---

export interface LoginPayload {
  username?: string;
  password?: string;
  totp?: string;
  grant_type?: string;
}

export interface VerifyCredentialPayload {
  username?: string;
  password?: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}

export interface RequestForgotPasswordPayload {
  email?: string;
}

export interface ResetPasswordPayload {
  userId?: string;
  email?: string;
  code?: string;
  password?: string;
}

// --- Zod Form Schemas ---

export const loginSchema = z.object({
  username: z.string().min(1, "Tài khoản là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
  totp: z.string().optional(),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const totpSchema = z.object({
  totp: z.string().min(1, "Mã xác thực là bắt buộc"),
});
export type TotpForm = z.infer<typeof totpSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .regex(VALID_PATTERN.PASSWORD, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .regex(VALID_PATTERN.EMAIL, "Email không hợp lệ"),
});
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, "Mã xác thực là bắt buộc"),
    newPassword: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .regex(VALID_PATTERN.PASSWORD, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const requestKeySchema = z.object({
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});
export type RequestKeyForm = z.infer<typeof requestKeySchema>;

export const profileSchema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().regex(VALID_PATTERN.EMAIL, "Email không hợp lệ").optional(),
});
export type ProfileForm = z.infer<typeof profileSchema>;
