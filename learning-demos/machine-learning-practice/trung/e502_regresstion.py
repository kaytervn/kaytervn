import numpy as np

# Given data
X = np.array([[1, 1],
              [1, 2],
              [1, 4],
              [1, 6]])  # Design matrix with intercept
Y = np.array([1, 3, 4, 3])  # Response vector
alpha = 0.5  # Regularization constant

# Step 1: Compute X^T X
XT_X = np.dot(X.T, X)

# Step 2: Add regularization term (alpha * I)
I = np.eye(XT_X.shape[0])  # Identity matrix of size 2x2
regularized_matrix = XT_X + alpha * I

# Step 3: Compute the inverse of the regularized matrix
inverse_matrix = np.linalg.inv(regularized_matrix)  # Inverse

# Step 4: Compute X^T Y
XT_Y = np.dot(X.T, Y)

# Step 5: Compute coefficients (beta)
beta = np.dot(inverse_matrix, XT_Y)

# Step 6: Compute predicted values (Y_hat)
Y_hat = np.dot(X, beta)  # Predicted Y

# Step 7: Compute residuals (epsilon)
epsilon = Y - Y_hat  # Residuals

# Step 8: Compute Y_hat^T epsilon (Q3)
Y_hat_T_epsilon = np.dot(Y_hat.T, epsilon)

# Step 9: Compute ||Y||^2, ||Y_hat||^2, and ||epsilon||^2 (Q4)
norm_Y_squared = np.dot(Y.T, Y)  # ||Y||^2
norm_Y_hat_squared = np.dot(Y_hat.T, Y_hat)  # ||Y_hat||^2
norm_epsilon_squared = norm_Y_squared - norm_Y_hat_squared  # ||epsilon||^2

# Print results
print("X^T X:")
print(XT_X)
print("\nRegularized Matrix (X^T X + alpha * I):")
print(regularized_matrix)
print("\nInverse of Regularized Matrix:")
print(inverse_matrix)
print("\nCoefficients (beta):")
print(beta)
print(f"\nRegression Equation: Y = {beta[0]:.4f} + {beta[1]:.4f}X")

print("\nQ3: Y_hat^T epsilon:")
print(Y_hat_T_epsilon)

print("\nQ4: Norms:")
print(f"||Y||^2 = {norm_Y_squared}")
print(f"||Y_hat||^2 = {norm_Y_hat_squared}")
print(f"||epsilon||^2 = {norm_epsilon_squared}")
