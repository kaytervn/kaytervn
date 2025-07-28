import { AUTH_TYPE, ENV, METHOD } from "../types/constant";

export const contactController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/contact/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/contact/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/contact/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/contact/create`,
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/contact/update`,
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/contact/delete/${id}`,
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
