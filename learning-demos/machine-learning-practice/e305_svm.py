import numpy as np

# Input data
support_vectors = np.array(
    [[4, 2.9], [2.5, 1], [3.5, 4], [2, 2.1]]  # x1  # x4  # x7  # x9
)
y_support = np.array([1, -1, 1, -1])  # Nhãn của các support vectors
alpha_support = np.array(
    [0.414, 0.018, 0.018, 0.414]
)  # Giá trị alpha (chỉ lấy những giá trị alpha khác 0 tương ứng với các support vectors)

# Tính vector trọng số w = sum(alpha_i * y_i * x_i) qua support vectors
w = np.sum(alpha_support[:, None] * y_support[:, None] * support_vectors, axis=0)

# Tính bias b bằng công thức y_i * (w^T * x_i + b) = 1
x1 = support_vectors[0]  # Sử dụng điểm x1 để tính b
y1 = y_support[0]  # Nhãn của x1
b = y1 - np.dot(w, x1)

# Tính khoảng cách của x6 đến hyperplane
x6 = np.array([1.9, 1.9])
h_x6 = np.dot(w, x6) + b
distance_x6 = abs(h_x6) / np.linalg.norm(w)

# Tính khoảng cách biên margin
margin = 1 / np.linalg.norm(w)

# Điểm z cần phân loại
z = np.array([3, 3])
h_z = np.dot(w, z) + b
classification = "Class +1" if h_z > 0 else "Class -1"


print(f"\n(a) Hyperplane h(x) = {w[0]}*x1 + {w[1]}*x2 + ({b})")
print("Vector w:", w)
print("Bias b:", b)
print("\n(b) Distance of x6 from hyperplane:", distance_x6)
print("Margin:", margin)
print(
    "Is x6 within the margin?",
    "TRUE" if distance_x6 < margin else "FALSE",
)
print("\n(c) Value of h(z):", h_z)
print("Classification: ", classification)
