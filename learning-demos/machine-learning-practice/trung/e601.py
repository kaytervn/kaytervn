import numpy as np

# Given data points and initial means
points = np.array([2, 19, 28, 11, 23, 1, 4, 14, 12])
k = 3
initial_means = np.array([1, 4, 5])

# Function to assign points to the nearest mean
def assign_clusters(points, means):
    clusters = {}
    for i in range(len(means)):
        clusters[i] = []
    
    for point in points:
        # Calculate the distance to each mean
        distances = np.abs(point - means)
        # Assign to the closest mean
        closest_mean = np.argmin(distances)
        clusters[closest_mean].append(point)
    
    return clusters

# Function to update means based on clusters
def update_means(clusters):
    new_means = []
    for i in range(len(clusters)):
        if clusters[i]:  # Avoid division by zero
            new_mean = np.mean(clusters[i])
        else:
            new_mean = 0
        new_means.append(new_mean)
    return np.array(new_means)

# Perform one iteration of K-means
clusters = assign_clusters(points, initial_means)
updated_means = update_means(clusters)

# Display results
print("Clusters after one iteration:")
for cluster, members in clusters.items():
    print(f"Cluster {cluster + 1}: {members}")
print("\nUpdated means for the next iteration:", updated_means)
