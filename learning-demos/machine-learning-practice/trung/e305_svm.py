import numpy as np

def calculate_hyperplane_params(X, y, alpha):
    """Calculate w and b parameters for the SVM hyperplane."""
    # Calculate w
    w = np.zeros(2)
    for i in range(len(X)):
        if alpha[i] > 0:  # Only consider support vectors
            w += alpha[i] * y[i] * X[i]
    
    # Find support vectors (points where alpha > 0)
    support_vectors = []
    for i in range(len(X)):
        if alpha[i] > 0:
            support_vectors.append((X[i], y[i]))
    
    # Calculate b using first support vector
    sv_x, sv_y = support_vectors[0]
    b = sv_y - np.dot(w, sv_x)
    
    return w, b

def calculate_distance(point, w, b):
    """Calculate distance from a point to the hyperplane."""
    # Distance = |wx + b| / ||w||
    return abs(np.dot(w, point) + b) / np.linalg.norm(w)

def classify_point(point, w, b):
    """Classify a point using the hyperplane."""
    return np.sign(np.dot(w, point) + b)

# Define the dataset
X = np.array([
    [4, 2.9],    # x1
    [4, 4],      # x2
    [1, 2.5],    # x3
    [2.5, 1],    # x4
    [4.9, 4.5],  # x5
    [1.9, 1.9],  # x6
    [3.5, 4],    # x7
    [0.5, 1.5],  # x8
    [2, 2.1],    # x9
    [4.5, 2.5]   # x10
])

y = np.array([1, 1, -1, -1, 1, -1, 1, -1, -1, 1])
alpha = np.array([0.414, 0, 0, 0.018, 0, 0, 0.018, 0, 0.414, 0])

# Calculate hyperplane parameters
w, b = calculate_hyperplane_params(X, y, alpha)

print("Hyperplane equation: h(x) = {:.4f}x₁ + {:.4f}x₂ + {:.4f}".format(w[0], w[1], b))

# Calculate distance for x6
x6 = X[5]
distance_x6 = calculate_distance(x6, w, b)
margin = 1/np.linalg.norm(w)
print("\nAnalysis for x6:")
print("Distance from hyperplane: {:.4f}".format(distance_x6))
print("Margin: {:.4f}".format(margin))
print("Is x6 within margin?", distance_x6 <= margin)

# Classify z=(3,3)
z = np.array([3, 3])
z_value = np.dot(w, z) + b
print("\nAnalysis for z=(3,3):")
print("h(z) = {:.4f}".format(z_value))
print("Classification:", "Class +1" if z_value > 0 else "Class -1")

# Optional: Visualize the results
try:
    import matplotlib.pyplot as plt
    
    plt.figure(figsize=(10, 8))
    
    # Plot points
    for i in range(len(X)):
        color = 'blue' if y[i] == 1 else 'red'
        marker = 'o' if alpha[i] > 0 else 'x'  # Different marker for support vectors
        plt.scatter(X[i,0], X[i,1], c=color, marker=marker)
    
    # Plot z point
    plt.scatter(z[0], z[1], c='green', marker='s', label='z=(3,3)')
    
    # Plot hyperplane
    x1_min, x1_max = X[:,0].min() - 1, X[:,0].max() + 1
    x2 = (-w[0] * np.array([x1_min, x1_max]) - b) / w[1]
    plt.plot([x1_min, x1_max], x2, 'k-', label='Hyperplane')
    
    # Plot margins
    margin_offset = margin * np.linalg.norm(w)
    x2_upper = (-(w[0] * np.array([x1_min, x1_max]) + b + margin_offset)) / w[1]
    x2_lower = (-(w[0] * np.array([x1_min, x1_max]) + b - margin_offset)) / w[1]
    plt.plot([x1_min, x1_max], x2_upper, 'k--', label='Margin')
    plt.plot([x1_min, x1_max], x2_lower, 'k--')
    
    plt.xlabel('x₁')
    plt.ylabel('x₂')
    plt.legend()
    plt.grid(True)
    plt.title('SVM Classification Results')
    plt.axis('equal')
    
except ImportError:
    print("\nNote: Install matplotlib to see visualization")