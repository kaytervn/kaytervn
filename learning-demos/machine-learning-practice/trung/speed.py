import numpy as np
from sklearn.linear_model import LinearRegression

# Data from the image
bmi = np.array([19, 20, 25]).reshape(-1, 1)  # BMI values
speed = np.array([9.8, 8.5, 7.8])           # Speed values

# Fit a linear regression model
model = LinearRegression()
model.fit(bmi, speed)

# Coefficients of the model
slope = model.coef_[0]
intercept = model.intercept_

# Predict speed for Jane with BMI = 22
jane_bmi = 22
jane_speed = model.predict(np.array([[jane_bmi]]))[0]

print((f"Slope: {slope}"))
print(f"Intercept: {intercept}")
print(f"Predicted speed for Jane: {jane_speed}")
