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

const serviceGroupIds = [
  8321753888063488, 8321754700513280, 8340762470875136, 8340762477821952,
  8340762485981184, 8340762492895232, 8340762498891776, 8340762506133504,
  8340762512359424, 8340762518454272, 8340762524549120, 8340762531299328,
  8340762537721856, 8340762545553408, 8340762554007552, 8340762561609728,
  8340762568523776, 8340762575437824, 8340762581303296, 8340762588643328,
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
      result.push({ accountId, serviceGroupId: groupId });
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

const pairs = generateAccountGroupPairs(accountIds, serviceGroupIds, 0.7);
const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
const fileName = `service_permission_${timestamp}.csv`;
saveToCsv(fileName, pairs);
