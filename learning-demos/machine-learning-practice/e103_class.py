import numpy as np

# Thông tin bài toán
mu1 = np.array([1, 3])  # Trung bình lớp C1
mu2 = np.array([5, 5])  # Trung bình lớp C2

Sigma1 = np.array([[5, 3], [3, 2]])  # Ma trận hiệp phương sai lớp C1
Sigma2 = np.array([[2, 0], [0, 1]])  # Ma trận hiệp phương sai lớp C2

x = np.array([3, 4])  # Điểm cần phân loại
P_C1 = 0.5  # Xác suất tiên nghiệm của C1
P_C2 = 0.5  # Xác suất tiên nghiệm của C2


# Hàm tính định thức và nghịch đảo ma trận 2x2
def inverse_and_det(matrix):
    det = np.linalg.det(matrix)
    inv = np.linalg.inv(matrix)
    return det, inv


# Hàm tính xác suất hậu nghiệm P(x|Ci)
def multivariate_gaussian(x, mu, Sigma):
    det, inv = inverse_and_det(Sigma)
    d = len(mu)
    diff = x - mu
    exponent = -0.5 * np.dot(diff.T, np.dot(inv, diff))
    coeff = 1 / (np.sqrt((2 * np.pi) ** d * det))
    return coeff * np.exp(exponent)


# Tính P(x|C1) và P(x|C2)
P_x_given_C1 = multivariate_gaussian(x, mu1, Sigma1)
P_x_given_C2 = multivariate_gaussian(x, mu2, Sigma2)

# Tính xác suất hậu nghiệm
posterior_C1 = P_x_given_C1 * P_C1
posterior_C2 = P_x_given_C2 * P_C2

# So sánh và phân loại
if posterior_C1 > posterior_C2:
    classification = "C1"
else:
    classification = "C2"

# Kết quả
print(f"P(x|C1) = {P_x_given_C1}")
print(f"P(x|C2) = {P_x_given_C2}")
print(f"Posterior P(C1|x) = {posterior_C1}")
print(f"Posterior P(C2|x) = {posterior_C2}")
print(f"The point {x} belongs to class: {classification}")
