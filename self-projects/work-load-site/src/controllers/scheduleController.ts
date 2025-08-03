import { encryptClientField } from "../services/encryption/clientEncryption";
import { API_HEADER, AUTH_TYPE, ENV, METHOD } from "../types/constant";
import { generateTimestamp } from "../types/utils";

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

  const checkSchedule = (tenant: any, token: any) => {
    const myTenant = encryptClientField(
      [generateTimestamp(), tenant].join("|")
    );
    return fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/schedule/check-schedule",
      method: METHOD.POST,
      payload: { token },
      authType: AUTH_TYPE.NONE,
      headers: {
        [API_HEADER.X_TENANT]: myTenant,
      },
    });
  };

  return {
    list,
    checkSchedule,
    get,
    create,
    update,
    del,
    autoComplete,
  };
};
