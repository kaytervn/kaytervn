import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const authController = (fetchApi: any) => {
  const login = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/api/token",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BASIC,
    });

  const profile = () =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/profile",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const updateProfile = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/update-profile-admin",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const changePassword = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/change-profile-password",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const verifyCreditial = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/verify-credential",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const requestForgetPassword = (email: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/request-forget-password",
      method: METHOD.POST,
      payload: { email },
      authType: AUTH_TYPE.NONE,
    });

  const resetPassword = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/reset-password",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.NONE,
    });

  const inputKey = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/input-key",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const clearKey = (payload: any) =>
    fetchApi({
      apiUrl: API_URL.MASTER_API,
      endpoint: "/v1/account/clear-key",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    login,
    profile,
    updateProfile,
    changePassword,
    verifyCreditial,
    requestForgetPassword,
    resetPassword,
    inputKey,
    clearKey,
  };
};
