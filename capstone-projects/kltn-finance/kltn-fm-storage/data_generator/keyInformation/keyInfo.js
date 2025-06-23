const fs = require("fs");

const keyInformationGroupIds = [
  8321790129143808, 8321791509430272, 8328055456366592, 8329334069559296,
  8340759516872704, 8340759523655680, 8340759529914368, 8340759537876992,
  8340759553376256, 8340759560192000, 8340759567269888, 8340759573397504,
  8340759580442624, 8340759587684352, 8340759594205184, 8340759600791552,
  8340759607934976, 8340759617110016, 8340759623761920, 8340759630544896,
  8340759636770816, 8340759643914240, 8340759650500608, 8340759657709568,
  8340759677009920, 8340759689166848, 8340759706337280, 8340759730913280,
  8340759738351616, 8340759746674688, 8340759753883648, 8340759761027072,
  8340759767547904, 8340759774232576, 8340759780851712, 8340759787700224,
  8340759797006336, 8340759805231104, 8340759813423104, 8340759820402688,
  8340759826366464, 8340759832788992, 8340759838425088, 8340759844585472,
  8340759851728896, 8340759858806784, 8340759865851904, 8340759874600960,
  8340759882137600, 8340759888691200, 8340759897079808, 8340759903764480,
  8340759909990400, 8340759916380160, 8340759923294208, 8340759930044416,
  8340759936172032, 8340759945052160, 8340759953145856, 8340759959961600,
  8340759966646272, 8340759975395328, 8340759983063040,
];

const organizationIds = [
  8322043802812416, 8322058899488768, 8322059032297472, 8340647124533248,
  8340647133937664, 8340647140720640, 8340647148093440, 8340647155171328,
  8340647163297792, 8340647169720320, 8340647176470528, 8340647183941632,
  8340647190888448, 8340647197507584, 8340647204978688, 8340647213105152,
  8340647220772864, 8340647227817984, 8340647238828032, 8340647248035840,
  8340647257210880, 8340647266287616, 8340647274708992, 8340647282442240,
  8340647291387904, 8340647298859008, 8340647307214848, 8340647315865600,
  8340647323795456, 8340647332937728, 8340647342047232, 8340647351975936,
  8340647358693376, 8340647367311360, 8340647374651392, 8340647382908928,
  8340647393165312, 8340647402930176, 8340647411777536, 8340647419969536,
  8340647428390912, 8340647436779520, 8340647443660800, 8340647451131904,
  8340647461257216, 8340647470170112, 8340647476101120, 8340647483539456,
  8340647491043328, 8340647496515584, 8340647503134720, 8340647509950464,
  8340647519387648,
];

const tagIds = [
  8324067125133312, 8324067477684224, 8340663112826880, 8340663127539712,
  8340663161290752, 8340663175905280, 8340663191437312, 8340663208345600,
  8340663238459392, 8340663258513408, 8340663274012672, 8340663299047424,
  8340663315169280, 8340663493722112, 8340663812194304, 8340663846502400,
  8340663903059968, 8340663946969088, 8340664005361664, 8340664107466752,
  8340664138694656, 8340664151244800, 8340664180310016, 8340664351686656,
  8340664364826624, 8340664532271104, 8340664548425728, 8340664684085248,
  8340664789663744, 8340664810012672, 8340664921227264, 8340665359335424,
  8340665375850496, 8340665390170112, 8340665403670528, 8340665432080384,
  8340665495748608, 8340665550798848, 8340665584025600, 8340665711853568,
  8340665817038848, 8340665830932480, 8340665861472256, 8340665904070656,
  8340665926123520,
];

