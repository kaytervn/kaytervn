import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  METHOD,
} from "../services/constant.ts";

export const paymentPeriodController = (fetchApi: any) => {
  const { tenantInfo } = useGlobalContext();

  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/payment-period/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo.tenantId,
      },
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/payment-period/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const approve = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/payment-period/approve`,
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  const recalculate = (id: any) =>
    fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: `/v1/payment-period/recalculate`,
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
      endpoint: `/v1/payment-period/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });

  return {
    list,
    del,
    approve,
    recalculate,
    get,
  };
};
