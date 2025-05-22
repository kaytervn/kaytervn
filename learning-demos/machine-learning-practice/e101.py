import pandas as pd
import math

# Dataset as a DataFrame
data = pd.DataFrame(
    {
        "Age": [25, 20, 25, 45, 20, 25],
        "Car": ["sports", "vintage", "sports", "suv", "sports", "suv"],
        "Class": ["L", "H", "L", "H", "H", "H"],
    }
)

# New data point
new_point = {"Age": 23, "Car": "truck"}

# Calculate priors
priors = data["Class"].value_counts(normalize=True)
print("Priors:\n", priors, "\n")


# Gaussian likelihood for continuous data (Age)
def gaussian_likelihood(x, mean, std):
    return (1 / (math.sqrt(2 * math.pi) * std)) * math.exp(
        -((x - mean) ** 2) / (2 * std**2)
    )


# Calculate means and standard deviations for Age per class
mean_std_age = data.groupby("Class")["Age"].agg(["mean", "std"])
print("Mean and Standard Deviation for Age per Class:\n", mean_std_age, "\n")


# Applying Laplace smoothing for categorical data
def smoothed_likelihood(data, feature, value, given_class, domain_size):
    filtered_data = data[data["Class"] == given_class]
    count_value = (filtered_data[feature] == value).sum()
    # Laplace smoothing applied
    return (count_value + 1) / (len(filtered_data) + domain_size)


# Domain size for Car (unique car types)
domain_size_car = 4  # sports, vintage, suv, truck

# Posterior probability calculation
posteriors = {}
for c in priors.index:  # For each class
    # Prior probability P(Y = c)
    posterior = priors[c]
    print(f"Initial Prior for class '{c}':", posterior)

    # Gaussian likelihood for Age, handling zero std
    age_mean = mean_std_age.loc[c, "mean"]
    age_std = mean_std_age.loc[c, "std"]
    if age_std == 0:  # Handle zero variance
        age_std = 1e-6  # Small value to avoid division by zero
    age_likelihood = gaussian_likelihood(new_point["Age"], age_mean, age_std)
    print(
        f"Gaussian likelihood for Age={new_point['Age']} in class '{c}':",
        age_likelihood,
    )
    posterior *= age_likelihood

    # Smoothed likelihood for Car (categorical)
    car_likelihood = smoothed_likelihood(
        data, "Car", new_point["Car"], c, domain_size_car
    )
    print(
        f"Smoothed likelihood for Car='{new_point['Car']}' in class '{c}':",
        car_likelihood,
    )
    posterior *= car_likelihood

    posteriors[c] = posterior
    print(f"Posterior probability for class '{c}':", posterior, "\n")

print("Final Posterior Probabilities:\n", posteriors)

# Determine the class with the highest posterior probability
predicted_class = max(posteriors, key=posteriors.get)
print("\nThe new data point is classified as:", predicted_class)
