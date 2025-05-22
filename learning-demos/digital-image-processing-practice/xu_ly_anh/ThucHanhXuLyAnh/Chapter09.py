import cv2
import numpy as np

L = 256


def Erosion(imgin, imgout):
    w = cv2.getStructuringElement(cv2.MORPH_RECT, (45, 45))
    cv2.erode(imgin, w, imgout)


def Dilation(imgin, imgout):
    w = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    cv2.dilate(imgin, w, imgout)


def OpeningClosing(imgin, imgout):
    w = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    temp = cv2.morphologyEx(imgin, cv2.MORPH_OPEN, w)
    cv2.morphologyEx(temp, cv2.MORPH_CLOSE, w, imgout)


def Boundary(imgin):
    w = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    temp = cv2.erode(imgin, w)
    imgout = imgin - temp
    return imgout


def HoleFill(imgin):
    imgout = imgin
    M, N = imgout.shape
    mask = np.zeros((M + 2, N + 2), np.uint8)
    cv2.floodFill(imgout, mask, (105, 297), L - 1)
    return imgout


def MyConnectedComponent(imgin):
    ret, temp = cv2.threshold(imgin, 200, L - 1, cv2.THRESH_BINARY)
    temp = cv2.medianBlur(temp, 7)
    M, N = temp.shape
    dem = 0
    color = 150
    for x in range(0, M):
        for y in range(0, N):
            if temp[x, y] == L - 1:
                mask = np.zeros((M + 2, N + 2), np.uint8)
                cv2.floodFill(temp, mask, (y, x), (color, color, color))
                dem = dem + 1
                color = color + 1
    print("Co %d thanh phan lien thong" % dem)
    a = np.zeros(L, np.int64)
    for x in range(0, M):
        for y in range(0, N):
            r = temp[x, y]
            if r > 0:
                a[r] = a[r] + 1
    dem = 1
    for r in range(0, L):
        if a[r] > 0:
            print("%4d   %5d" % (dem, a[r]))
            dem = dem + 1
    return temp


def ConnectedComponent(imgin):
    ret, temp = cv2.threshold(imgin, 200, L - 1, cv2.THRESH_BINARY)
    temp = cv2.medianBlur(temp, 7)
    dem, label = cv2.connectedComponents(temp)
    text = "Co %d thanh phan lien thong" % (dem - 1)
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
    ret, temp = cv2.threshold(temp, 100, L - 1, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    temp = cv2.medianBlur(temp, 3)
    dem, label = cv2.connectedComponents(temp)
    text = "Co %d hat gao" % (dem - 1)
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
    rmax = 1
    for r in range(2, dem):
        if a[r] > max:
            max = a[r]
            rmax = r

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
