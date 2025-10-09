import { AUTH_TYPE, ENV, LOCAL_STORAGE, METHOD } from "../services/constant";

export const userController = (fetchApi: any) => {
  const login = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/api/token",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BASIC,
    });

  const verifyCreditial = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/verify-credential",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const changePassword = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/change-password",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const requestKey = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/request-key",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const profile = () => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/profile",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const create = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/create",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const update = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/update",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const updateProfile = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/update-profile",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const getMyKey = () => {
    localStorage.removeItem(LOCAL_STORAGE.SESSION_KEY);
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/my-key",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });
  };

  const requestForgetPassword = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/request-forgot-password",
      method: METHOD.POST,
      payload: payload,
      authType: AUTH_TYPE.NONE,
    });

  const resetPassword = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/reset-password",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/list",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const autoComplete = (payload: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/auto-complete",
      method: METHOD.GET,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const resetMfa = (id: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/reset-mfa",
      method: METHOD.PUT,
      payload: { id },
      authType: AUTH_TYPE.BEARER,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: `/v1/user/get/${id}`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const activateAccount = (payload: any) => {
    return fetchApi({
      apiUrl: ENV.API_URL,
      endpoint: "/v1/user/activate-account",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });
  };

  return {
    login,
    update,
    updateProfile,
    list,
    autoComplete,
    verifyCreditial,
    changePassword,
    requestKey,
    getMyKey,
    requestForgetPassword,
    resetPassword,
    profile,
    create,
    resetMfa,
    get,
    activateAccount,
  };
};
