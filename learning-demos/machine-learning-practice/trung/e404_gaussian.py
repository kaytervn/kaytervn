import numpy as np
from scipy.linalg import eigh

# Given data
points = np.array([[2.5, 1], [3.5, 4], [2, 2.1]])
sigma_squared = 5
sigma = np.sqrt(sigma_squared)

# Gaussian kernel function
def gaussian_kernel(x_i, x_j, sigma_squared):
    distance_squared = np.sum((x_i - x_j) ** 2)
    return np.exp(-distance_squared / (2 * sigma_squared))

# Compute the kernel matrix
def compute_kernel_matrix(points, sigma_squared):
    n = len(points)
    K = np.zeros((n, n))
    
    for i in range(n):
        for j in range(n):
            K[i, j] = gaussian_kernel(points[i], points[j], sigma_squared)
    
    return K

# Compute the kernel matrix
K = compute_kernel_matrix(points, sigma_squared)
print("Kernel Matrix:\n", K)

# Compute the distance of phi(x1) from the mean in feature space
def distance_from_mean(K):
    n = K.shape[0]
    mean_K = np.sum(K, axis=0) / n
    distance_squared = K[0, 0] - (2 / n) * np.sum(K[0, :]) + (1 / (n ** 2)) * np.sum(K)
    return np.sqrt(distance_squared)

distance_phi_x1 = distance_from_mean(K)
print("\nDistance of phi(x1) from the mean in feature space:", distance_phi_x1)

# Compute the dominant eigenvector and eigenvalue of the kernel matrix
def dominant_eigenvector(K):
    # Use `eigh` to get eigenvalues and eigenvectors
    # `eigh` sorts eigenvalues in ascending order, so the last one is the largest
    eigenvalues, eigenvectors = eigh(K)
    dominant_eigenvalue = eigenvalues[-1]
    dominant_eigenvector = eigenvectors[:, -1]
    return dominant_eigenvalue, dominant_eigenvector

# Calculate dominant eigenvalue and eigenvector
dominant_eigenvalue, dominant_eigenvector = dominant_eigenvector(K)
print("\nDominant Eigenvalue:", dominant_eigenvalue)
print("Dominant Eigenvector:", dominant_eigenvector)
