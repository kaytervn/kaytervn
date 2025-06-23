import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  METHOD,
} from "../services/constant.ts";

export const roleController = (fetchApi: any) => {
  const { tenantInfo } = useGlobalContext();

  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/group/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const getEmployeeRole = () =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/group/employee`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/group/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/group/update",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/group/create",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/group/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  return {
    list,
    get,
    update,
    create,
    del,
    getEmployeeRole,
  };
};
