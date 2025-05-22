import numpy as np

# Input data
data_points = np.array([[4, 2.9], [2.5, 1], [3.5, 4], [2, 2.1]])

n = data_points.shape[0]

K = np.zeros((n, n))

for i in range(n):
    for j in range(n):
        K[i, j] = np.linalg.norm(data_points[i] - data_points[j]) ** 2

print("Kernel Matrix K:")
print(K)
