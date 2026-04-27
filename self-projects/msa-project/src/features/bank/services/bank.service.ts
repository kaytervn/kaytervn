import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import type { Bank, BankPayload } from "../types";
import type { PaginatedData } from "@/shared/types/api.types";
import type { GridQuery } from "@/shared/types/common.types";

export const bankKeys = {
  all: ["banks"] as const,
  lists: () => [...bankKeys.all, "list"] as const,
  list: (params: GridQuery) => [...bankKeys.lists(), params] as const,
  details: () => [...bankKeys.all, "detail"] as const,
  detail: (id: number) => [...bankKeys.details(), id] as const,
};

export const fetchBankList = (params: GridQuery) =>
  apiFetch<PaginatedData<Bank>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/bank/list",
    method: METHOD.GET,
    payload: params as unknown as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });

export const useBankQuery = (id?: number) =>
  useQuery({
    queryKey: bankKeys.detail(id!),
    queryFn: () =>
      apiFetch<Bank>({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/bank/get/${id}`,
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateBankMutation = () =>
  useMutation({
    mutationFn: (payload: BankPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/bank/create",
        method: METHOD.POST,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useUpdateBankMutation = () =>
  useMutation({
    mutationFn: (payload: BankPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/bank/update",
        method: METHOD.PUT,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useDeleteBankMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/bank/delete/${id}`,
        method: METHOD.DELETE,
        authType: AUTH_TYPE.BEARER,
      }),
  });
