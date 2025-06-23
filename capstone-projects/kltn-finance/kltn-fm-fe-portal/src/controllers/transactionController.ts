import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  METHOD,
} from "../services/constant.ts";

export const transactionController = (fetchApi: any) => {
  const { tenantInfo } = useGlobalContext();

  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/transaction/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/transaction/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/create`,
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const approve = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/approve`,
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const reject = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/reject`,
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const removeFromPeriod = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/remove-from-period`,
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const exportToExcel = (transactionIds: any, kind: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/transaction/export-to-excel`,
      method: METHOD.POST,
      payload: { transactionIds, kind },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const importExcel = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/transaction/import-excel",
      method: METHOD.POST,
      payload: formData,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });
  };

  return {
    list,
    autoComplete,
    get,
    create,
    update,
    del,
    approve,
    reject,
    exportToExcel,
    importExcel,
    removeFromPeriod,
  };
};
