const fs = require("fs");

const groupIds = [
  8313233078190080, 8340553184772096, 8340553193979904, 8340553202597888,
  8340553210658816, 8340553219014656, 8340553227370496, 8340553237299200,
  8340553245392896, 8340553253158912, 8340553262071808,
];

const departmentIds = [
  8313312919322624, 8313313662042112, 8340578546089984, 8340578554576896,
  8340578562670592, 8340578571780096, 8340578580365312, 8340578598158336,
  8340578606645248, 8340578615263232, 8340578623782912, 8340578633121792,
  8340578641412096, 8340578649997312, 8340578658746368, 8340578667298816,
  8340578675720192, 8340578684731392, 8340578693873664, 8340578702163968,
  8340578710978560, 8340578718842880, 8340578727460864, 8340578735357952,
  8340578743812096, 8340578752724992, 8340578760163328, 8340578769272832,
  8340578777333760, 8340578785820672, 8340578793914368, 8340578804301824,
  8340578822356992, 8340578831925248, 8340578841788416, 8340578850406400,
  8340578858926080, 8340578867871744, 8340578877571072, 8340578887172096,
  8340578898051072, 8340578906996736, 8340578924888064, 8340578933276672,
  8340578942746624, 8340578951495680, 8340578960441344, 8340578970796032,
  8340578979020800, 8340578987114496, 8340578995240960,
];

const addresses = [
  "123 Đường Lê Lợi, Quận 1, TP.HCM",
  "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
  "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
  "321 Đường Võ Văn Kiệt, Quận 5, TP.HCM",
  "654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
  "987 Đường Phạm Văn Đồng, Quận Thủ Đức, TP.HCM",
  "159 Đường Trường Chinh, Quận Tân Bình, TP.HCM",
  "753 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
  "951 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
  "357 Đường Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM",
  "258 Đường Lý Thường Kiệt, Quận 11, TP.HCM",
  "852 Đường Tô Hiến Thành, Quận 10, TP.HCM",
  "147 Đường Lê Văn Sỹ, Quận 3, TP.HCM",
  "369 Đường Bạch Đằng, Quận Bình Thạnh, TP.HCM",
  "741 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
  "258 Đường Quang Trung, Quận Gò Vấp, TP.HCM",
  "159 Đường Nguyễn Oanh, Quận Gò Vấp, TP.HCM",
  "357 Đường Hoàng Diệu, Quận 4, TP.HCM",
  "456 Đường Kha Vạn Cân, Quận Thủ Đức, TP.HCM",
  "852 Đường Hồng Bàng, Quận 6, TP.HCM",
  "951 Đường Âu Cơ, Quận Tân Phú, TP.HCM",
  "753 Đường Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM",
  "321 Đường Lạc Long Quân, Quận 11, TP.HCM",
  "654 Đường Phạm Ngũ Lão, Quận 1, TP.HCM",
  "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
  "123 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM",
  "456 Đường Lý Tự Trọng, Quận 1, TP.HCM",
  "987 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM",
  "159 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM",
  "753 Đường Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM",
  "951 Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM",
  "357 Đường Nguyễn Duy Trinh, Quận 2, TP.HCM",
  "258 Đường Trường Sa, Quận 3, TP.HCM",
  "852 Đường Hoàng Sa, Quận 3, TP.HCM",
  "147 Đường Đinh Bộ Lĩnh, Quận Bình Thạnh, TP.HCM",
  "369 Đường Phan Văn Trị, Quận Gò Vấp, TP.HCM",
  "741 Đường Dương Bá Trạc, Quận 8, TP.HCM",
  "258 Đường Nguyễn Sơn, Quận Tân Phú, TP.HCM",
  "159 Đường Bình Giã, Quận Tân Bình, TP.HCM",
  "357 Đường Võ Thị Sáu, Quận 3, TP.HCM",
  "456 Đường Lương Định Của, Quận 2, TP.HCM",
  "852 Đường Đỗ Xuân Hợp, Quận 9, TP.HCM",
  "951 Đường Lê Đức Thọ, Quận Gò Vấp, TP.HCM",
  "753 Đường Nguyễn Xiển, Quận 9, TP.HCM",
  "321 Đường Bùi Viện, Quận 1, TP.HCM",
  "654 Đường Trịnh Đình Trọng, Quận Tân Phú, TP.HCM",
  "789 Đường Đoàn Văn Bơ, Quận 4, TP.HCM",
  "123 Đường Tân Kỳ Tân Quý, Quận Bình Tân, TP.HCM",
  "456 Đường Bình Long, Quận Tân Phú, TP.HCM",
  "987 Đường Huỳnh Tấn Phát, Quận 7, TP.HCM",
];

