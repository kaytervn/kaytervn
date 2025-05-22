import numpy as np

# Combined Code: K-means and One Iteration of EM Algorithm

# Data points from the table
data_points = np.array([
    [0, 2],
    [1, 0],
    [1, 1],
    [4, 1],
    [3, 3]
])

# ---- Part (a): K-means Algorithm ----

def compute_centroids(data, cluster_assignments):
    """Compute centroids for each cluster."""
    centroids = []
    for cluster in cluster_assignments.values():
        centroids.append(np.mean(data[cluster], axis=0))
    return np.array(centroids)


def assign_clusters(data, centroids):
    """Assign points to the nearest cluster based on Euclidean distance."""
    new_clusters = {1: [], 2: []}
    for idx, point in enumerate(data):
        distances = np.linalg.norm(centroids - point, axis=1)
        cluster = np.argmin(distances) + 1  # Cluster index starts at 1
        new_clusters[cluster].append(idx)
    return new_clusters


def k_means(data, initial_clusters, max_iters=100):
    """Run K-means algorithm until convergence."""
    clusters = initial_clusters
    for _ in range(max_iters):
        centroids = compute_centroids(data, clusters)
        new_clusters = assign_clusters(data, centroids)
        if new_clusters == clusters:
            break
        clusters = new_clusters
    return clusters, compute_centroids(data, clusters)


# Initial cluster assignments
clusters = {1: [0, 1, 2], 2: [3, 4]}  # Indices of x1, x2, ..., x5 for C1 and C2

# Run K-means
final_clusters, final_centroids = k_means(data_points, clusters)


# ---- Part (b): EM Algorithm ----
def gaussian_pdf(x, mean, var):
    """Compute Gaussian probability density for a single point."""
    return np.prod((1 / np.sqrt(2 * np.pi * var)) * np.exp(-((x - mean) ** 2) / (2 * var)))


def em_algorithm_one_iteration(data, responsibilities, means, variances):
    """Perform one iteration of the EM algorithm."""
    # E-step: Update responsibilities
    for i in range(len(data)):  # For each data point
        for j in range(k):  # For each cluster
            # Compute Gaussian probability for x_i given cluster j
            responsibilities[i, j] = gaussian_pdf(data[i], means[j], variances[j])
        # Normalize responsibilities so they sum to 1
        responsibilities[i, :] /= np.sum(responsibilities[i, :])

    # M-step: Update means and variances
    for j in range(k):  # For each cluster
        # Effective number of points assigned to cluster j
        Nj = np.sum(responsibilities[:, j])
        # Update mean
        means[j] = np.sum(responsibilities[:, j][:, None] * data, axis=0) / Nj
        # Update variance
        variances[j] = np.sum(responsibilities[:, j][:, None] * (data - means[j])**2, axis=0) / Nj

    return responsibilities, means, variances


# Initialization for EM algorithm
k = 2  # Number of clusters
n, d = data_points.shape  # Number of points and dimensions
responsibilities = np.full((n, k), 0.5)  # P(Ci | xj)
means = np.random.rand(k, d)  # Random initial means
variances = np.ones((k, d))  # Initial variances set to 1

# Perform one iteration of the EM algorithm
responsibilities, updated_means, updated_variances = em_algorithm_one_iteration(
    data_points, responsibilities, means, variances
)

# Final Results
final_clusters, final_centroids, responsibilities, updated_means, updated_variances
print("Final Clusters:", final_clusters)
print("Final Centroids:", final_centroids)

print("Responsibilities after one iteration:", responsibilities)
print("Updated Means:", updated_means)
print("Updated Variances:", updated_variances)

