const EmailPattern =
  /^(?!.*[.]{2,})[a-zA-Z0-9.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PhonePattern = /^0[1235789][0-9]{8}$/;

const ZALO_UTE_PORTAL_ACCESS_TOKEN = "zalo-ute-portal-access-token";

const remoteUrl = "https://zalo-ute-api.onrender.com";

export { EmailPattern, PhonePattern, remoteUrl, ZALO_UTE_PORTAL_ACCESS_TOKEN };
