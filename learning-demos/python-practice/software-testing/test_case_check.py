import random

min = 1
max = 5

while True:
    a, b, c = (
        random.randint(min, max),
        random.randint(min, max),
        random.randint(min, max),
    )

    cons = [
        None,
        a < b + c,
        b < a + c,
        c < a + b,
        a * a == b * b + c * c,
        b * b == a * a + c * c,
        c * c == a * a + b * b,
        a == b,
        b == c,
        a == b,
        a == c,
        b == c,
        a * a > b * b + c * c,
        b * b > a * a + c * c,
        c * c > a * a + b * b,
    ]

    result = cons[1] and cons[2] and not cons[3]

    if result:
        print(f"a: {a}, b: {b}, c: {c}")
        break
