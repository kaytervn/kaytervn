import numpy as np
from sklearn.svm import SVC

# Dữ liệu từ bảng
X = np.array([[7, 4], [2, 2], [4, 5]])
y = np.array([1, -1, 1])  # Nhãn +1 hoặc -1

# Khởi tạo và huấn luyện mô hình SVM với kernel tuyến tính
svm = SVC(kernel="linear", C=1e5)  # Sử dụng giá trị C lớn để hạn chế soft margin
svm.fit(X, y)

# Lấy các tham số của hyperplane
w = svm.coef_[0]  # Trọng số w1, w2
b = svm.intercept_[0]  # Hệ số b

# Làm tròn kết quả
w1, w2 = round(w[0], 1), round(w[1], 1)
b = round(b, 1)

# In kết quả
print(f"w1: {w1}, w2: {w2}, b: {b}")