const names = [
  "Khóa API Hệ Thống",
  "Mã Xác Thực Người Dùng",
  "Token Bảo Mật",
  "Mã Bí Mật Ứng Dụng",
  "Khóa Dịch Vụ",
  "Khóa Quản Trị",
  "Khóa Phiên Làm Việc",
  "Mã Truy Cập API",
  "Chìa Khóa JWT",
  "Khóa Mã Hóa Dữ Liệu",
  "Mã Kết Nối Cơ Sở Dữ Liệu",
  "Khóa Cá Nhân",
  "Khóa Công Khai",
  "Mã Hash Dữ Liệu",
  "Mã OAuth Client",
  "Mật Khẩu Webhook",
  "Khóa Thanh Toán",
  "Mã Bảo Mật Lưu Trữ",
  "Khóa Truy Cập Hệ Thống",
  "Mã Xác Minh Người Dùng",
  "Khóa Máy Chủ SMTP",
  "Mã Kết Nối Firebase",
  "Mật Khẩu Twilio",
  "Chìa Khóa AWS",
  "Mã Google Cloud",
  "Mật Khẩu Azure",
  "Mã API Phân Tích Dữ Liệu",
  "Mật Khẩu SSH Riêng Tư",
  "Chìa Khóa SSH Công Khai",
  "Mã API Giám Sát",
  "Mã Bí Mật Ứng Dụng Staging",
  "Mật Khẩu Triển Khai",
  "Chìa Khóa Cân Bằng Tải",
  "Mã Xác Nhận Miền",
  "Khóa SSL",
  "Mã Hóa VPN",
  "Khóa Xác Minh Blockchain",
  "Chìa Khóa Định Danh",
  "Khóa Bảo Mật Redis",
  "Khóa Xác Thực OAuth",
  "Chìa Khóa Nội Bộ",
  "Khóa API Dịch Vụ Chatbot",
  "Mật Khẩu API Đối Tác",
  "Khóa Mật Khẩu Phụ",
  "Chìa Khóa Bảo Mật Hệ Thống",
  "Khóa API Môi Trường Kiểm Thử",
  "Chìa Khóa Tạm Thời",
  "Khóa API Ứng Dụng Mobile",
  "Mã API Phân Quyền Hệ Thống",
  "Khóa API Định Tuyến",
];

const descriptions = [
  "Dùng để truy cập API hệ thống",
  "Xác thực người dùng qua API",
  "Mã bảo mật ngăn chặn truy cập trái phép",
  "Mã bí mật cho ứng dụng nội bộ",
  "Dùng để kết nối với dịch vụ bên ngoài",
  "Khóa quản trị viên cấp cao",
  "Dùng để xác thực phiên làm việc",
  "Mã truy cập API cấp độ cao",
  "Mã bí mật bảo vệ JWT",
  "Khóa mã hóa dữ liệu người dùng",
  "Mã kết nối đến cơ sở dữ liệu chính",
  "Khóa cá nhân cho giao dịch an toàn",
  "Khóa công khai cho xác minh dữ liệu",
  "Dùng để tạo mã hash bảo mật",
  "Mã OAuth cho ứng dụng web",
  "Mật khẩu bảo mật của Webhook",
  "Khóa thanh toán trên hệ thống",
  "Mật khẩu bảo mật dịch vụ lưu trữ",
  "Khóa truy cập hệ thống nội bộ",
  "Mã xác minh người dùng tự động",
  "Mã kết nối máy chủ SMTP",
  "Dùng để xác thực Firebase API",
  "Mật khẩu API của Twilio",
  "Khóa truy cập AWS",
  "Mã API kết nối Google Cloud",
  "Mật khẩu xác thực trên Azure",
  "API phân tích dữ liệu người dùng",
  "Khóa bảo mật cho SSH riêng tư",
  "Chìa khóa công khai của SSH",
  "API theo dõi hoạt động hệ thống",
  "Mã bí mật của ứng dụng trên môi trường staging",
  "Mật khẩu triển khai ứng dụng",
  "Khóa cân bằng tải mạng",
  "Mã xác nhận quyền sở hữu miền",
  "Khóa SSL mã hóa giao tiếp",
  "Khóa bảo mật mạng VPN",
  "Khóa xác minh giao dịch Blockchain",
  "Khóa định danh người dùng",
  "Khóa bảo mật cho Redis Cache",
  "Dùng để xác thực OAuth trên hệ thống",
  "Chìa khóa bảo mật nội bộ",
  "API dành riêng cho dịch vụ Chatbot",
  "Khóa bảo mật cho API đối tác",
  "Mật khẩu API phụ trợ",
  "Bảo mật hệ thống bằng chìa khóa riêng",
  "API dành cho môi trường kiểm thử",
  "Mật khẩu API tạm thời",
  "Khóa API dành cho ứng dụng di động",
  "Mã API cấp quyền cho hệ thống",
  "Khóa API định tuyến dữ liệu",
];

const systems = [
  "auth",
  "gateway",
  "user",
  "payment",
  "noti",
  "order",
  "admin",
  "client",
  "cli",
  "bot",
  "cron",
  "inventory",
  "report",
  "service",
  "core",
  "api",
];

