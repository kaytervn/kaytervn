import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import type { Account, AccountPayload } from "../types";
import type { PaginatedData } from "@/shared/types/api.types";
import type { GridQuery } from "@/shared/types/common.types";

export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params: GridQuery) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: number) => [...accountKeys.details(), id] as const,
};

export const fetchAccountList = (params: GridQuery) =>
  apiFetch<PaginatedData<Account>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/account/list",
    method: METHOD.GET,
    payload: params as unknown as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });

export const useAccountQuery = (id?: number) =>
  useQuery({
    queryKey: accountKeys.detail(id!),
    queryFn: () =>
      apiFetch<Account>({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/account/get/${id}`,
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateAccountMutation = () =>
  useMutation({
    mutationFn: (payload: AccountPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/account/create",
        method: METHOD.POST,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useUpdateAccountMutation = () =>
  useMutation({
    mutationFn: (payload: AccountPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/account/update",
        method: METHOD.PUT,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useDeleteAccountMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/account/delete/${id}`,
        method: METHOD.DELETE,
        authType: AUTH_TYPE.BEARER,
      }),
  });
