import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const locationController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/location/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/location/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/location/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/location/create`,
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/location/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: `/v1/location/delete/${id}`,
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