const fullNames = [
  "Nguyễn Văn An",
  "Trần Thị Bích",
  "Lê Hoàng Nam",
  "Phạm Minh Tuấn",
  "Đặng Thị Hạnh",
  "Hoàng Văn Bình",
  "Bùi Thị Thanh",
  "Ngô Đức Duy",
  "Vũ Hồng Nhung",
  "Đinh Quang Huy",
  "Trần Văn Hiếu",
  "Phạm Thị Mai",
  "Lê Quang Đạt",
  "Nguyễn Thị Hương",
  "Trần Đức Phát",
  "Đặng Văn Hòa",
  "Bùi Minh Tâm",
  "Hoàng Thị Vân",
  "Ngô Xuân Trường",
  "Vũ Thị Thu",
  "Đinh Hoàng Phúc",
  "Nguyễn Thanh Tùng",
  "Lê Minh Khoa",
  "Trần Hữu Nghĩa",
  "Phạm Văn Dũng",
  "Hoàng Bảo Châu",
  "Nguyễn Hải Yến",
  "Bùi Quốc Toàn",
  "Ngô Hữu Phước",
  "Vũ Thị Linh",
  "Đinh Văn Lộc",
  "Trần Thị Ngọc",
  "Lê Hữu Thắng",
  "Nguyễn Đình Nam",
  "Phạm Văn Phương",
  "Hoàng Minh Khôi",
  "Bùi Thị Tuyết",
  "Ngô Thanh Sơn",
  "Vũ Hữu Quang",
  "Đinh Đức Anh",
  "Trần Thị Trang",
  "Lê Bảo Ngọc",
  "Nguyễn Văn Tài",
  "Phạm Quang Hải",
  "Hoàng Thị Kim",
  "Bùi Hữu Tâm",
  "Ngô Thị Hoa",
  "Vũ Minh Anh",
  "Đinh Hoàng Sơn",
  "Trần Văn Tiến",
];

const usernames = [
  "nguyenvanan67",
  "tranthibich66",
  "lehoangnam63",
  "phamminhtuan74",
  "dangthihanh31",
  "hoangvanbinh16",
  "buithithanh55",
  "ngoducduy27",
  "vuhongnhung88",
  "dinhquanghuy69",
  "tranvanhieu39",
  "phamthimai43",
  "lequangdat27",
  "nguyenthihuong54",
  "tranducphat20",
  "dangvanhoa95",
  "buiminhtam92",
  "hoangthivan27",
  "ngoxuantruong31",
  "vuthithu80",
  "dinhhoangphuc81",
  "nguyenthanhtung41",
  "leminhkhoa17",
  "tranhuunghia58",
  "phamvandung57",
  "hoangbaochau65",
  "nguyenhaiyen20",
  "buiquoctoan13",
  "ngohuuphuoc83",
  "vuthilinh24",
  "dinhvanloc15",
  "tranthingoc96",
  "lehuuthang16",
  "nguyenđinhnam71",
  "phamvanphuong36",
  "hoangminhkhoi96",
  "buithituyet82",
  "ngothanhson17",
  "vuhuuquang58",
  "đinhđucanh21",
  "tranthitrang55",
  "lebaongoc94",
  "nguyenvantai27",
  "phamquanghai34",
  "hoangthikim55",
  "buihuutam78",
  "ngothihoa48",
  "vuminhanh68",
  "dinhhoangson19",
  "tranvantien74",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function generateRandomDate() {
  const randomPastYear = getRandomInt(1960, 2000);
  const randomMonth = getRandomInt(1, 12).toString().padStart(2, "0");
  const randomDay = getRandomInt(1, 28).toString().padStart(2, "0");
  const randomHour = getRandomInt(0, 23).toString().padStart(2, "0");
  const randomMinute = getRandomInt(0, 59).toString().padStart(2, "0");
  const randomSecond = getRandomInt(0, 59).toString().padStart(2, "0");
  return `${randomDay}/${randomMonth}/${randomPastYear} ${randomHour}:${randomMinute}:${randomSecond}`;
}

function generateRandomPhone() {
  return `09${getRandomInt(10000000, 99999999)}`;
}

function generateRandomEmail(fullName) {
  const nameParts = fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ");
  return `${nameParts.join("")}${getRandomInt(100, 999)}@example.com`;
}

function generateEmployeeData() {
  return fullNames.map((fullName) => ({
    address: getRandomElement(addresses),
    birthDate: generateRandomDate(),
    departmentId: getRandomElement(departmentIds),
    email: generateRandomEmail(fullName),
    fullName: fullName,
    groupId: getRandomElement(groupIds),
    password: "123456",
    phone: generateRandomPhone(),
    status: getRandomInt(-1, 1),
    username: getRandomElement(usernames),
  }));
}

function jsonToCsv(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function saveToCsv(fileName) {
  const employeeData = generateEmployeeData();
  const csvContent = jsonToCsv(employeeData);
  fs.writeFileSync(fileName, csvContent, "utf8");
  console.log(`File CSV đã được tạo: ${fileName}`);
}

const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `employees_${timestamp}.csv`;
saveToCsv(fileName);
