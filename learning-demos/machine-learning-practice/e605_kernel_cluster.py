import numpy as np

# Dữ liệu từ bảng
data = np.array(
    [
        [0.3, 0.9, 0.5],  # x1
        [0.5, 0.1, 0.6],  # x2
        [0.5, 0.5, 0.4],  # x3
        [0.4, 0.6, 0.7],  # x4
    ]
)


# Hàm tính ma trận kernel (dot product giữa các điểm)
def compute_kernel_matrix(data):
    n = data.shape[0]
    kernel_matrix = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            kernel_matrix[i, j] = np.dot(data[i], data[j])
    return kernel_matrix


# Tính ma trận kernel
kernel_matrix = compute_kernel_matrix(data)

# Cụm ban đầu
C1 = [0, 1]  # Chỉ số của x1 và x2
C2 = [2, 3]  # Chỉ số của x3 và x4


# Hàm tính khoảng cách kernel đến cụm
def kernel_distance(kernel_matrix, x_idx, cluster):
    cluster_size = len(cluster)
    if cluster_size == 0:
        return float("inf")  # Tránh chia cho 0

    k_xx = kernel_matrix[x_idx, x_idx]  # K(x, x)
    sum_k_xc = np.sum([kernel_matrix[x_idx, j] for j in cluster])  # Σ K(x, c)
    sum_k_cc = np.sum(
        [kernel_matrix[i, j] for i in cluster for j in cluster]
    )  # ΣΣ K(c, c)

    distance = k_xx - (2 / cluster_size) * sum_k_xc + (1 / (cluster_size**2)) * sum_k_cc
    return distance


# Tính khoảng cách từ x1 đến C1 và C2
d_x1_C1 = kernel_distance(kernel_matrix, 0, C1)
d_x1_C2 = kernel_distance(kernel_matrix, 0, C2)

# Kết quả
print("\nKernel Distances:")
print(f"\tDistance to Cluster 1: {d_x1_C1}")
print(f"\tDistance to Cluster 2: {d_x1_C2}")

# So sánh và quyết định cụm mới cho x1
if d_x1_C1 < d_x1_C2:
    print("\nx1 should be assigned to Cluster 1.")
else:
    print("\nx1 should be assigned to Cluster 2.")
