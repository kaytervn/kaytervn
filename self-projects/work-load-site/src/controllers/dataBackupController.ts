import { AUTH_TYPE, ENV, METHOD } from "../types/constant";

export const dataBackupController = (fetchApi: any) => {
  const download = () =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: `/v1/data-backup/download`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const upload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: `/v1/data-backup/upload`,
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload: formData,
    });
  };

  return { upload, download };
};
