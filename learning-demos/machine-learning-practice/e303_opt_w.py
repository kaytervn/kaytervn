import numpy as np


def find_optimal_w(B, S):
    try:
        eigenvalues, eigenvectors = np.linalg.eig(np.linalg.inv(S) @ B)
        max_eigenvalue_index = np.argmax(eigenvalues)
        w_optimal = eigenvectors[:, max_eigenvalue_index]
        w_optimal /= np.linalg.norm(w_optimal)
        return w_optimal
    except np.linalg.LinAlgError:
        print("Error: Singular matrix encountered.  Check your scatter matrices.")
        return None


# Input data
B = np.array([[2.25, 2.85], [2.85, 3.61]])
S = np.array([[0.25, -0.55], [-0.55, 1.21]])

w_optimal = find_optimal_w(B, S)

if w_optimal is not None:
    print("Optimal direction vector w:", w_optimal)
    eigenvalues, _ = np.linalg.eig(np.linalg.inv(S) @ B)
    print("Maximum eigenvalue (objective):", np.max(eigenvalues))
