import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/services/apiFetch";
import { ENV } from "@/shared/types/env.types";
import { AUTH_TYPE, METHOD } from "@/shared/constants";
import type { Tag, TagPayload } from "../types";
import type { PaginatedData } from "@/shared/types/api.types";
import type { GridQuery } from "@/shared/types/common.types";

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (params: GridQuery) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};

export const fetchTagList = (params: GridQuery) =>
  apiFetch<PaginatedData<Tag>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/tag/list",
    method: METHOD.GET,
    payload: { ...params, kind: 2 } as unknown as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });

export const useTagQuery = (id?: number) =>
  useQuery({
    queryKey: tagKeys.detail(id!),
    queryFn: () =>
      apiFetch<Tag>({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/tag/get/${id}`,
        method: METHOD.GET,
        authType: AUTH_TYPE.BEARER,
      }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateTagMutation = () =>
  useMutation({
    mutationFn: (payload: TagPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/tag/create",
        method: METHOD.POST,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useUpdateTagMutation = () =>
  useMutation({
    mutationFn: (payload: TagPayload) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: "/v1/tag/update",
        method: METHOD.PUT,
        payload: payload as unknown as Record<string, unknown>,
        authType: AUTH_TYPE.BEARER,
      }),
  });

export const useDeleteTagMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      apiFetch({
        apiUrl: ENV.API_URL,
        endpoint: `/v1/tag/delete/${id}`,
        method: METHOD.DELETE,
        authType: AUTH_TYPE.BEARER,
      }),
  });
export const fetchTagAutoComplete = (params: {
  keyword?: string;
  id?: number;
}) =>
  apiFetch<PaginatedData<Tag>>({
    apiUrl: ENV.API_URL,
    endpoint: "/v1/tag/auto-complete",
    method: METHOD.GET,
    payload: { ...params, kind: 2 } as Record<string, unknown>,
    authType: AUTH_TYPE.BEARER,
  });
