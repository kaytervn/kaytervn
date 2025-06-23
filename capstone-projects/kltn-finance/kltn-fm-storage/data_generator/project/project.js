const fs = require("fs");

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
  8324077208731648, 8325175486775296, 8340663106961408, 8340663200251904,
  8340663216766976, 8340663244849152, 8340663252090880, 8340663323295744,
  8340663346921472, 8340663369334784, 8340663377100800, 8340663384145920,
  8340663397580800, 8340663619780608, 8340663670079488, 8340663869964288,
  8340663924195328, 8340664055332864, 8340664250335232, 8340664383832064,
  8340664407425024, 8340664511070208, 8340664658886656, 8340664706596864,
  8340665038143488, 8340665415008256, 8340665509904384, 8340665544507392,
  8340665557811200, 8340665576226816, 8340665614073856, 8340665620791296,
  8340665627475968, 8340665776799744, 8340665783779328, 8340665802063872,
  8340665810714624, 8340665824935936, 8340665875300352, 8340665889947648,
  8340665954500608, 8340665962692608,
];

const names = [
  "Hệ thống quản lý nhân sự",
  "Ứng dụng đặt vé xe",
  "Trang thương mại điện tử",
  "Phần mềm quản lý kho",
  "Ứng dụng học trực tuyến",
  "Hệ thống CRM",
  "Phần mềm quản lý bệnh viện",
  "Ứng dụng giao đồ ăn",
  "Hệ thống quản lý tài liệu",
  "Ứng dụng theo dõi tài chính",
  "Nền tảng tuyển dụng",
  "Hệ thống e-learning",
  "Ứng dụng quản lý công việc",
  "Hệ thống đặt phòng khách sạn",
  "Ứng dụng theo dõi sức khỏe",
  "Phần mềm quản lý nhà hàng",
  "Ứng dụng giao dịch bất động sản",
  "Hệ thống chấm công điện tử",
  "Ứng dụng đọc sách trực tuyến",
  "Phần mềm kế toán doanh nghiệp",
  "Hệ thống quản lý học sinh",
  "Ứng dụng đặt lịch khám bệnh",
  "Phần mềm quản lý chuỗi cung ứng",
  "Nền tảng thương mại B2B",
  "Ứng dụng streaming video",
  "Hệ thống quản lý vận tải",
  "Ứng dụng quản lý sự kiện",
  "Phần mềm thiết kế đồ họa",
  "Ứng dụng theo dõi chi tiêu",
  "Hệ thống đăng ký học trực tuyến",
  "Ứng dụng đặt đồ ăn nhanh",
  "Phần mềm hỗ trợ làm việc từ xa",
  "Ứng dụng theo dõi đầu tư",
  "Hệ thống chatbot hỗ trợ khách hàng",
  "Ứng dụng dịch thuật",
  "Hệ thống báo cáo doanh nghiệp",
  "Ứng dụng tìm kiếm việc làm",
  "Phần mềm kiểm soát ra vào",
  "Hệ thống quản lý bảo trì",
  "Ứng dụng đặt lịch spa",
  "Hệ thống quản lý khách hàng",
  "Phần mềm lập hóa đơn",
  "Ứng dụng kiểm tra chất lượng sản phẩm",
  "Hệ thống quản lý nhà thuốc",
  "Ứng dụng đào tạo nội bộ",
  "Hệ thống hỗ trợ bán hàng",
  "Ứng dụng nhắc nhở công việc",
  "Hệ thống phân tích dữ liệu",
  "Phần mềm quản lý tài sản",
  "Ứng dụng chia sẻ tài liệu",
];

