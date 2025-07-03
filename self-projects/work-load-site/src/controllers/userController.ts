import { AUTH_TYPE, ENV, LOCAL_STORAGE, METHOD } from "../types/constant";

export const userController = (fetchApi: any) => {
  const login = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/login",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BASIC,
    });

  const inputKey = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/key/input-key",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const verifyCreditial = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/verify-credential",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const changePassword = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/change-password",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const changePin = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/change-pin",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const requestKey = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/request-key",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const verifyToken = () => {
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/verify-token",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const getMyKey = () => {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/my-key",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const requestForgetPassword = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/request-forgot-password",
      method: METHOD.POST,
      payload: payload,
      authType: AUTH_TYPE.NONE,
    });

  const resetPassword = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/reset-password",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const requestResetMfa = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/request-reset-mfa",
      method: METHOD.POST,
      payload: payload,
      authType: AUTH_TYPE.NONE,
    });

  const resetMfa = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/reset-mfa",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const clearSystemKey = () =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/clear-key",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const syncSystemProps = () =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/user/sync-config",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    login,
    verifyCreditial,
    changePassword,
    requestKey,
    verifyToken,
    getMyKey,
    requestForgetPassword,
    resetPassword,
    inputKey,
    requestResetMfa,
    resetMfa,
    clearSystemKey,
    changePin,
    syncSystemProps,
  };
};
