import cv2
import numpy as np

L = 256


def ConnectedComponent(imgin):
    _, temp = cv2.threshold(imgin, 200, L - 1, cv2.THRESH_BINARY)
    temp = cv2.medianBlur(temp, 7)
    dem, label = cv2.connectedComponents(temp)
    text = "There are %d connected components." % (dem - 1)
    print(text)

    a = np.zeros(dem, np.int64)
    M, N = label.shape
    color = 150
    for x in range(0, M):
        for y in range(0, N):
            r = label[x, y]
            a[r] = a[r] + 1
            if r > 0:
                label[x, y] = label[x, y] + color

    for r in range(1, dem):
        print("%4d %10d" % (r, a[r]))
    label = label.astype(np.uint8)
    cv2.putText(label, text, (1, 25), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    return label


def CountRice(imgin):
    w = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (81, 81))
    temp = cv2.morphologyEx(imgin, cv2.MORPH_TOPHAT, w)
    _, temp = cv2.threshold(temp, 100, L - 1, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    temp = cv2.medianBlur(temp, 3)
    dem, label = cv2.connectedComponents(temp)
    text = "There are %d grains of rice." % (dem - 1)
    print(text)
    a = np.zeros(dem, np.int64)
    M, N = label.shape
    color = 150
    for x in range(0, M):
        for y in range(0, N):
            r = label[x, y]
            a[r] = a[r] + 1
            if r > 0:
                label[x, y] = label[x, y] + color

    for r in range(0, dem):
        print("%4d %10d" % (r, a[r]))

    max = a[1]
    for r in range(2, dem):
        if a[r] > max:
            max = a[r]

    xoa = np.array([], np.int64)
    for r in range(1, dem):
        if a[r] < 0.5 * max:
            xoa = np.append(xoa, r)

    for x in range(0, M):
        for y in range(0, N):
            r = label[x, y]
            if r > 0:
                r = r - color
                if r in xoa:
                    label[x, y] = 0
    label = label.astype(np.uint8)
    cv2.putText(label, text, (1, 25), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    return label
