import { AUTH_TYPE, ENV, METHOD } from "../services/constant";

export const tagController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/tag/list",
      method: METHOD.GET,
      payload: { ...payload, kind: 2 },
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/tag/auto-complete",
      method: METHOD.GET,
      payload: { ...payload, kind: 2 },
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: `/v1/tag/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: `/v1/tag/create`,
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: `/v1/tag/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: `/v1/tag/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    list,
    get,
    create,
    update,
    del,
    autoComplete,
  };
};
