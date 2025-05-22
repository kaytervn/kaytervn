import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix

# Load dữ liệu Iris và chọn 2 features đầu tiên
iris = load_iris()
X = iris.data[:, :2]
y = iris.target
feature_names = iris.feature_names[:2]

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Chuẩn hóa dữ liệu
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Huấn luyện các mô hình (với siêu tham số đã chọn)
lda = LinearDiscriminantAnalysis()
lda.fit(X_train_scaled, y_train)

svm_linear = SVC(kernel="linear", C=1)
svm_linear.fit(X_train_scaled, y_train)

svm_rbf = SVC(kernel="rbf", C=10, gamma=0.1)
svm_rbf.fit(X_train_scaled, y_train)


# Hàm vẽ decision boundary và confusion matrix
def plot_results(X_train, y_train, X_test, y_test, clf, title):
    x_min, x_max = X_train[:, 0].min() - 1, X_train[:, 0].max() + 1
    y_min, y_max = X_train[:, 1].min() - 1, X_train[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
    Z = clf.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    cmap_light = ListedColormap(["#FFAAAA", "#AAFFAA", "#AAAAFF"])
    cmap_bold = ListedColormap(["#FF0000", "#00FF00", "#0000FF"])

    plt.figure(figsize=(14, 6))  # Tăng kích thước hình

    plt.subplot(1, 2, 1)
    plt.contourf(xx, yy, Z, cmap=cmap_light)
    plt.scatter(X_train[:, 0], X_train[:, 1], c=y_train, cmap=cmap_bold, edgecolor="k")
    plt.xlabel(feature_names[0])
    plt.ylabel(feature_names[1])
    plt.title(title)

    plt.subplot(1, 2, 2)
    cm = confusion_matrix(y_test, clf.predict(X_test))
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title("Confusion Matrix")
    plt.colorbar()

    plt.tight_layout()
    plt.show()


# Vẽ kết quả cho các mô hình
plot_results(
    X_train_scaled, y_train, X_test_scaled, y_test, lda, "LDA Decision Boundary"
)
plot_results(
    X_train_scaled,
    y_train,
    X_test_scaled,
    y_test,
    svm_linear,
    "SVM (Linear Kernel) Decision Boundary",
)
plot_results(
    X_train_scaled,
    y_train,
    X_test_scaled,
    y_test,
    svm_rbf,
    "SVM (RBF Kernel) Decision Boundary",
)
