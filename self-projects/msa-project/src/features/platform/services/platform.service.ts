import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import type { Platform, PlatformPayload } from "../types";
import type { PaginatedData } from "@/shared/types/api.types";
import type { GridQuery } from "@/shared/types/common.types";

export const platformKeys = {
  all: ["platforms"] as const,
  lists: () => [...platformKeys.all, "list"] as const,
  list: (params: GridQuery) => [...platformKeys.lists(), params] as const,
  details: () => [...platformKeys.all, "detail"] as const,
  detail: (id: number) => [...platformKeys.details(), id] as const,
};

export const fetchPlatformList = (params: GridQuery) =>
  apiFetch<PaginatedData<Platform>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/platform/list",
    method: METHOD.GET,
    payload: params as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });

export const usePlatformQuery = (id?: number) =>
  useQuery({
    queryKey: platformKeys.detail(id!),
    queryFn: () =>
      apiFetch<Platform>({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/platform/get/${id}`,
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreatePlatformMutation = () =>
  useMutation({
    mutationFn: (payload: PlatformPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/platform/create",
        method: METHOD.POST,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useUpdatePlatformMutation = () =>
  useMutation({
    mutationFn: (payload: PlatformPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/platform/update",
        method: METHOD.PUT,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useDeletePlatformMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/platform/delete/${id}`,
        method: METHOD.DELETE,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const fetchPlatformAutoComplete = (params: {
  keyword?: string;
  id?: number;
}) =>
  apiFetch<PaginatedData<Platform>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/platform/auto-complete",
    method: METHOD.GET,
    payload: params as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });
