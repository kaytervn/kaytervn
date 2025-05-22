import numpy as np

# === Q2: Ridge Regression ===
# Data from Table 2
X = np.array([1, 2, 4, 6]).reshape(-1, 1)  # Feature values
Y = np.array([1, 3, 4, 3]).reshape(-1, 1)  # Target values
alpha = 0.5  # Regularization constant

# Adding bias term (column of ones) to X
X_with_bias = np.hstack((np.ones_like(X), X))

# Computing A = X^T * X + alpha * I
A = np.dot(X_with_bias.T, X_with_bias) + alpha * np.eye(X_with_bias.shape[1])

# Computing b = X^T * Y
b = np.dot(X_with_bias.T, Y)

# Inverting A using the given formula for a 2x2 matrix
det_A = A[0, 0] * A[1, 1] - A[0, 1] * A[1, 0]  # Determinant
A_inv = (1 / det_A) * np.array([[A[1, 1], -A[0, 1]], [-A[1, 0], A[0, 0]]])  # Inverse

# Ridge regression coefficients (theta)
theta = np.dot(A_inv, b)

# Print results for Q2
print("\n=== Q2: Ridge Regression ===")
print("Matrix A (X^T X + alpha I):")
print(A)
print("\nVector b (X^T Y):")
print(b)
print("\nRidge Regression Coefficients (theta):")
print(theta)
print(f"\nThe regression equation is: Y^ = {theta[0, 0]} + {theta[1, 0]} * X")

# === Q3: Compute Y_hat^T * epsilon ===
# Predicted values (Y_hat)
Y_hat = np.dot(X_with_bias, theta)

# Residuals (epsilon)
epsilon = Y - Y_hat

# Compute Y_hat^T * epsilon
Y_hat_T_epsilon = np.dot(Y_hat.T, epsilon)

# Print results for Q3
print("\n=== Q3: Compute Y_hat^T * epsilon ===")
print("Predicted Values (Y_hat):")
print(Y_hat.flatten())
print("\nResiduals (epsilon = Y - Y_hat):")
print(epsilon.flatten())
print(f"\nY_hat^T * epsilon: {Y_hat_T_epsilon[0, 0]}")

# === Q4: Compute ||epsilon||^2 ===
# Compute norms
norm_Y = np.linalg.norm(Y)
norm_Y_hat = np.linalg.norm(Y_hat)

# Compute ||epsilon||^2 using ||Y||^2 - ||Y_hat||^2
norm_epsilon_squared = norm_Y**2 - norm_Y_hat**2

# Print results for Q4
print("\n=== Q4: Compute ||epsilon||^2 ===")
print(f"Norm of Y (||Y||): {norm_Y}")
print(f"Norm of Y_hat (||Y_hat||): {norm_Y_hat}")
print(f"\nNorm squared of residuals (||epsilon||^2): {norm_epsilon_squared}")
