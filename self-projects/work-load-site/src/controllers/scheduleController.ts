import { AUTH_TYPE, ENV, METHOD } from "../types/constant";

export const scheduleController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/schedule/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/schedule/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/schedule/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/schedule/create`,
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/schedule/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/schedule/delete/${id}`,
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
