import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  METHOD,
} from "../services/constant.ts";

export const notificationController = (fetchApi: any) => {
  const { tenantInfo } = useGlobalContext();

  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/notification/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const myNotification = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/notification/my-notification",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const read = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/notification/read`,
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const readAll = () =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/notification/read-all`,
      method: METHOD.PUT,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/notification/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const deleteAll = () =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/notification/delete-all`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  return {
    list,
    myNotification,
    read,
    readAll,
    deleteAll,
    del,
  };
};
