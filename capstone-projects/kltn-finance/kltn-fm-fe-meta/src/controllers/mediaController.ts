import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const mediaController = (fetchApi: any) => {
  const upload = ({ file, type }: { file: File; type: string }) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("type", type);

    return fetchApi({
      apiUrl: API_URL.MEDIA_API,
      endpoint: "/v1/media/upload",
      method: METHOD.POST,
      payload: formData,
      authType: AUTH_TYPE.NONE,
    });
  };

  const pushBackup = (apiKey: string, file: File) => {
    const formData = new FormData();
    formData.append("zipFile", file, file.name);

    return fetchApi({
      apiUrl: API_URL.MEDIA_API,
      endpoint: "/v1/media/push-backup",
      method: METHOD.POST,
      authType: AUTH_TYPE.NONE,
      payload: formData,
      headers: {
        ["x-api-key"]: apiKey,
      },
    });
  };

  const downloadBackup = (apiKey: any) => {
    return fetchApi({
      apiUrl: API_URL.MEDIA_API,
      endpoint: "/v1/media/download-backup",
      method: METHOD.GET,
      authType: AUTH_TYPE.NONE,
      headers: {
        ["x-api-key"]: apiKey,
      },
    });
  };

  return {
    upload,
    downloadBackup,
    pushBackup,
  };
};

export default mediaController;
