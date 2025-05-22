import numpy as np
from sklearn.datasets import load_iris
from sklearn.linear_model import LinearRegression

# Load the Iris dataset
iris = load_iris()
X = iris.data[:, 2]  # Petal length (predictor variable)
Y = iris.data[:, 3]  # Petal width (response variable)

# Reshape X for the regression model
X = X.reshape(-1, 1)

# Create and fit the linear regression model
model = LinearRegression()
model.fit(X, Y)

# Get the slope (coefficient) and intercept
slope = model.coef_[0]
intercept = model.intercept_

# Print the result with 4 decimal places
print(f"Slope = {slope:.4f}, Intercept = {intercept:.4f}")
