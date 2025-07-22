import { AUTH_TYPE, ENV, METHOD } from "../types/constant";

export const platformController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/platform/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/platform/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/platform/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/platform/create`,
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/platform/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/platform/delete/${id}`,
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
