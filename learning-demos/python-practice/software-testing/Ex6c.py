import random


# Hàm kiểm tra và xác định loại tam giác
def TamGiac(a, b, c):
    if a < b + c and b < a + c and c < a + b:
        if a * a == b * b + c * c or b * b == a * a + c * c or c * c == a * a + b * b:
            return "Day la tam giac vuong"
        elif a == b and b == c:
            return "Day la tam giac deu"
        elif a == b or a == c or b == c:
            return "Day la tam giac can"
        elif a * a > b * b + c * c or b * b > a * a + c * c or c * c > a * a + b * b:
            return "Day la tam giac tu"
        else:
            return "Day la tam giac nhon"
    else:
        return "Ba canh a, b, c khong phai la ba canh cua mot tam giac"


# Hàm tự động sinh test case cho từng loại tam giác
def generate_test_cases():
    test_cases = {}

    # Trường hợp không phải là tam giác
    while True:
        a, b, c = random.randint(1, 10), random.randint(1, 10), random.randint(1, 10)
        if TamGiac(a, b, c) == "Ba canh a, b, c khong phai la ba canh cua mot tam giac":
            test_cases["Not a Triangle"] = (a, b, c)
            break

    # Tam giác vuông
    while True:
        a, b, c = random.randint(1, 10), random.randint(1, 10), random.randint(1, 10)
        if TamGiac(a, b, c) == "Day la tam giac vuong":
            test_cases["Right Triangle"] = (a, b, c)
            break

    # Tam giác đều
    while True:
        a = b = c = random.randint(1, 10)
        if TamGiac(a, b, c) == "Day la tam giac deu":
            test_cases["Equilateral Triangle"] = (a, b, c)
            break

    # Tam giác cân
    while True:
        a = b = random.randint(1, 10)
        c = random.randint(1, 10)
        if a != c and TamGiac(a, b, c) == "Day la tam giac can":
            test_cases["Isosceles Triangle"] = (a, b, c)
            break

    # Tam giác tù
    while True:
        a, b, c = random.randint(5, 20), random.randint(5, 20), random.randint(5, 20)
        if TamGiac(a, b, c) == "Day la tam giac tu":
            test_cases["Obtuse Triangle"] = (a, b, c)
            break

    # Tam giác nhọn
    while True:
        a, b, c = random.randint(1, 10), random.randint(1, 10), random.randint(1, 10)
        if TamGiac(a, b, c) == "Day la tam giac nhon":
            test_cases["Acute Triangle"] = (a, b, c)
            break

    return test_cases


# In các test case sinh tự động
generated_cases = generate_test_cases()
for case_type, (a, b, c) in generated_cases.items():
    print(f"{case_type} -> a={a}, b={b}, c={c} | Expected: {TamGiac(a, b, c)}")
