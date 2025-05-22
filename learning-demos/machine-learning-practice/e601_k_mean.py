import numpy as np

# === Q1: K-means Algorithm ===

# Given data points and initial means
points = np.array([2, 19, 28, 11, 23, 1, 4, 14, 12])
initial_means = np.array([1, 4, 5])  # μ1=1, μ2=4, μ3=5
k = len(initial_means)  # Number of clusters (k = 3)

print("=== K-means Algorithm: One Iteration ===")
print(f"Data points: {points}")
print(f"Initial means: {initial_means}")

# Step 1: Assign points to the nearest cluster mean
clusters = {i: [] for i in range(k)}  # Initialize clusters
for point in points:
    # Compute distances to each mean
    distances = np.abs(point - initial_means)
    # Assign point to the cluster with the closest mean
    cluster_idx = np.argmin(distances)
    clusters[cluster_idx].append(point)

# Print clusters after assignment
print("\nStep 1: Clusters after assignment:")
for cluster_idx, cluster_points in clusters.items():
    print(f"Cluster {cluster_idx + 1}: {cluster_points}")

# Step 2: Update means (centroids)
updated_means = []
for cluster_idx, cluster_points in clusters.items():
    if len(cluster_points) > 0:
        # Compute the mean of the points in the cluster
        new_mean = np.mean(cluster_points)
    else:
        # If a cluster is empty, retain the old mean
        new_mean = initial_means[cluster_idx]
    updated_means.append(new_mean)

# Print updated means
print("\nStep 2: Updated means for the next iteration:")
for i, mean in enumerate(updated_means):
    print(f"Updated mean for Cluster {i + 1}: {mean:.2f}")

# Final output
print("\n=== Final Results After One Iteration ===")
print(f"Clusters: {clusters}")
print(f"Updated means: {updated_means}")
