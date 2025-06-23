const fs = require("fs");

const serviceGroupIds = [
  8321753888063488, 8321754700513280, 8340762470875136, 8340762477821952,
  8340762485981184, 8340762492895232, 8340762498891776, 8340762506133504,
  8340762512359424, 8340762518454272, 8340762524549120, 8340762531299328,
  8340762537721856, 8340762545553408, 8340762554007552, 8340762561609728,
  8340762568523776, 8340762575437824, 8340762581303296, 8340762588643328,
];

const tagIds = [
  8323903810207744, 8323903957041152, 8340663091396608, 8340663098736640,
  8340663135797248, 8340663154868224, 8340663168794624, 8340663183769600,
  8340663230726144, 8340663291969536, 8340663330996224, 8340663565811712,
  8340663640162304, 8340663751770112, 8340663958896640, 8340663968235520,
  8340664166449152, 8340664285593600, 8340664436883456, 8340664446910464,
  8340664454676480, 8340664466112512, 8340664490950656, 8340664603377664,
  8340664621694976, 8340664631558144, 8340664668192768, 8340664756174848,
  8340664847466496, 8340664904450048, 8340664913231872, 8340665319391232,
  8340665348128768, 8340665460817920, 8340665489227776, 8340665503449088,
  8340665524092928, 8340665537462272, 8340665596641280, 8340665603588096,
  8340665635176448, 8340665655590912, 8340665690947584, 8340665744097280,
  8340665754648576, 8340665763135488, 8340665770311680, 8340665843843072,
  8340665919275008, 8340665931530240, 8340665938706432, 8340665986514944,
];

const names = [
  "Dịch vụ lưu trữ đám mây",
  "Bảo mật dữ liệu",
  "Hỗ trợ kỹ thuật 24/7",
  "Phân tích dữ liệu",
  "Tư vấn doanh nghiệp",
  "Đào tạo nhân viên",
  "Dịch vụ kế toán",
  "Phát triển phần mềm",
  "Dịch vụ tiếp thị số",
  "Chăm sóc khách hàng",
  "Dịch vụ SEO",
  "Tư vấn pháp lý",
  "Hỗ trợ IT",
  "Dịch vụ tổng đài ảo",
  "Lưu trữ website",
  "Dịch vụ VPN",
  "Quản lý tài sản số",
  "Bảo trì hệ thống",
  "Hỗ trợ tài chính",
  "Dịch vụ quảng cáo trực tuyến",
  "Phát triển ứng dụng di động",
  "Thiết kế đồ họa",
  "Kiểm tra bảo mật",
  "Dịch vụ email marketing",
  "Dịch vụ sao lưu dữ liệu",
  "Đào tạo kỹ năng mềm",
  "Quản lý nhân sự",
  "Tư vấn đầu tư",
  "Hỗ trợ khách hàng AI",
  "Dịch vụ livestream",
  "Giám sát an ninh",
  "Tích hợp API",
  "Quản lý đơn hàng",
  "Dịch vụ chấm công",
  "Dịch vụ điện toán đám mây",
  "Quản lý tài liệu",
  "Dịch vụ thanh toán trực tuyến",
  "Hệ thống CRM",
  "Hỗ trợ chatbot AI",
  "Dịch vụ bảo hiểm",
  "Dịch vụ thiết kế UX/UI",
  "Quản lý chuỗi cung ứng",
  "Dịch vụ video call",
  "Tích hợp hệ thống",
  "Dịch vụ hosting",
  "Dịch vụ kiểm toán",
  "Dịch vụ kiểm tra hiệu suất",
  "Dịch vụ quản lý sự kiện",
  "Tư vấn xây dựng thương hiệu",
  "Dịch vụ chăm sóc sức khỏe từ xa",
  "Tư vấn chiến lược kinh doanh",
  "Dịch vụ chatbot doanh nghiệp",
  "Dịch vụ quản lý quảng cáo",
  "Dịch vụ bảo mật hệ thống",
  "Quản lý sản phẩm",
  "Tư vấn mở rộng thị trường",
  "Dịch vụ hỗ trợ khách hàng đa kênh",
  "Dịch vụ bán lẻ online",
  "Quản lý hợp đồng",
  "Dịch vụ bảo hành thiết bị",
  "Tư vấn phát triển bền vững",
  "Dịch vụ thương mại điện tử",
  "Dịch vụ quản lý email doanh nghiệp",
  "Phát triển hệ thống AI",
  "Dịch vụ sao lưu hệ thống",
  "Dịch vụ khảo sát thị trường",
  "Tư vấn pháp lý doanh nghiệp",
  "Dịch vụ quản lý kho hàng",
  "Hỗ trợ công nghệ Blockchain",
  "Dịch vụ hỗ trợ server",
  "Dịch vụ chăm sóc khách hàng qua chatbot",
  "Tích hợp thanh toán",
  "Dịch vụ kiểm soát chất lượng",
  "Dịch vụ bảo vệ thương hiệu",
  "Hỗ trợ phần cứng",
  "Dịch vụ giao hàng nhanh",
  "Hệ thống kiểm toán nội bộ",
  "Dịch vụ kiểm soát truy cập",
  "Tư vấn vận hành doanh nghiệp",
  "Dịch vụ kiểm soát an ninh",
  "Dịch vụ đăng ký bản quyền",
  "Dịch vụ phân tích thị trường",
  "Dịch vụ tối ưu hiệu suất hệ thống",
  "Tư vấn vận hành IT",
  "Dịch vụ định danh số",
  "Quản lý hợp đồng điện tử",
  "Dịch vụ lưu trữ tài liệu số",
  "Dịch vụ tư vấn tài chính cá nhân",
  "Dịch vụ kiểm tra tính tương thích phần mềm",
  "Quản lý dữ liệu doanh nghiệp",
  "Hệ thống chấm điểm tín dụng",
  "Dịch vụ hỗ trợ mạng lưới IoT",
  "Tư vấn pháp lý công nghệ",
  "Dịch vụ quản lý tài chính doanh nghiệp",
  "Tư vấn chiến lược tiếp thị",
  "Dịch vụ đào tạo nội bộ",
  "Quản lý quan hệ khách hàng",
];

