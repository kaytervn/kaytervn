import { AUTH_TYPE, ENV, METHOD } from "../types/constant";

export const roleController = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/group/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/group/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/group/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/group/update",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const listPermissions = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/permission/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/group/create",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: `/v1/group/delete/${id}`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    list,
    get,
    update,
    listPermissions,
    create,
    del,
    autoComplete,
  };
};
