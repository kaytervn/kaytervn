import numpy as np

# Given data
X = np.array([5, 0, 2, 1, 2])
Y = np.array([2, 1, 1, 1, 0])

# Number of data points
n = len(X)

# Calculating sums needed for b1 and b0
sum_X = np.sum(X)
sum_Y = np.sum(Y)
sum_XY = np.sum(X * Y)
sum_X_squared = np.sum(X**2)

# Calculating slope (b1)
b1 = (n * sum_XY - sum_X * sum_Y) / (n * sum_X_squared - sum_X**2)

# Calculating intercept (b0)
b0 = (sum_Y - b1 * sum_X) / n

# Predicted Y values (Y_hat)
Y_hat = b0 + b1 * X

# Results
print(f"Slope (b1): {b1}")
print(f"Intercept (b0): {b0}")
print(f"Predicted Y (Y_hat): {Y_hat}")
