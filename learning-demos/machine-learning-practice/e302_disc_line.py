import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC

class1 = np.array([[2, 3], [3, 3], [3, 4], [5, 8], [7, 7]])  # Triangles
class2 = np.array([[5, 4], [6, 5], [7, 4], [7, 5], [9, 4], [8, 2]])  # Circles
X = np.vstack([class1, class2])
y = np.concatenate([np.zeros(len(class1)), np.ones(len(class2))])

svm = SVC(kernel="linear", C=1.0)
svm.fit(X, y)

plt.figure(figsize=(8, 8))
plt.scatter(
    class1[:, 0], class1[:, 1], color="blue", marker="^", label="Class 1 (Triangles)"
)
plt.scatter(
    class2[:, 0], class2[:, 1], color="red", marker="o", label="Class 2 (Circles)"
)

x_values = np.linspace(min(X[:, 0]), max(X[:, 0]), 100)
y_values = -(svm.coef_[0, 0] * x_values + svm.intercept_[0]) / svm.coef_[0, 1]

plt.plot(x_values, y_values, color="green", label="SVM Line")
plt.title("Best Discriminant Line")
plt.grid(True)
plt.legend()
plt.show()
