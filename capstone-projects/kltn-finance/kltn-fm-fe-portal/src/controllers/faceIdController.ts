import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import {
  API_HEADER,
  API_URL,
  AUTH_TYPE,
  METHOD,
} from "../services/constant.ts";

export const faceIdController = (fetchApi: any) => {
  const { tenantInfo } = useGlobalContext();

  const register = (payload: any) => {
    return fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/face-id/register",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });
  };

  const verify = (imageData: any) => {
    return fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/face-id/verify",
      method: METHOD.POST,
      payload: { imageData },
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });
  };

  const del = (payload: any) => {
    return fetchApi({
      apiUrl: API_URL.TENANT_API,
      endpoint: "/v1/face-id/delete",
      method: METHOD.POST,
      payload,
      authType: AUTH_TYPE.BEARER,
      headers: {
        [API_HEADER.X_TENANT]: tenantInfo?.tenantId,
      },
    });
  };

  return {
    register,
    verify,
    del,
  };
};
