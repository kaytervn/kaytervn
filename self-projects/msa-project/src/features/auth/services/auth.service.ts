import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import type {
  LoginPayload,
  VerifyCredentialPayload,
  ChangePasswordPayload,
  RequestForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types";
import type {
  TokenResponse,
  VerifyCredentialResponse,
  RequestKeyResponse,
  ForgotPasswordResponse,
  ApiResponse,
} from "@/shared/types/api.types";
import type { UserProfile } from "@/shared/types/common.types";

export const authKeys = {
  profile: ["auth", "profile"] as const,
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiFetch<TokenResponse>({
        apiUrl: ENV.API_URL,
        endpoint: "/api/token",
        method: METHOD.POST,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.BASIC,
      });

      // Transform OAuth2 flat response to standard ApiResponse
      if ((res as any).access_token) {
        return {
          result: true,
          data: res as unknown as TokenResponse,
        } as ApiResponse<TokenResponse>;
      }
      return res;
    },
  });
};

export const useVerifyCredentialMutation = () => {
  return useMutation({
    mutationFn: (payload: VerifyCredentialPayload) =>
      apiFetch<VerifyCredentialResponse>({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/verify-credential",
        method: METHOD.POST,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.NONE,
      }),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/change-password",
        method: METHOD.PUT,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });
};

export const useRequestKeyMutation = () => {
  return useMutation({
    mutationFn: (payload: { password?: string }) =>
      apiFetch<RequestKeyResponse>({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/request-key",
        method: METHOD.POST,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: RequestForgotPasswordPayload) =>
      apiFetch<ForgotPasswordResponse>({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/request-forgot-password",
        method: METHOD.POST,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.NONE,
      }),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/reset-password",
        method: METHOD.POST,
        payload: payload as Record<string, unknown>,
        authType: AUTH_TYPE.NONE,
      }),
  });
};

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: () =>
      apiFetch<UserProfile>({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/profile",
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/user/update-profile",
        method: METHOD.PUT,
        payload,
        authType: AUTH_TYPE.BEARER,
      }),
  });
};
