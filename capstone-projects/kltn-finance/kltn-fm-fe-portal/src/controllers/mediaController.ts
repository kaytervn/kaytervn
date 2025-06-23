import { API_URL, AUTH_TYPE, METHOD } from "../services/constant.ts";

export const mediaController = (fetchApi: any) => {
  const upload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return fetchApi({
      apiUrl: API_URL.MEDIA_API,
      endpoint: "/v1/media/upload",
      method: METHOD.POST,
      payload: formData,
      authType: AUTH_TYPE.NONE,
    });
  };

  return {
    upload,
  };
};

export default mediaController;
