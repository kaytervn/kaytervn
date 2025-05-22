import numpy as np

# Input data
X = np.array([5, 0, 2, 1, 2])
Y = np.array([2, 1, 1, 1, 0])

n = len(X)
X_bar = np.column_stack([np.ones(n), X])

print("\n(a) Computing predicted response vector Ŷ:")

P = X_bar @ np.linalg.inv(X_bar.T @ X_bar) @ X_bar.T

Y_hat = P @ Y

print("\nProjection matrix P:")
print(P)
print("\nPredicted response vector Ŷ:")
print(f"Ŷ = {Y_hat}")

print("\n(b) Computing bias and slope:")

beta = np.linalg.inv(X_bar.T @ X_bar) @ X_bar.T @ Y

bias = beta[0]
slope = beta[1]

print(f"\nBias (β₀) = {bias}")
print(f"Slope (β₁) = {slope}")
print(f"\nRegression equation: Y = {bias:.4f} + {slope:.4f}X")

print("\nVerification:")
print("R² score:", 1 - np.sum((Y - Y_hat) ** 2) / np.sum((Y - np.mean(Y)) ** 2))
print("Mean squared error:", np.mean((Y - Y_hat) ** 2))
