import numpy as np

# Data from Table 2
data = np.array([[0, 2], [1, 0], [1, 1], [4, 1], [3, 3]])  # x1  # x2  # x3  # x4  # x5

# Initial cluster assignments: C1 = {x1, x2, x3}, C2 = {x4, x5}
clusters = {1: data[:3], 2: data[3:]}  # Points x1, x2, x3  # Points x4, x5


# --- (a) K-means Algorithm ---
def k_means(data, k, initial_clusters):
    # Initialize centroids based on initial clusters
    centroids = [np.mean(points, axis=0) for points in initial_clusters.values()]
    converged = False

    while not converged:
        # Assignment step: Assign points to the nearest centroid
        new_clusters = {i: [] for i in range(1, k + 1)}
        for point in data:
            distances = [np.linalg.norm(point - centroid) for centroid in centroids]
            closest_cluster = np.argmin(distances) + 1
            new_clusters[closest_cluster].append(point)

        # Update centroids
        new_centroids = []
        for i in range(1, k + 1):
            if new_clusters[i]:  # Avoid empty clusters
                new_centroids.append(np.mean(new_clusters[i], axis=0))
            else:
                new_centroids.append(
                    centroids[i - 1]
                )  # Keep old centroid if cluster is empty

        # Check for convergence
        converged = np.all(
            [np.array_equal(new_centroids[i], centroids[i]) for i in range(k)]
        )
        centroids = new_centroids
        clusters = new_clusters

    return centroids, clusters


k_means_centroids, k_means_clusters = k_means(data, k=2, initial_clusters=clusters)


# --- (b) EM Algorithm ---
def em_algorithm(data, k, initial_probabilities):
    n, d = data.shape

    # Initialize probabilities P(Ci|xj) = 0.5 for all i, j
    probabilities = np.full((n, k), initial_probabilities)
    means = np.random.rand(k, d)  # Random initialization for means
    variances = np.ones((k, d))  # Assume unit variances initially
    priors = np.full(k, 1 / k)  # Uniform prior

    # E-step: Compute responsibilities
    for j in range(n):
        for i in range(k):
            likelihood = priors[i]
            for dim in range(d):
                likelihood *= (
                    1
                    / np.sqrt(2 * np.pi * variances[i][dim])
                    * np.exp(
                        -((data[j][dim] - means[i][dim]) ** 2) / (2 * variances[i][dim])
                    )
                )
            probabilities[j][i] = likelihood
        probabilities[j] /= np.sum(probabilities[j])

    # M-step: Update parameters based on responsibilities
    for i in range(k):
        responsibility = probabilities[:, i]
        total_responsibility = np.sum(responsibility)

        # Update means
        means[i] = np.sum(responsibility[:, None] * data, axis=0) / total_responsibility

        # Update variances
        variances[i] = (
            np.sum(responsibility[:, None] * (data - means[i]) ** 2, axis=0)
            / total_responsibility
        )

        # Update priors
        priors[i] = total_responsibility / n

    return probabilities, means, variances, priors


initial_probabilities = 0.5
em_probabilities, em_means, em_variances, em_priors = em_algorithm(
    data, k=2, initial_probabilities=initial_probabilities
)

k_means_centroids, k_means_clusters, em_probabilities, em_means, em_variances, em_priors

# Print results of K-means
print("=== Part (a): K-means Algorithm Results ===")
print("Final Centroids:")
for i, centroid in enumerate(k_means_centroids, start=1):
    print(f"  Cluster {i}: {centroid}")

print("\nCluster Assignments:")
for cluster_id, points in k_means_clusters.items():
    print(f"  Cluster {cluster_id}: {points}")

# Print results of EM Algorithm

print("\n=== Part (b): EM Algorithm Results ===")
print("Responsibilities (P(Ci|xj)):")
for j, probs in enumerate(em_probabilities, start=1):
    print(f"  x{j}: {probs}")

print("\nUpdated Means:")
for i, mean in enumerate(em_means, start=1):
    print(f"  Cluster {i}: {mean}")

print("\nUpdated Variances:")
for i, var in enumerate(em_variances, start=1):
    print(f"  Cluster {i}: {var}")

print("\nUpdated Priors:")
for i, prior in enumerate(em_priors, start=1):
    print(f"  Cluster {i}: {prior}")
