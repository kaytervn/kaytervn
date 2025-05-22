import numpy as np

A = np.array([[0, 1], [1, 1], [1, 1], [2, 1]])
b = np.array([1, 2, 3, 4])

Q, R = np.linalg.qr(A)

print(Q)
print(R)
