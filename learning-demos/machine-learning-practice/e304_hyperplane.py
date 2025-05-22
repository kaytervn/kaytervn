import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC
import math


def calculate_hyperplane_equation(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    a = y2 - y1
    b = x1 - x2
    c = -(a * x1 + b * y1)
    gcd_val = math.gcd(math.gcd(abs(a), abs(b)), abs(c))
    a /= gcd_val
    b /= gcd_val
    c /= gcd_val
    return a, b, c


def calculate_margin(w):
    return 2 / np.linalg.norm(w)


def calculate_distance_to_hyperplane(point, a, b, c):
    x, y = point
    return abs(a * x + b * y + c) / np.sqrt(a**2 + b**2)


# Input data
h1_p1 = (2, 8)
h1_p2 = (4, 4)
h2_p1 = (2, 0)
h2_p2 = (5, 5)
class1_points = np.array([[0.5, 8], [1, 1], [1, 7], [2.5, 2.5], [2, 4], [2, 6], [3, 4]])
class2_points = np.array([[6, 2], [7, 3], [7, 6], [8, 4], [8.5, 2.5], [9, 4.5]])

X = np.concatenate((class1_points, class2_points))
y = np.concatenate((np.ones(len(class1_points)), -1 * np.ones(len(class2_points))))

svm_model = SVC(kernel="linear", C=1000)
svm_model.fit(X, y)

w = svm_model.coef_[0]
b = svm_model.intercept_[0]

h1_a, h1_b, h1_c = calculate_hyperplane_equation(h1_p1, h1_p2)
h2_a, h2_b, h2_c = calculate_hyperplane_equation(h2_p1, h2_p2)

print("(a) Hyperplane Equations:")
print(f"Hyperplane 1: {h1_a:.2f}x + {h1_b:.2f}y + {h1_c:.2f} = 0")
print(f"Hyperplane 2: {h2_a:.2f}x + {h2_b:.2f}y + {h2_c:.2f} = 0")

support_vectors = svm_model.support_vectors_
print("\n(b) Support Vectors:")
print(support_vectors)

margin_h1 = calculate_margin(np.array([h1_a, h1_b]))
margin_h2 = calculate_margin(np.array([h2_a, h2_b]))
print("\n(c) Margins:")
print(f"Hyperplane 1: {margin_h1:.2f}")
print(f"Hyperplane 2: {margin_h2:.2f}")
if margin_h1 > margin_h2:
    print("Hyperplane 1 has a larger margin.")
else:
    print("Hyperplane 2 has a larger margin.")

print("\n(d) Best Separating Hyperplane:")
print(f"The optimal hyperplane is: {w[0]:.2f}x + {w[1]:.2f}y + {b:.2f} = 0")
margin = 2 / np.linalg.norm(w)
print(f"Margin: {margin:.2f}")

plt.figure(figsize=(8, 6))
plt.scatter(
    class1_points[:, 0], class1_points[:, 1], label="Class 1 (Triangles)", marker="^"
)
plt.scatter(
    class2_points[:, 0], class2_points[:, 1], label="Class 2 (Circles)", marker="o"
)
plt.scatter(
    support_vectors[:, 0],
    support_vectors[:, 1],
    label="Support Vectors",
    marker="s",
    s=100,
    facecolors="none",
    edgecolors="purple",
)

x = np.linspace(0, 10, 100)
decision_boundary = -(w[0] * x + b) / w[1]
margin_boundary1 = -(w[0] * x + b - 1) / w[1]
margin_boundary2 = -(w[0] * x + b + 1) / w[1]

x_h1 = np.linspace(0, 10, 100)
y_h1 = -(h1_a * x_h1 + h1_c) / h1_b
x_h2 = np.linspace(0, 10, 100)
y_h2 = -(h2_a * x_h2 + h2_c) / h2_b

plt.plot(x_h1, y_h1, label="Hyperplane h1", color="blue", linestyle="-")
plt.plot(x_h2, y_h2, label="Hyperplane h2", color="red", linestyle="-")

plt.plot(x, decision_boundary, "g-", label="Optimal Hyperplane")
plt.plot(x, margin_boundary1, "k--", label="Margin Boundary 1")
plt.plot(x, margin_boundary2, "k--", label="Margin Boundary 2")

plt.xlabel("X")
plt.ylabel("Y")
plt.title("Linear SVM")
plt.legend()
plt.grid(True)
plt.show()
