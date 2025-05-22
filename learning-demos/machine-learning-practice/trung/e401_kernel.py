import numpy as np

def compute_kernel_matrix(X):
    """
    Compute the kernel matrix K where K(xi, xj) = ||xi - xj||²
    
    Parameters:
    X : numpy.ndarray
        Input data matrix where each row is a data point
        
    Returns:
    numpy.ndarray
        Kernel matrix K where K[i,j] = ||xi - xj||²
    """
    n = X.shape[0]  # number of data points
    K = np.zeros((n, n))
    
    # Compute pairwise distances
    for i in range(n):
        for j in range(n):
            # Calculate squared Euclidean distance
            diff = X[i] - X[j]
            K[i,j] = np.sum(diff * diff)
            
    return K

# Example usage with the given data
# Create the data matrix
X = np.array([
    [4.0, 2.9],
    [2.5, 1.0],
    [3.5, 4.0],
    [2.0, 2.1]
])

# Compute the kernel matrix
K = compute_kernel_matrix(X)

# Print the result with nice formatting
print("Kernel Matrix K:")
np.set_printoptions(precision=2, suppress=True)
print(K)