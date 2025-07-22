/* eslint-disable react-hooks/rules-of-hooks */
import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import { API_HEADER, AUTH_TYPE, ENV, METHOD } from "../types/constant.ts";

export const mediaController = (fetchApi: any) => {
  const { apiKey } = useGlobalContext();

  const upload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return fetchApi({
      apiUrl: ENV.MSA_NODEJS_API_URL,
      endpoint: "/v1/media/upload",
      method: METHOD.POST,
      payload: formData,
      headers: {
        [API_HEADER.X_API_KEY]: apiKey,
      },
    });
  };

  const pushBackup = (file: File) => {
    const formData = new FormData();
    formData.append("zipFile", file, file.name);

    return fetchApi({
      apiUrl: ENV.MSA_NODEJS_API_URL,
      endpoint: "/v1/media/push-backup",
      method: METHOD.POST,
      payload: formData,
      headers: {
        [API_HEADER.X_API_KEY]: apiKey,
      },
    });
  };

  const downloadBackup = () => {
    return fetchApi({
      apiUrl: ENV.MSA_NODEJS_API_URL,
      endpoint: "/v1/media/download-backup",
      method: METHOD.GET,
      headers: {
        [API_HEADER.X_API_KEY]: apiKey,
      },
    });
  };

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return fetchApi({
      apiUrl: ENV.MSA_JAVA_API_URL,
      endpoint: "/v1/file/upload",
      method: METHOD.POST,
      payload: formData,
      authType: AUTH_TYPE.BEARER,
    });
  };

  return {
    pushBackup,
    downloadBackup,
    upload,
    uploadFile,
  };
};
