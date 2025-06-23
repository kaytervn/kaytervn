const fs = require("fs");

const accountIds = [
  8313653263695872, 8320740878581760, 8340623243018240, 8340623268478976,
  8340623292366848, 8340623315599360, 8340623342403584, 8340623382085632,
  8340623409840128, 8340623438053376, 8340623473246208, 8340623495036928,
  8340623523217408, 8340623553691648, 8340623575252992, 8340623595995136,
  8340623616966656, 8340623647571968, 8340623681912832, 8340623704227840,
  8340623736209408, 8340623760031744, 8340623786475520, 8340623821406208,
  8340623848865792, 8340623874719744,
];

const notificationGroupIds = [
  8324180885700608, 8330222439464960, 8340929654292480, 8340929662943232,
  8340929669758976, 8340929676410880, 8340929684668416, 8340929691910144,
  8340929699086336, 8340929707114496, 8340929714356224, 8340929722613760,
  8340929729986560, 8340929738145792, 8340929745813504, 8340929752596480,
  8340929758068736, 8340929764851712, 8340929770717184, 8340929776844800,
  8340929783988224, 8340929802403840, 8340929821704192, 8340929841594368,
  8340929856274432, 8340929864040448, 8340929873674240, 8340929883504640,
  8340929890844672, 8340929897922560, 8340929905360896, 8340929913126912,
  8340929919320064, 8340929925971968, 8340929932558336, 8340929939865600,
  8340929945403392, 8340929951956992, 8340929958608896, 8340929964933120,
  8340929970831360, 8340929977417728, 8340929985740800, 8340929993768960,
  8340930001436672, 8340930008121344, 8340930015395840, 8340930022965248,
];

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function generateAccountGroupPairs(accountIds, groupIds, ratio = 0.7) {
  const result = [];

  accountIds.forEach((accountId) => {
    const shuffled = shuffleArray(groupIds);
    const groupCount = Math.floor(groupIds.length * ratio);
    const selected = shuffled.slice(0, groupCount);

    selected.forEach((groupId) => {
      result.push({ accountId, notificationGroupId: groupId });
    });
  });

  return result;
}

function jsonToCsv(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function saveToCsv(fileName, data) {
  const csvContent = jsonToCsv(data);
  fs.writeFileSync(fileName, csvContent, "utf8");
  console.log(`File CSV đã được tạo: ${fileName}`);
}

const pairs = generateAccountGroupPairs(accountIds, notificationGroupIds, 0.7);
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `user_group_notification_${timestamp}.csv`;
saveToCsv(fileName, pairs);
