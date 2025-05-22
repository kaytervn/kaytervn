import tensorflow as tf
from tensorflow.keras import datasets, models, optimizers
import cv2
import numpy as np

OPTIMIZER = tf.keras.optimizers.Adam()

# load model
model_architecture = "../digit_config.json"
model_weights = "../digit_weight.h5"
model = models.model_from_json(open(model_architecture).read())
model.load_weights(model_weights)

model.compile(
    loss="categorical_crossentropy", optimizer=OPTIMIZER, metrics=["accuracy"]
)


imgin = cv2.imread("ChuSoReSize.jpg", cv2.IMREAD_GRAYSCALE)
val, temp = cv2.threshold(imgin, 200, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
print("val", val)
# cv2.imshow('Temp', temp)

dem, label = cv2.connectedComponents(temp)

a = np.zeros(dem, np.int32)
M, N = label.shape
for x in range(0, M):
    for y in range(0, N):
        r = label[x, y]
        a[r] = a[r] + 1

max = max(a[1:])
nguong = max // 10

"""
imgout = np.zeros((M, N), np.uint8)
for x in range(0, M):
    for y in range(0, N):
        r = label[x,y]
        if r > 0:
            if a[r] > nguong:
                imgout[x,y] = 255
 
cv2.imshow('imgout', imgout)
cv2.imwrite('imgout.bmp', imgout)
dem, label = cv2.connectedComponents(imgout)
print(dem)
"""
imgout = np.zeros((M, N), np.uint8)
k = 1
for r in range(1, dem):
    if a[r] > nguong:
        xmin = M - 1
        ymin = N - 1
        xmax = 0
        ymax = 0
        for x in range(0, M):
            for y in range(0, N):
                if label[x, y] == r:
                    if x < xmin:
                        xmin = x
                    if y < ymin:
                        ymin = y

                    if x > xmax:
                        xmax = x
                    if y > ymax:
                        ymax = y
                    imgout[x, y] = 255
        word = imgout[xmin : xmax + 1, ymin : ymax + 1]
        print("k =", k)
        k = k + 1
        m, n = word.shape
        if m > n:
            word_vuong = np.zeros((m, m), np.uint8)
            word_vuong[0:m, 0:n] = word
        elif n > m:
            word_vuong = np.zeros((n, n), np.uint8)
            word_vuong[0:m, 0:n] = word
        else:
            word_vuong = word.copy()

        word_vuong = cv2.resize(word_vuong, (20, 20))
        word = np.zeros((28, 28), np.uint8)
        word[0:20, 0:20] = word_vuong
        # có thể phân word ngưỡng rồi tính trọng tâm
        val, word = cv2.threshold(word, 128, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        moments = cv2.moments(word)
        cx = int(moments["m10"] / moments["m00"])
        cy = int(moments["m01"] / moments["m00"])
        xc = 14
        yc = 14
        word_vuong = np.zeros((28, 28), np.uint8)
        for x in range(0, 28):
            for y in range(0, 28):
                r = word[x, y]
                if r > 0:
                    dy = xc - cx
                    dx = yc - cy
                    x_moi = x + dx
                    y_moi = y + dy
                    if x_moi < 0:
                        x_moi = 0
                    if x_moi > 28 - 1:
                        x_moi = 28 - 1
                    if y_moi < 0:
                        y_moi = 0
                    if y_moi > 28 - 1:
                        y_moi = 28 - 1
                    word_vuong[x_moi, y_moi] = r

        sample = word_vuong / 255.0
        sample = sample.astype("float32")
        sample = np.expand_dims(sample, axis=0)
        sample = np.expand_dims(sample, axis=3)
        ket_qua = model.predict(sample, verbose=0)
        chu_so = np.argmax(ket_qua[0])
        print("Kết quả nhận dạng là:", chu_so)

        cv2.imshow("word", word_vuong)
        cv2.waitKey(0)
        cv2.destroyWindow("word")
