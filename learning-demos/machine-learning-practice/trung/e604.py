import numpy as np

# Define the dataset
data = [
    ["A", "T"],  # x1
    ["C", "A"],  # x2
    ["C", "C"],  # x3
    ["A", "T"],  # x4
]

# Initial cluster assignments
clusters = {"C1": [0, 1], "C2": [2, 3]}  # Indices of points in C1 and C2

# Define the domain of attributes
domain = ["A", "C", "T"]

# Step 1: Compute likelihood probabilities P(x_a | C_i)
def compute_likelihood(cluster_points, data, domain):
    likelihood = []
    cluster_size = len(cluster_points)
    
    for attr_index in range(len(data[0])):  # Iterate through each attribute
        count = {value: 0 for value in domain}
        for point_index in cluster_points:
            count[data[point_index][attr_index]] += 1
        # Calculate probabilities
        likelihood.append({value: count[value] / cluster_size for value in domain})
    
    return likelihood

likelihood_C1 = compute_likelihood(clusters["C1"], data, domain)
likelihood_C2 = compute_likelihood(clusters["C2"], data, domain)

# Step 2: Compute P(C_i | x_j)
def compute_posterior(data_point, likelihood, prior):
    prob = prior
    for attr_index, value in enumerate(data_point):
        prob *= likelihood[attr_index].get(value, 0)
    return prob

priors = {"C1": 0.5, "C2": 0.5}
new_clusters = {"C1": [], "C2": []}

for i, point in enumerate(data):
    p_C1 = compute_posterior(point, likelihood_C1, priors["C1"])
    p_C2 = compute_posterior(point, likelihood_C2, priors["C2"])
    
    # Assign to the cluster with the higher probability
    if p_C1 > p_C2:
        new_clusters["C1"].append(i)
    else:
        new_clusters["C2"].append(i)

# Output the new clusters
print("Updated Clusters:", new_clusters)
