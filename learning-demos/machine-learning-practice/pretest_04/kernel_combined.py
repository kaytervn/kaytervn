import numpy as np


# Define the feature mappings
def phi1(x):
    # Mapping phi1(x)
    return np.array([x[0] ** 2, x[1] ** 2])


def phi2(x):
    # Mapping phi2(x)
    return np.array([x[0], x[1]])


# Compute phi(x)
def phi(x):
    # Combine phi1(x) and phi2(x)
    return np.concatenate((phi1(x), phi2(x)))


# Test point
x = np.array([1, 2])  # Example input

# Compute and print phi(x)
phi_x = phi(x)
print(f"phi(x): {phi_x}")
