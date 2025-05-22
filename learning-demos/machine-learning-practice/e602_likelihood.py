import numpy as np

# === Part (a): MLE for means μ1 and μ2 ===

# Data from Table 1
x = np.array([2, 3, 7, 9, 2, 1])  # Data points
P_C1_given_x = np.array([0.9, 0.8, 0.3, 0.1, 0.9, 0.8])  # P(C1|x)
P_C2_given_x = np.array([0.1, 0.1, 0.7, 0.9, 0.1, 0.2])  # P(C2|x)

# Weighted means (MLE)
mu1 = np.sum(P_C1_given_x * x) / np.sum(P_C1_given_x)
mu2 = np.sum(P_C2_given_x * x) / np.sum(P_C2_given_x)

print("=== Part (a): Maximum Likelihood Estimates ===")
print(f"MLE for μ1: {mu1:.2f}")
print(f"MLE for μ2: {mu2:.2f}")

# === Part (b): Probability of x = 5 belonging to C1 and C2 ===

# Given parameters
x_target = 5
mu1_fixed = 2
mu2_fixed = 7
sigma1 = sigma2 = 1
P_C1 = P_C2 = 0.5  # Prior probabilities
P_x_5 = 0.029  # Prior probability of x = 5


# Gaussian likelihood function
def gaussian_pdf(x, mu, sigma):
    return (1 / (np.sqrt(2 * np.pi) * sigma)) * np.exp(
        -((x - mu) ** 2) / (2 * sigma**2)
    )


# Likelihoods for x = 5
P_x_given_C1 = gaussian_pdf(x_target, mu1_fixed, sigma1)
P_x_given_C2 = gaussian_pdf(x_target, mu2_fixed, sigma2)

# Posterior probabilities
P_C1_given_x_5 = (P_C1 * P_x_given_C1) / P_x_5
P_C2_given_x_5 = (P_C2 * P_x_given_C2) / P_x_5

print("\n=== Part (b): Posterior Probabilities ===")
print(f"P(C1 | x = 5): {P_C1_given_x_5}")
print(f"P(C2 | x = 5): {P_C2_given_x_5}")
