import numpy as np
from scipy.optimize import minimize


# Hàm cần tối ưu hóa: T(x, y) = 6xy (dấu âm vì chúng ta sẽ tìm cực đại bằng cách cực tiểu hóa -T)
def objective(vars):
    x, y = vars
    return -6 * x * y  # Đổi dấu để dùng minimize


# Ràng buộc: x^2 + y^2 = 8
def constraint(vars):
    x, y = vars
    return x**2 + y**2 - 8


# Điều kiện ban đầu
initial_guess = [1, 1]

# Định nghĩa ràng buộc dưới dạng dictionary
constraints = {"type": "eq", "fun": constraint}

# Tối ưu hóa
result = minimize(objective, initial_guess, constraints=constraints)

# Lấy giá trị tối ưu
x_opt, y_opt = result.x
max_temp = -result.fun  # Đổi dấu lại để lấy cực đại

# Xuất kết quả
print(f"Điểm có nhiệt độ cao nhất: x = {x_opt:.2f}, y = {y_opt:.2f}")
print(f"Nhiệt độ cao nhất: T = {max_temp:.2f}")
