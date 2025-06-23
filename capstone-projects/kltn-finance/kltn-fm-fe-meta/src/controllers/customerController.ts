import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const customerController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/customer/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/customer/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/customer/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/customer/create`,
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/customer/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/customer/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    list,
    get,
    create,
    del,
    update,
    autoComplete,
  };
};
