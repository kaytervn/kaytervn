import tensorflow as tf
from tensorflow.keras import datasets, models, optimizers
import cv2
import numpy as np

OPTIMIZER = tf.keras.optimizers.Adam()

# load model
model_architecture = "digit_config.json"
model_weights = "digit_weight.h5"
model = models.model_from_json(open(model_architecture).read())
model.load_weights(model_weights)

model.compile(
    loss="categorical_crossentropy", optimizer=OPTIMIZER, metrics=["accuracy"]
)
# model.summary()

# data: shuffled and split between train and test sets
(_, _), (X_test, _) = datasets.mnist.load_data()

# reshape
X_test = X_test.reshape((10000, 28, 28, 1))

# Tạo 100 số nguyên ngẫu nhiên nằm trong phạm vi [0, 9999]
index = np.random.randint(0, 9999, 100)
sample = np.zeros((100, 28, 28, 1))
for i in range(0, 100):
    sample[i] = X_test[index[i]]

# Tạo ảnh để xem
image = np.zeros((10 * 28, 10 * 28), np.uint8)
k = 0
for i in range(0, 10):
    for j in range(0, 10):
        image[i * 28 : (i + 1) * 28, j * 28 : (j + 1) * 28] = sample[k, :, :, 0]
        k += 1

cv2.imshow("Image", image)

# normalize
data = sample / 255.0

# cast
data = data.astype("float32")

ket_qua = model.predict(data, verbose=0)
chu_so = []
for i in range(0, 100):
    x = np.argmax(ket_qua[i])
    chu_so.append(x)

dem = 0
for x in chu_so:
    print("%d " % x, end=" ")
    dem += 1
    if dem % 10 == 0:
        print()

cv2.waitKey(0)
