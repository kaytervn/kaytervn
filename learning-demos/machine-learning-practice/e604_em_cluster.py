import numpy as np
from collections import Counter

# Data from Table 3
data = np.array(
    [["A", "T"], ["C", "A"], ["C", "C"], ["A", "T"]]  # x1  # x2  # x3
)  # x4

# Initial clusters: C1 = {x1, x2}, C2 = {x3, x4}
clusters = {1: [0, 1], 2: [2, 3]}  # Indexes of x1, x2  # Indexes of x3, x4
attributes = ["A", "C", "T"]

# Initial probabilities
P_C1 = 0.5
P_C2 = 0.5


def compute_likelihood(data, cluster, attributes):
    """Compute P(x_ja | C_i) for a cluster."""
    counts = Counter()
    total = len(cluster)

    # Count occurrences of each attribute in each dimension
    for idx in cluster:
        for dim, value in enumerate(data[idx]):
            counts[(dim, value)] += 1

    # Compute probabilities
    likelihood = {}
    for dim in range(data.shape[1]):
        for attr in attributes:
            likelihood[(dim, attr)] = counts[(dim, attr)] / total if total > 0 else 0

    return likelihood


def compute_posterior(data_point, likelihood, prior, attributes):
    """Compute P(C_i | x_j) for a single data point."""
    prob = prior
    for dim, value in enumerate(data_point):
        prob *= likelihood.get((dim, value), 0)
    return prob


# EM Algorithm - One Iteration
def em_iteration(data, clusters, attributes, P_C1, P_C2):
    # E-step: Calculate likelihoods and posteriors
    likelihood_C1 = compute_likelihood(data, clusters[1], attributes)
    likelihood_C2 = compute_likelihood(data, clusters[2], attributes)

    new_clusters = {1: [], 2: []}
    for j, point in enumerate(data):
        # Compute posterior probabilities for each cluster
        P_C1_given_xj = compute_posterior(point, likelihood_C1, P_C1, attributes)
        P_C2_given_xj = compute_posterior(point, likelihood_C2, P_C2, attributes)

        # Assign point to the cluster with the higher posterior
        if P_C1_given_xj > P_C2_given_xj:
            new_clusters[1].append(j)
        else:
            new_clusters[2].append(j)

    return new_clusters, likelihood_C1, likelihood_C2


# Perform one iteration of the EM algorithm
new_clusters, likelihood_C1, likelihood_C2 = em_iteration(
    data, clusters, attributes, P_C1, P_C2
)

# Print results
print("Initial Clusters:")
print(f"  C1: {[data[i].tolist() for i in clusters[1]]}")
print(f"  C2: {[data[i].tolist() for i in clusters[2]]}")

print("\nLikelihoods for C1:")
for key, value in likelihood_C1.items():
    print(f"  P(x_{key[0]+1} = {key[1]} | C1) = {value:.2f}")

print("\nLikelihoods for C2:")
for key, value in likelihood_C2.items():
    print(f"  P(x_{key[0]+1} = {key[1]} | C2) = {value:.2f}")

print("\nUpdated Clusters after one EM iteration:")
print(f"  C1: {[data[i].tolist() for i in new_clusters[1]]}")
print(f"  C2: {[data[i].tolist() for i in new_clusters[2]]}")
