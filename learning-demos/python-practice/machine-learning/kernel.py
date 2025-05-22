import numpy as np

points = np.array([[4, 2.9], [2.5, 1], [3.5, 4], [2, 2.1]])
diff = points[:, np.newaxis] - points
K = np.sum(diff**2, axis=2)
print(K)
