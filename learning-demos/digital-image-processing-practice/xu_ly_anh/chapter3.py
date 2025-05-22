import numpy as np
import cv2

L = 256


def Negative(imgin):
    imgout = L - 1 - imgin
    return imgout


def NegativeColor(imgin):
    M, N, C = imgin.shape
    imgout = np.zeros((M, N, C), np.uint8) + 255
    for x in range(0, M):
        for y in range(0, N):
            b = imgin[x, y, 0]
            g = imgin[x, y, 1]
            r = imgin[x, y, 2]

            b = L - 1 - b
            g = L - 1 - g
            r = L - 1 - r

            imgout[x, y, 0] = np.uint8(b)
            imgout[x, y, 1] = np.uint8(g)
            imgout[x, y, 2] = np.uint8(r)
    return imgout


def Logarit(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8) + 255
    c = (L - 1) / np.log(1.0 * L)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            if r == 0:
                r = 1
            s = c * np.log(1.0 + r)
            imgout[x, y] = np.uint8(s)
    return imgout


def Power(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8) + 255
    gamma = 5.0
    c = np.power(L - 1, 1 - gamma)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            s = c * np.power(r, gamma)
            imgout[x, y] = np.uint8(s)
    return imgout


def PiecewiseLinear(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8) + 255
    rmin, rmax, _, _ = cv2.minMaxLoc(imgin)
    r1 = rmin
    s1 = 0
    r2 = rmax
    s2 = L - 1
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            # Đoạn I
            if r < r1:
                s = s1 * r / r1
            # Đoạn II
            elif r < r2:
                s = (s2 - s1) * (r - r1) / (r2 - r1) + s1
            # Đoạn II
            else:
                s = (L - 1 - s2) * (r - r2) / (L - 1 - r2) + s2
            imgout[x, y] = np.uint8(s)
    return imgout


def Histogram(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, L), np.uint8) + 255
    h = np.zeros(L, np.int32)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            h[r] += 1
    p = h / (M * N)
    scale = 3000
    for r in range(0, L):
        cv2.line(imgout, (r, M - 1), (r, M - 1 - int(scale * p[r])), (0, 0, 0))
    return imgout


def HistEqual(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
    h = np.zeros(L, np.int32)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            h[r] = h[r] + 1
    p = h / (M * N)

    s = np.zeros(L, np.float32)
    for k in range(0, L):
        for j in range(0, k + 1):
            s[k] = s[k] + p[j]
        s[k] = (L - 1) * s[k]

    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            imgout[x, y] = np.uint8(s[r])
    return imgout
