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
sample = X_test[2000]
cv2.imshow("Digit", sample)

# normalize
sample = sample / 255.0

# cast
sample = sample.astype("float32")

# add dimension to image head
sample = np.expand_dims(sample, axis=0)

ket_qua = model.predict(sample, verbose=0)
chu_so = np.argmax(ket_qua[0])
print("Kết quả nhận dạng là: ", chu_so)

cv2.waitKey(0)
