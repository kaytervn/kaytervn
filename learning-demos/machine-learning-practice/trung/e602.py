# Import necessary libraries
import numpy as np
from scipy.stats import norm

# Given data from the table
x = np.array([1, 2, 7, 8, 2, 1])  # x values
P_C1_given_x = np.array([0.9, 0.7, 0.2, 0.1, 0.8, 0.6])  # P(C1 | x)
P_C2_given_x = np.array([0.1, 0.1, 0.7, 0.6, 0.1, 0.3])  # P(C2 | x)

# Part (a): Calculate means for cluster C1 and C2 using weighted averages
mu1 = np.sum(P_C1_given_x * x) / np.sum(P_C1_given_x)
mu2 = np.sum(P_C2_given_x * x) / np.sum(P_C2_given_x)

# Display results for Part (a)
print(f"Maximum Likelihood Estimates: μ1 = {mu1:.2f}, μ2 = {mu2:.2f}")

# Part (b): Posterior probabilities for x = 5
# Given parameters
x_value = 5
mu1_given = 2  # μ1 from the problem
mu2_given = 5  # μ2 from the problem
sigma1 = sigma2 = 1  # σ1 = σ2
P_C1 = P_C2 = 0.4  # Prior probabilities
P_x_5 = 0.02  # Given prior probability of x=5

# Step 1: Compute P(x=5 | C1) and P(x=5 | C2) using the normal PDF
P_x_given_C1 = norm.pdf(x_value, loc=mu1_given, scale=sigma1)
P_x_given_C2 = norm.pdf(x_value, loc=mu2_given, scale=sigma2)

# Step 2: Apply Bayes' theorem to calculate posterior probabilities
P_C1_given_x_5 = (P_x_given_C1 * P_C1) / P_x_5
P_C2_given_x_5 = (P_x_given_C2 * P_C2) / P_x_5

# Display results for Part (b)
print(f"P(C1 | x=5) = {P_C1_given_x_5}")
print(f"P(C2 | x=5) = {P_C2_given_x_5}")
