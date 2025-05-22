import numpy as np
from sklearn.svm import SVC

# Bước 1: Định nghĩa tập dữ liệu
X = np.array([[1], [2], [3.5], [4], [5]])  # Dữ liệu đầu vào
y = np.array([-1, -1, -1, 1, 1])  # Nhãn

# Bước 2: Huấn luyện mô hình SVM tuyến tính
model = SVC(kernel="linear", C=1e5)  # Sử dụng kernel tuyến tính
model.fit(X, y)

# Bước 3: Trích xuất tham số w và b
w = model.coef_[0][0]  # Trọng số w
b = model.intercept_[0]  # Hệ số b

# Hiển thị kết quả
print(f"w = {w}")
print(f"b = {b}")
