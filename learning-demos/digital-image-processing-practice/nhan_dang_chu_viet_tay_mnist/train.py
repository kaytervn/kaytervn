import tensorflow as tf
from tensorflow.keras import datasets, layers, models, optimizers

EPOCHS = 30
BATCH_SIZE = 128
VERBOSE = 1
OPTIMIZER = tf.keras.optimizers.Adam()
VALIDATION_SPLIT = 0.2
IMG_ROWS, IMG_COLS = 28, 28  # input image dimensions
INPUT_SHAPE = (IMG_ROWS, IMG_COLS, 1)
NB_CLASSES = 10  # number of outputs = number of digits


# define the convnet
def build(input_shape, classes):
    model = models.Sequential()
    # CONV => RELU => POOL
    model.add(
        layers.Convolution2D(20, (5, 5), activation="relu", input_shape=input_shape)
    )
    model.add(layers.MaxPooling2D(pool_size=(2, 2), strides=(2, 2)))

    # CONV => RELU => POOL
    model.add(layers.Convolution2D(50, (5, 5), activation="relu"))
    model.add(layers.MaxPooling2D(pool_size=(2, 2), strides=(2, 2)))

    # Flatten => RELU layers
    model.add(layers.Flatten())
    model.add(layers.Dense(500, activation="relu"))
    # a softmax classifier
    model.add(layers.Dense(classes, activation="softmax"))
    return model


# data: shuffled and split between train and test sets
(X_train, y_train), (X_test, y_test) = datasets.mnist.load_data()

# reshape
X_train = X_train.reshape((60000, 28, 28, 1))
X_test = X_test.reshape((10000, 28, 28, 1))

# normalize
X_train, X_test = X_train / 255.0, X_test / 255.0

# cast
X_train = X_train.astype("float32")
X_test = X_test.astype("float32")

# convert class vectors to binary class matrices
y_train = tf.keras.utils.to_categorical(y_train, NB_CLASSES)
y_test = tf.keras.utils.to_categorical(y_test, NB_CLASSES)
# initialize the optimizer and model
model = build(input_shape=INPUT_SHAPE, classes=NB_CLASSES)
model.compile(
    loss="categorical_crossentropy", optimizer=OPTIMIZER, metrics=["accuracy"]
)
model.summary()
model.fit(
    X_train,
    y_train,
    batch_size=BATCH_SIZE,
    epochs=EPOCHS,
    verbose=VERBOSE,
    validation_split=VALIDATION_SPLIT,
)

score = model.evaluate(X_test, y_test, verbose=VERBOSE)
print("\nTest score:", score[0])
print("Test accuracy:", score[1])

# save to disk
model_json = model.to_json()
with open("digit_config.json", "w") as json_file:
    json_file.write(model_json)
model.save_weights("digit_weight.h5")
