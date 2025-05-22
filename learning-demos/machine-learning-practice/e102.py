import numpy as np
from collections import Counter

# Dữ liệu từ bảng
data = [
    ("T", "T", 5.0, "Y"),
    ("T", "T", 7.0, "Y"),
    ("T", "F", 8.0, "N"),
    ("F", "F", 3.0, "Y"),
    ("F", "T", 7.0, "N"),
    ("F", "T", 4.0, "N"),
    ("F", "F", 5.0, "N"),
    ("T", "F", 6.0, "Y"),
    ("F", "T", 1.0, "N"),
]


# Chuyển đổi dữ liệu thành các tập hợp lớp
def separate_by_class(data):
    separated = {}
    for row in data:
        label = row[-1]
        if label not in separated:
            separated[label] = []
        separated[label].append(row[:-1])
    return separated


# Tính xác suất của từng đặc trưng với giả định độc lập
def calculate_probability(value, feature_values, feature_type):
    if feature_type == "categorical":
        count = feature_values.count(value)
        return count / len(feature_values)
    elif feature_type == "continuous":
        mean = np.mean(feature_values)
        std = np.std(feature_values)
        if std == 0:  # Tránh chia cho 0
            std = 1e-6
        exponent = np.exp(-((value - mean) ** 2) / (2 * (std**2)))
        return (1 / (np.sqrt(2 * np.pi) * std)) * exponent


# Phân loại dữ liệu mới
def naive_bayes_classifier(new_point, data):
    separated = separate_by_class(data)
    total_data = len(data)
    class_probabilities = {}

    for class_label, rows in separated.items():
        class_prob = len(rows) / total_data
        feature_probs = []
        for i in range(len(new_point)):
            feature_values = [row[i] for row in rows]
            feature_type = (
                "categorical" if isinstance(feature_values[0], str) else "continuous"
            )
            prob = calculate_probability(new_point[i], feature_values, feature_type)
            feature_probs.append(prob)
        class_probabilities[class_label] = class_prob * np.prod(feature_probs)

    # Tìm lớp với xác suất lớn nhất
    return max(class_probabilities, key=class_probabilities.get), class_probabilities


# Điểm mới cần phân loại
new_point = ("T", "F", 1.0)

# Phân loại điểm mới
classification, probabilities = naive_bayes_classifier(new_point, data)

# Kết quả
print(f"The new point {new_point} belongs to class: {classification}")
print("Xác suất cho từng lớp:")
for cls, prob in probabilities.items():
    print(f"P({cls}|data) = {prob}")
