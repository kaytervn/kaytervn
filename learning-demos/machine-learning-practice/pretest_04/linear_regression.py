import numpy as np
from sklearn.linear_model import LinearRegression

# Bước 1: Định nghĩa dữ liệu
X = np.array([[0], [2], [3]])  # Dữ liệu đầu vào (cột x)
y = np.array([2, 2, 1])  # Nhãn đầu ra (cột y)

# Bước 2: Leave-One-Out Cross-Validation
n = len(X)
errors = []

for i in range(n):
    # Chia tập dữ liệu thành training và testing
    X_train = np.delete(X, i, axis=0)
    y_train = np.delete(y, i)
    X_test = X[i].reshape(1, -1)
    y_test = y[i]

    # Huấn luyện mô hình Linear Regression
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Dự đoán và tính squared error
    y_pred = model.predict(X_test)
    error = (y_test - y_pred[0]) ** 2
    errors.append(error)

# Bước 3: Tính Average Squared Error
average_error = np.mean(errors)

# Hiển thị kết quả dưới dạng phân số
from fractions import Fraction

fraction_error = Fraction(average_error).limit_denominator()

print(f"Average Squared Error = {fraction_error}")
