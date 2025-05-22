import numpy as np

# Define a symmetric similarity matrix S (example)
S = np.array([[2, 1], [1, 3]])

# Ensure S is symmetric
assert np.allclose(S, S.T), "Matrix S must be symmetric."

# Compute eigenvalues and eigenvectors of S
eigenvalues, eigenvectors = np.linalg.eig(S)

# Display eigenvalues and eigenvectors of S
print("Eigenvalues of S:", eigenvalues)
print("Eigenvectors of S:\n", eigenvectors)

# Choose a power l for S^l
l = 3

# Compute S^l (matrix power)
S_l = np.linalg.matrix_power(S, l)

# Compute eigenvalues and eigenvectors of S^l
eigenvalues_l, eigenvectors_l = np.linalg.eig(S_l)

# Display S^l
print(f"\nMatrix S^{l}:\n", S_l)

# Display eigenvalues and eigenvectors of S^l
print(f"\nEigenvalues of S^{l}:", eigenvalues_l)
print(f"Eigenvectors of S^{l}:\n", eigenvectors_l)

# Verify the eigenvalues of S^l are (eigenvalues of S)^l
computed_eigenvalues_l = eigenvalues**l
print(f"\nComputed Eigenvalues of S^{l} (from S):", computed_eigenvalues_l)

# Verify that the eigenvectors are identical
eigenvectors_identical = np.allclose(eigenvectors, eigenvectors_l)
print(
    f"\nAre eigenvectors of S and S^{l} identical? {'Yes' if eigenvectors_identical else 'No'}"
)
