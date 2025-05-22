import numpy as np

# Input data
x1 = np.array([2.5, 1])
x2 = np.array([3.5, 4])
x3 = np.array([2, 2.1])

points = np.array([x1, x2, x3])


def gaussian_kernel(x_i, x_j, sigma2):
    diff = x_i - x_j
    return np.exp(-np.dot(diff, diff) / (2 * sigma2))


def distance_from_mean(K):
    n = K.shape[0]
    mean_K = np.sum(K, axis=0) / n
    distance_squared = K[0, 0] - (2 / n) * np.sum(K[0, :]) + (1 / (n**2)) * np.sum(K)
    return np.sqrt(distance_squared)


sigma2 = 5
n = len(points)
kernel_matrix = np.zeros((n, n))

for i in range(n):
    for j in range(n):
        kernel_matrix[i, j] = gaussian_kernel(points[i], points[j], sigma2)

print("\n(a) Gaussian Kernel Matrix:")
print(kernel_matrix)

mean_feature_space = np.mean(kernel_matrix, axis=0)

distance_phi_x1 = distance_from_mean(kernel_matrix)

print("\n(b) Distance of φ(x1) from the mean in feature space:")
print(distance_phi_x1)

eigenvalues, eigenvectors = np.linalg.eig(kernel_matrix)
dominant_eigenvalue = np.max(eigenvalues)
dominant_eigenvector = eigenvectors[:, np.argmax(eigenvalues)]

print("\n(c) Dominant Eigenvalue and Eigenvector:")
print("Dominant Eigenvalue:", dominant_eigenvalue)
print("Dominant Eigenvector:", dominant_eigenvector)
