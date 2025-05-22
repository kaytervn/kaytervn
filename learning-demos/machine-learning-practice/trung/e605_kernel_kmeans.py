import numpy as np

# Data points as given in the table
X = np.array([
    [0.3, 0.9, 0.5],  # x1
    [0.5, 0.1, 0.6],  # x2
    [0.5, 0.5, 0.4],  # x3
    [0.4, 0.6, 0.7],  # x4
])

# Initial cluster assignments
C1 = [0, 1]  # Indices for x1, x2
C2 = [2, 3]  # Indices for x3, x4

# Kernel function (RBF kernel example)
def rbf_kernel(x, y, gamma=1.0):
    return np.exp(-gamma * np.linalg.norm(x - y)**2)

# Compute distances for x1
x1 = X[0]  # The point x1
clusters = [C1, C2]
distances = []

for cluster in clusters:
    cluster_points = X[cluster]
    kernel_sum = sum(rbf_kernel(x1, xi) for xi in cluster_points)
    distances.append(-kernel_sum / len(cluster))  # Kernelized distance

# Determine the new cluster for x1
new_cluster = np.argmin(distances) + 1  # Adding 1 to match cluster indexing (C1, C2)
print(distances)
print(f"x1 should be assigned to C{new_cluster} in the next iteration.")