const descriptions = [
  "Dịch vụ lưu trữ đám mây giúp bạn lưu trữ và truy cập dữ liệu từ mọi nơi.",
  "Giải pháp bảo mật dữ liệu giúp bảo vệ thông tin cá nhân và doanh nghiệp.",
  "Hỗ trợ kỹ thuật 24/7 giúp khách hàng giải quyết vấn đề kịp thời.",
  "Phân tích dữ liệu chuyên sâu giúp bạn ra quyết định dựa trên dữ liệu thực tế.",
  "Tư vấn doanh nghiệp giúp tối ưu chiến lược và tăng trưởng bền vững.",
  "Dịch vụ đào tạo nhân viên giúp nâng cao kỹ năng và hiệu suất làm việc.",
  "Giải pháp kế toán giúp doanh nghiệp quản lý tài chính hiệu quả.",
  "Dịch vụ phát triển phần mềm tùy chỉnh theo nhu cầu doanh nghiệp.",
  "Dịch vụ tiếp thị số giúp tăng cường sự hiện diện trực tuyến của bạn.",
  "Hỗ trợ khách hàng chuyên nghiệp giúp tăng trải nghiệm người dùng.",
  "Tối ưu SEO giúp website của bạn xuất hiện trên kết quả tìm kiếm.",
  "Tư vấn pháp lý giúp doanh nghiệp tuân thủ quy định pháp luật.",
  "Hỗ trợ IT giúp doanh nghiệp duy trì hoạt động hệ thống ổn định.",
  "Dịch vụ tổng đài ảo giúp cải thiện giao tiếp với khách hàng.",
  "Dịch vụ lưu trữ website giúp duy trì tốc độ và độ tin cậy.",
  "Dịch vụ VPN giúp bảo mật kết nối và bảo vệ dữ liệu người dùng.",
  "Quản lý tài sản số giúp theo dõi và bảo vệ tài sản kỹ thuật số.",
  "Dịch vụ bảo trì hệ thống đảm bảo vận hành ổn định.",
  "Hỗ trợ tài chính giúp doanh nghiệp đưa ra quyết định đầu tư chính xác.",
  "Dịch vụ quảng cáo trực tuyến giúp tiếp cận khách hàng tiềm năng.",
  "Phát triển ứng dụng di động giúp doanh nghiệp tiếp cận người dùng dễ dàng.",
  "Thiết kế đồ họa sáng tạo giúp thương hiệu trở nên nổi bật.",
  "Kiểm tra bảo mật giúp ngăn chặn các cuộc tấn công mạng.",
  "Email marketing giúp tiếp cận khách hàng hiệu quả.",
  "Sao lưu dữ liệu giúp đảm bảo an toàn thông tin quan trọng.",
  "Đào tạo kỹ năng mềm giúp nhân viên phát triển toàn diện.",
  "Quản lý nhân sự giúp tối ưu hóa quy trình tuyển dụng và đào tạo.",
  "Tư vấn đầu tư giúp doanh nghiệp ra quyết định tài chính thông minh.",
  "Hỗ trợ khách hàng bằng AI giúp tối ưu trải nghiệm dịch vụ.",
  "Dịch vụ livestream giúp bạn kết nối với khách hàng theo thời gian thực.",
  "Giám sát an ninh giúp bảo vệ doanh nghiệp khỏi các rủi ro.",
  "Tích hợp API giúp đồng bộ dữ liệu và hệ thống.",
  "Dịch vụ chấm công giúp theo dõi thời gian làm việc của nhân viên.",
  "Dịch vụ điện toán đám mây giúp mở rộng tài nguyên linh hoạt.",
  "Quản lý tài liệu giúp lưu trữ và chia sẻ tài liệu hiệu quả.",
  "Hệ thống thanh toán trực tuyến an toàn và tiện lợi.",
  "CRM giúp doanh nghiệp quản lý mối quan hệ khách hàng.",
  "Chatbot AI giúp hỗ trợ khách hàng tự động.",
  "Dịch vụ bảo hiểm giúp bảo vệ tài sản và con người.",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function generateRandomDate(minYear, maxYear) {
  const randomPastYear = getRandomInt(minYear, maxYear);
  const randomMonth = getRandomInt(1, 12).toString().padStart(2, "0");
  const randomDay = getRandomInt(1, 28).toString().padStart(2, "0");
  const randomHour = getRandomInt(0, 23).toString().padStart(2, "0");
  const randomMinute = getRandomInt(0, 59).toString().padStart(2, "0");
  const randomSecond = getRandomInt(0, 59).toString().padStart(2, "0");
  return `${randomDay}/${randomMonth}/${randomPastYear} ${randomHour}:${randomMinute}:${randomSecond}`;
}

function genServiceName() {
  const verbs = [
    "quản lý",
    "theo dõi",
    "tích hợp",
    "phân tích",
    "bảo mật",
    "giám sát",
    "vận hành",
    "lưu trữ",
    "quét",
    "đồng bộ",
  ];

  const domains = [
    "dữ liệu",
    "email",
    "hệ thống",
    "website",
    "thiết bị IoT",
    "camera an ninh",
    "ứng dụng di động",
    "hạ tầng mạng",
    "người dùng",
    "thanh toán",
  ];

  const suffixes = [
    "",
    "đám mây",
    "từ xa",
    "thông minh",
    "do AI hỗ trợ",
    "an toàn cao",
    "đa nền tảng",
    "real-time",
    "với báo cáo chi tiết",
    "tự động",
  ];

  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `Dịch vụ ${verb} ${domain} ${suffix}`.trim();
}

function generateRandomData(count) {
  const set = new Set();
  while (set.size < count) {
    const name = genServiceName();
    set.add({
      description: getRandomElement(descriptions),
      expirationDate: generateRandomDate(2019, 2035),
      kind: getRandomInt(1, 2),
      money: getRandomInt(100000, 100000000),
      name,
      periodKind: getRandomInt(1, 3),
      serviceGroupId: getRandomElement(serviceGroupIds),
      startDate: generateRandomDate(2015, 2018),
      tagId: getRandomElement(tagIds),
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
  const data = generateRandomData(count);
  const csvContent = jsonToCsv(data);
  fs.writeFileSync(fileName, csvContent, "utf8");
  console.log(`File CSV đã được tạo: ${fileName}`);
}

const count = 2000;
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `service_${timestamp}.csv`;
saveToCsv(count, fileName);
