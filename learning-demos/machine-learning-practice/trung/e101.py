import pandas as pd
from sklearn.naive_bayes import CategoricalNB

# Creating the dataset
data = {
    'Age': [25, 20, 25, 45, 20, 25],
    'Car': ['sports', 'vintage', 'sports', 'suv', 'sports', 'suv'],
    'Class': ['L', 'H', 'L', 'H', 'L', 'H']
}
df = pd.DataFrame(data)

# Mapping categorical data to numerical values
age_mapping = {20: 0, 25: 1, 45: 2}
car_mapping = {'sports': 0, 'vintage': 1, 'suv': 2, 'truck': 3}
class_mapping = {'L': 0, 'H': 1}

df['Age'] = df['Age'].map(age_mapping)
df['Car'] = df['Car'].map(car_mapping)
df['Class'] = df['Class'].map(class_mapping)

# Splitting features and labels
X = df[['Age', 'Car']]
y = df['Class']

# Training the Naive Bayes classifier
model = CategoricalNB()
model.fit(X, y)

# New data point
new_data = pd.DataFrame([[1, 3]], columns=['Age', 'Car'])  # Age=23 -> mapped as close to 25 (1), Car=truck (3)
naive_bayes_prediction = model.predict(new_data)
naive_bayes_class = 'L' if naive_bayes_prediction[0] == 0 else 'H'
print(f"Naive Bayes classification: {naive_bayes_class}")

# Full Bayes Approach (Manually calculate probabilities)
# Priors
prob_L = (3 / 6)  # Prior probability of Class L
prob_H = (3 / 6)  # Prior probability of Class H

# Likelihoods
# For Age=23 (mapped to 1): We can directly count occurrences in dataset
likelihood_L_age = df[(df['Age'] == 1) & (df['Class'] == 0)].shape[0] / df[df['Class'] == 0].shape[0]
likelihood_H_age = df[(df['Age'] == 1) & (df['Class'] == 1)].shape[0] / df[df['Class'] == 1].shape[0]

# For Car=truck (mapped to 3): It does not exist in the dataset; assume uniform distribution or add a smoothing term
total_classes = len(car_mapping)
likelihood_L_car = 1 / (df[df['Class'] == 0].shape[0] + total_classes)  # Smoothed likelihood
likelihood_H_car = 1 / (df[df['Class'] == 1].shape[0] + total_classes)  # Smoothed likelihood

# Posterior probabilities
posterior_L = prob_L * likelihood_L_age * likelihood_L_car
posterior_H = prob_H * likelihood_H_age * likelihood_H_car

# Classification
if posterior_L > posterior_H:
    full_bayes_class = 'L'
else:
    full_bayes_class = 'H'

print(f"Full Bayes classification: {full_bayes_class}")