const environments = [
  "dev",
  "test",
  "staging",
  "prod",
  "beta",
  "alpha",
  "int",
  "uat",
  "qa",
  "",
];
const purposes = [
  "token",
  "access",
  "key",
  "secret",
  "session",
  "id",
  "cert",
  "config",
  "hook",
  "callback",
  "client",
  "server",
];
const suffixes = [
  "",
  "v1",
  "v2",
  "v3",
  () => `v${Math.floor(Math.random() * 5 + 1)}`,
  () => Math.random().toString(36).substring(2, 6),
];

const projectCodes = [
  "hx",
  "nx",
  "pulse",
  "zeta",
  "nova",
  "orbit",
  "alpha",
  "corex",
  "glitch",
  "echo",
];
const tags = [
  "internal",
  "external",
  "shared",
  "private",
  "main",
  "backup",
  "legacy",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function generateRandomPhone() {
  return `09${getRandomInt(10000000, 99999999)}`;
}

function generateRandomString(len) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < len; i++) {
    result += getRandomElement(characters.split(""));
  }

  return result;
}

function generateRandomUrl() {
  const protocols = ["http", "https"];
  const domains = ["com", "net", "org", "io", "dev", "vn"];
  const subdomains = ["www", "app", "blog", "store", "api"];

  const protocol = getRandomElement(protocols);
  const subdomain = getRandomElement(subdomains);
  const domainName = generateRandomString(getRandomInt(5, 10));
  const tld = getRandomElement(domains);
  const path = generateRandomString(getRandomInt(3, 8));

  return `${protocol}://${subdomain}.${domainName}.${tld}/${path}`;
}

function generateAdditionalInformation(kind) {
  let data;
  if (kind == 1) {
    data = {
      username: generateRandomString(20),
      password: generateRandomString(6),
      host: generateRandomUrl(),
      port: getRandomInt(1, 65535),
      privateKey: generateRandomString(128),
    };
  } else {
    data = {
      username: generateRandomString(20),
      password: generateRandomString(6),
      phone: generateRandomPhone(),
    };
  }
  return JSON.stringify(JSON.stringify(data));
}

function getRand(arr) {
  const val = arr[Math.floor(Math.random() * arr.length)];
  return typeof val === "function" ? val() : val;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSampleName() {
  const sys = getRand(systems);
  const env = getRand(environments);
  const purpose = getRand(purposes);
  const suffix = getRand(suffixes);
  const proj = getRand(projectCodes);
  const tag = getRand(tags);

  const formatType = Math.floor(Math.random() * 8);

  switch (formatType) {
    case 0:
      return `${sys}-${purpose}-${env}${suffix ? "-" + suffix : ""}`;
    case 1:
      return `${purpose}_${sys}_${env}`;
    case 2:
      return `${capitalize(sys)} ${capitalize(purpose)} ${env.toUpperCase()}${
        suffix ? " " + suffix : ""
      }`;
    case 3:
      return `${sys}.${purpose}.${env}${suffix ? "." + suffix : ""}`;
    case 4:
      return `${proj}-${sys}-${purpose}-${env}${suffix ? "-" + suffix : ""}`;
    case 5:
      return `${sys}-${env}-${tag}-${purpose}${suffix ? "-" + suffix : ""}`;
    case 6:
      return `${proj}_${purpose}_${tag}_${env}${suffix ? "_" + suffix : ""}`;
    case 7:
      return `${sys}${suffix ? "-" + suffix : ""}`;
    default:
      return `${sys}-${purpose}-${env}`;
  }
}

function generateRandomData(count = 100) {
  const set = new Set();
  while (set.size < count) {
    const name = generateSampleName();
    const kind = getRandomInt(1, 2);
    set.add({
      name,
      kind,
      additionalInformation: generateAdditionalInformation(kind),
      description: getRandomElement(descriptions),
      keyInformationGroupId: getRandomElement(keyInformationGroupIds),
      organizationId: getRandomElement(organizationIds),
      tagId: getRandomElement(tagIds),
    });
  }
  return [...set];
}

function saveToJson(count, fileName) {
  const data = generateRandomData(count);
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf8");
  console.log(`File JSON đã được tạo: ${fileName}`);
}

const count = 2000;
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `key_information_${timestamp}.json`;
saveToJson(count, fileName);
