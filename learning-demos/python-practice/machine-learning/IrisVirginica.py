import numpy as np
from sklearn import datasets

iris = datasets.load_iris()
list(iris.keys())
["data", "target", "target_names", "DESCR", "feature_names", "filename"]
X = iris["data"][:, 3:]  # petal width
y = (iris["target"] == 2).astype(np.int)  # 1 if Iris virginica, else 0
