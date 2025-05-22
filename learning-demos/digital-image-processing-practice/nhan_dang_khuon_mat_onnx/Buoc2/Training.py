import numpy as np
import os.path
import cv2
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import joblib

from sklearn.metrics import f1_score, accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import LinearSVC
from sklearn.manifold import TSNE


class IdentityMetadata:
    def __init__(self, base, name, file):
        # dataset base directory
        self.base = base
        # identity name
        self.name = name
        # image file name
        self.file = file

    def __repr__(self):
        return self.image_path()

    def image_path(self):
        return os.path.join(self.base, self.name, self.file)


def load_metadata(path):
    metadata = []
    for i in sorted(os.listdir(path)):
        for f in sorted(os.listdir(os.path.join(path, i))):
            # Check file extension. Allow only jpg/jpeg' files.
            ext = os.path.splitext(f)[1]
            if ext == ".jpg" or ext == ".jpeg" or ext == ".bmp":
                metadata.append(IdentityMetadata(path, i, f))
    return np.array(metadata)


def load_image(path):
    img = cv2.imread(path, 1)
    # OpenCV loads images with color channels
    # in BGR order. So we need to reverse them
    return img[..., ::-1]


def align_image(img):
    pass


def distance(emb1, emb2):
    return np.sum(np.square(emb1 - emb2))


def show_pair(idx1, idx2):
    plt.figure(figsize=(8, 3))
    plt.suptitle(f"Distance = {distance(embedded[idx1], embedded[idx2]):.2f}")
    plt.subplot(121)
    plt.imshow(load_image(metadata[idx1].image_path()))
    plt.subplot(122)
    plt.imshow(load_image(metadata[idx2].image_path()))


detector = cv2.FaceDetectorYN.create(
    "../model/face_detection_yunet_2023mar.onnx", "", (320, 320), 0.9, 0.3, 5000
)
detector.setInputSize((320, 320))

recognizer = cv2.FaceRecognizerSF.create(
    "../model/face_recognition_sface_2021dec.onnx", ""
)


metadata = load_metadata("../image")

embedded = np.zeros((metadata.shape[0], 128))

for i, m in enumerate(metadata):
    print(m.image_path())
    img = cv2.imread(m.image_path(), cv2.IMREAD_COLOR)
    face_feature = recognizer.feature(img)
    embedded[i] = face_feature

targets = np.array([m.name for m in metadata])

encoder = LabelEncoder()
encoder.fit(targets)

# Numerical encoding of identities
y = encoder.transform(targets)

train_idx = np.arange(metadata.shape[0]) % 5 != 0
test_idx = np.arange(metadata.shape[0]) % 5 == 0
X_train = embedded[train_idx]
X_test = embedded[test_idx]
y_train = y[train_idx]
y_test = y[test_idx]

svc = LinearSVC()
svc.fit(X_train, y_train)
acc_svc = accuracy_score(y_test, svc.predict(X_test))
print("SVM accuracy: %.6f" % acc_svc)
joblib.dump(svc, "../model/svc.pkl")
