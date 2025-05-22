import time
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
)
import pandas as pd

# Load dữ liệu Iris
iris = load_iris()
X = iris.data
y = iris.target
feature_names = iris.feature_names
target_names = iris.target_names

# Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Chuẩn hóa dữ liệu
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


def evaluate_model(model, X_train, y_train, X_test, y_test, model_name, params=None):
    start_time = time.time()
    model.fit(X_train, y_train)
    end_time = time.time()
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="macro")
    recall = recall_score(y_test, y_pred, average="macro")
    f1 = f1_score(y_test, y_pred, average="macro")
    training_time = end_time - start_time
    results = {
        "model": model_name,
        "training_time": training_time,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
    }
    if params:
        results.update(params)
    return results


# Huấn luyện và đánh giá LDA
lda = LinearDiscriminantAnalysis()
lda_results = evaluate_model(lda, X_train_scaled, y_train, X_test_scaled, y_test, "LDA")


# Huấn luyện và đánh giá SVM (Linear Kernel)
param_grid = {"C": [0.1, 1, 10]}
svm_linear = GridSearchCV(
    SVC(kernel="linear"), param_grid, cv=5, return_train_score=True
)
svm_linear.fit(X_train_scaled, y_train)
results_linear = []
for params, mean_score, scores in zip(
    svm_linear.cv_results_["params"],
    svm_linear.cv_results_["mean_test_score"],
    svm_linear.cv_results_["std_test_score"],
):
    results_linear.append(
        evaluate_model(
            SVC(kernel="linear", **params),
            X_train_scaled,
            y_train,
            X_test_scaled,
            y_test,
            "SVM (Linear Kernel)",
            params,
        )
    )


# Huấn luyện và đánh giá SVM (RBF Kernel)
param_grid = {"C": [0.1, 1, 10], "gamma": [0.1, 0.01, 0.001]}
svm_rbf = GridSearchCV(SVC(kernel="rbf"), param_grid, cv=5, return_train_score=True)
svm_rbf.fit(X_train_scaled, y_train)
results_rbf = []
for params, mean_score, scores in zip(
    svm_rbf.cv_results_["params"],
    svm_rbf.cv_results_["mean_test_score"],
    svm_rbf.cv_results_["std_test_score"],
):
    results_rbf.append(
        evaluate_model(
            SVC(kernel="rbf", **params),
            X_train_scaled,
            y_train,
            X_test_scaled,
            y_test,
            "SVM (RBF Kernel)",
            params,
        )
    )


# Tạo DataFrame từ kết quả
df_linear = pd.DataFrame(results_linear)
df_rbf = pd.DataFrame(results_rbf)

print("\n--- LDA ---")
print(pd.DataFrame([lda_results]))

print("\n--- SVM Linear ---")
print(df_linear)

print("\n--- SVM RBF ---")
print(df_rbf)
