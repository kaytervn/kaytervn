import numpy as np


# Define the Gaussian RBF kernel function
def gaussian_rbf_kernel(xi, xj, sigma=1.0):
    return np.exp(-np.linalg.norm(xi - xj) ** 2 / (2 * sigma**2))


# Define the points
z1 = np.array([1.0, 1.0])  # z1 close to x
z2 = np.array([10.0, 10.0])  # z2 far from x
x = np.array([1.1, 1.1])  # x close to z1

# Compute the kernel values
k_z1_x = gaussian_rbf_kernel(z1, x)
k_z2_x = gaussian_rbf_kernel(z2, x)


# Determine the appropriate options
def classify_kernel_value(value):
    if value > 1:  # Gaussian RBF kernel values are always ≤ 1, so this won't happen
        return "none of the mentioned"
    elif value > 0.9:
        return "will be near to c1, c1 > 1"
    elif value > 0:
        return "will be near to c1, c1 < 0"
    else:
        return "none of the mentioned"


# Classify the results
result_z1 = classify_kernel_value(k_z1_x)
result_z2 = classify_kernel_value(k_z2_x)

# Output the results
print(f"k(z1, x): {k_z1_x}, Classification: {result_z1}")
print(f"k(z2, x): {k_z2_x}, Classification: {result_z2}")
