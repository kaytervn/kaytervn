import numpy as np

# Input data
data = np.array([[4.0, 2.9], [3.5, 4.0], [2.5, 1.0], [2.0, 2.1]])
labels = np.array([1, 1, -1, -1])

# (a) Compute μ_+1, μ_-1, and B
class_1 = data[labels == 1]
class_neg_1 = data[labels == -1]

mu_plus_1 = np.mean(class_1, axis=0)
mu_minus_1 = np.mean(class_neg_1, axis=0)
B = np.outer(mu_plus_1 - mu_minus_1, mu_plus_1 - mu_minus_1)

print("μ_+1:", mu_plus_1)
print("μ_-1:", mu_minus_1)
print("B (between-class scatter matrix):\n", B)

# (b) Compute S_+1, S_-1, and S
S_plus_1 = sum(np.outer(x - mu_plus_1, x - mu_plus_1) for x in class_1)
S_minus_1 = sum(np.outer(x - mu_minus_1, x - mu_minus_1) for x in class_neg_1)
S = S_plus_1 + S_minus_1

print("S_+1 (within-class scatter matrix for class +1):\n", S_plus_1)
print("S_-1 (within-class scatter matrix for class -1):\n", S_minus_1)
print("S (total within-class scatter matrix):\n", S)

# (c) Find the best direction w
epsilon = 1e-6  # Regularization constant
S_inv = np.linalg.inv(S + np.eye(S.shape[0]) * epsilon)
w = S_inv @ (mu_plus_1 - mu_minus_1)

print("w (best direction):", w)


# (d) Find the point on w that best separates the two classes
# The point is the midpoint of the projections of the class means onto w
proj_mu_plus_1 = np.dot(w, mu_plus_1)
proj_mu_minus_1 = np.dot(w, mu_minus_1)
midpoint = (proj_mu_plus_1 + proj_mu_minus_1) / 2

print("Midpoint on w:", midpoint)