const notes = [
  "Ứng dụng giúp theo dõi lương thưởng và chấm công",
  "Cho phép người dùng đặt vé xe khách trực tuyến",
  "Nền tảng bán hàng đa kênh với tính năng giỏ hàng",
  "Giúp kiểm soát hàng tồn kho và đơn hàng xuất nhập",
  "Nền tảng cung cấp khóa học theo chủ đề",
  "Quản lý quan hệ khách hàng và chăm sóc khách hàng",
  "Hỗ trợ quản lý lịch khám và hồ sơ bệnh nhân",
  "Nền tảng kết nối nhà hàng và tài xế giao hàng",
  "Lưu trữ và chia sẻ tài liệu nội bộ",
  "Công cụ giúp cá nhân kiểm soát chi tiêu",
  "Kết nối nhà tuyển dụng và ứng viên",
  "Hỗ trợ giảng dạy và học tập trực tuyến",
  "Công cụ hỗ trợ lập kế hoạch và theo dõi tiến độ",
  "Cho phép người dùng tìm kiếm và đặt phòng dễ dàng",
  "Giúp người dùng kiểm soát tình trạng sức khỏe cá nhân",
  "Công cụ hỗ trợ điều hành hoạt động nhà hàng",
  "Nền tảng kết nối người mua và người bán nhà đất",
  "Ghi nhận thời gian làm việc tự động",
  "Kho sách số với nhiều thể loại đa dạng",
  "Hỗ trợ quản lý tài chính và báo cáo kế toán",
  "Theo dõi kết quả học tập và hoạt động ngoại khóa",
  "Cho phép bệnh nhân đặt lịch hẹn với bác sĩ",
  "Giúp theo dõi và tối ưu hóa chuỗi cung ứng",
  "Kết nối doanh nghiệp với nhà cung cấp",
  "Cho phép xem video trực tuyến theo yêu cầu",
  "Theo dõi lộ trình và tình trạng phương tiện",
  "Công cụ giúp tổ chức và quảng bá sự kiện",
  "Hỗ trợ tạo và chỉnh sửa hình ảnh chuyên nghiệp",
  "Giúp người dùng lập kế hoạch tài chính cá nhân",
  "Cho phép sinh viên chọn và đăng ký khóa học",
  "Giao đồ ăn tận nơi từ các chuỗi cửa hàng",
  "Công cụ giúp cộng tác nhóm hiệu quả",
  "Giúp người dùng quản lý danh mục đầu tư cá nhân",
  "Trả lời tự động các câu hỏi thường gặp",
  "Công cụ hỗ trợ dịch văn bản nhanh chóng",
  "Cung cấp thông tin kinh doanh trực quan",
  "Kết nối ứng viên với cơ hội việc làm phù hợp",
  "Hỗ trợ xác thực danh tính và quản lý truy cập",
  "Giúp theo dõi và lập kế hoạch bảo trì thiết bị",
  "Cho phép khách hàng chọn dịch vụ và đặt lịch hẹn",
  "Hỗ trợ theo dõi và phân tích dữ liệu khách hàng",
  "Tạo và gửi hóa đơn điện tử dễ dàng",
  "Đánh giá và báo cáo chất lượng sản phẩm",
  "Theo dõi đơn thuốc và kho dược phẩm",
  "Hỗ trợ đào tạo nhân viên trong doanh nghiệp",
  "Công cụ giúp doanh nghiệp tối ưu hóa doanh số",
  "Giúp người dùng quản lý danh sách công việc",
  "Hỗ trợ doanh nghiệp ra quyết định dựa trên dữ liệu",
  "Theo dõi và đánh giá giá trị tài sản doanh nghiệp",
  "Cho phép người dùng lưu trữ và trao đổi tệp",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function genProjectName() {
  const prefixes = [
    "Nền tảng",
    "Hệ thống",
    "Giải pháp",
    "Ứng dụng",
    "Phần mềm",
    "Công cụ",
    "Dịch vụ",
    "Trình quản lý",
  ];

  const purposes = [
    "quản lý nhân sự",
    "theo dõi tài chính",
    "quản lý học sinh",
    "giám sát thiết bị",
    "hỗ trợ khách hàng",
    "đặt lịch khám",
    "thống kê bán hàng",
    "quản lý đơn hàng",
    "phân tích dữ liệu",
    "bảo mật hệ thống",
    "kết nối người dùng",
    "theo dõi vận hành",
    "quản lý sự kiện",
    "lưu trữ tài liệu",
  ];

  const suffixes = [
    "",
    "AI hỗ trợ",
    "tự động",
    "đám mây",
    "theo thời gian thực",
    "cho doanh nghiệp vừa và nhỏ",
    "dành cho giáo dục",
    "trên đa nền tảng",
    "thông minh",
    "chuẩn hóa ISO",
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const purpose = purposes[Math.floor(Math.random() * purposes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${purpose} ${suffix}`.trim();
}

function generateRandomData(count) {
  const set = new Set();
  while (set.size < count) {
    const name = genProjectName();
    set.add({
      name,
      note: getRandomElement(notes),
      tagId: getRandomElement(tagIds),
      organizationId: getRandomElement(organizationIds),
    });
  }
  return [...set];
}

function jsonToCsv(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function saveToCsv(count, fileName) {
  const employeeData = generateRandomData(count);
  const csvContent = jsonToCsv(employeeData);
  fs.writeFileSync(fileName, csvContent, "utf8");
  console.log(`File CSV đã được tạo: ${fileName}`);
}

const count = 500;
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `project_${timestamp}.csv`;
saveToCsv(count, fileName);
