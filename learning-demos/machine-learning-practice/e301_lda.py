import numpy as np
import matplotlib.pyplot as plt


def compute_means(data, labels):
    unique_labels = np.unique(labels)
    means = {}
    for label in unique_labels:
        class_data = data[labels == label]
        means[label] = np.mean(class_data, axis=0)
    return means


def compute_between_class_scatter(mu_plus, mu_minus):
    diff = (mu_plus - mu_minus).reshape(-1, 1)
    return diff @ diff.T


def compute_within_class_scatter(data, labels, means):
    S_matrices = {}
    for label in np.unique(labels):
        class_data = data[labels == label]
        mu = means[label]
        diff = class_data - mu
        S_matrices[label] = diff.T @ diff
    return S_matrices


def find_best_direction(S, mean_diff):
    epsilon = 1e-5
    S_reg = S + epsilon * np.eye(S.shape[0])
    try:
        w = np.linalg.solve(S_reg, mean_diff)
        w = w / np.linalg.norm(w)
        return w
    except np.linalg.LinAlgError:
        print("Warning: Singular matrix encountered.  Results may be inaccurate.")
        return None


def find_separation_point(w, mu_plus, mu_minus):
    return -0.5 * (w.T @ (mu_plus + mu_minus))


# Input data
data = np.array([[4.0, 2.9], [3.5, 4.0], [2.5, 1.0], [2.0, 2.1]])
labels = np.array([1, 1, -1, -1])

means = compute_means(data, labels)
mu_plus = means[1]
mu_minus = means[-1]
B = compute_between_class_scatter(mu_plus, mu_minus)

S_matrices = compute_within_class_scatter(data, labels, means)
S = S_matrices[1] + S_matrices[-1]

mean_diff = mu_plus - mu_minus
w = find_best_direction(S, mean_diff)

w0 = find_separation_point(w, mu_plus, mu_minus)

print("\n>>> Answers\n")

print(f"μ₊₁ = {mu_plus}")
print(f"μ₋₁ = {mu_minus}")
print("\nThe between-class scatter matrix B:\n", B)
print("\nS₊₁:\n", S_matrices[1])
print("\nS₋₁:\n", S_matrices[-1])
print("\nThe within-class scatter matrix S:\n", S)
print("\nThe best direction vector w:\n", w)
print(f"\nThe separation point w₀: {w0}")

plt.figure(figsize=(6, 6))
plt.scatter(
    data[labels == 1][:, 0], data[labels == 1][:, 1], label="Class 1", marker="^"
)
plt.scatter(
    data[labels == -1][:, 0], data[labels == -1][:, 1], label="Class -1", marker="o"
)

x_vals = np.linspace(1, 5, 100)
y_vals = -(w[0] * x_vals + w0) / w[1]


def classify(x, w, w0):
    return np.sign(w.T @ x + w0)


print("\n>>> Classification testing")

for i, x in enumerate(data):
    prediction = classify(x, w, w0)
    print(f"\nData {i+1}: {x}")
    print(f"Label: {labels[i]}")
    print(f"Predict: {prediction}")

plt.plot(x_vals, y_vals, label="Discriminant Line")
plt.grid(True)
plt.legend()
plt.title("Linear Discriminant Line")
plt.show()
