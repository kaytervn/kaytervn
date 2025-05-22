const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const min = 1;
const max = 5;

while (true) {
  const a = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  const c = getRandomInt(min, max);

  const cons = [
    null,
    a < b + c,
    b < a + c,
    c < a + b,
    a * a == b * b + c * c,
    b * b == a * a + c * c,
    c * c == a * a + b * b,
    a == b,
    b == c,
    a == c,
    a == c,
    b == c,
    a * a > b * b + c * c,
    b * b > a * a + c * c,
    c * c > a * a + b * b,
  ];

  const result = cons[1] && cons[2] && !cons[3];

  if (result) {
    console.log(`a: ${a}, b: ${b}, c: ${c}`);
    break;
  }
}
