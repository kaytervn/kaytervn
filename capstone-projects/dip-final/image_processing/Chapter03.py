import numpy as np
import cv2

L = 256


def Negative(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            s = L - 1 - r
            imgout[x, y] = s
    return imgout


def Logarit(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
    c = (L - 1) / np.log(L)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            if r == 0:
                r = 1
            s = c * np.log(1 + r)
            imgout[x, y] = np.uint8(s)
    return imgout


def Power(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
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
    imgout = np.zeros((M, N), np.uint8)
    rmin, rmax, _, _ = cv2.minMaxLoc(imgin)
    if rmin == rmax:
        imgout[:] = rmin
        return imgout
    r1 = rmin
    s1 = 0
    r2 = rmax
    s2 = L - 1
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            if r <= r1:
                s = s1
            elif r >= r2:
                s = s2
            else:
                s = int((s2 - s1) * (r - r1) / (r2 - r1) + s1)
            imgout[x, y] = np.uint8(s)
    return imgout


def Histogram(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, L), np.uint8) + 255
    h = np.zeros(L, np.int32)
    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            h[r] = h[r] + 1
    p = h / (M * N)
    scale = 2000
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

    s = np.zeros(L, np.float64)
    for k in range(0, L):
        for j in range(0, k + 1):
            s[k] = s[k] + p[j]

    for x in range(0, M):
        for y in range(0, N):
            r = imgin[x, y]
            imgout[x, y] = np.uint8((L - 1) * s[r])
    return imgout


def HistEqualColor(imgin):
    B = imgin[:, :, 0]
    G = imgin[:, :, 1]
    R = imgin[:, :, 2]
    B = cv2.equalizeHist(B)
    G = cv2.equalizeHist(G)
    R = cv2.equalizeHist(R)
    imgout = np.array([B, G, R])
    imgout = np.transpose(imgout, axes=[1, 2, 0])
    return imgout


def LocalHist(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
    m = 3
    n = 3
    w = np.zeros((m, n), np.uint8)
    a = m // 2
    b = n // 2
    for x in range(a, M - a):
        for y in range(b, N - b):
            for s in range(-a, a + 1):
                for t in range(-b, b + 1):
                    w[s + a, t + b] = imgin[x + s, y + t]
            w = cv2.equalizeHist(w)
            imgout[x, y] = w[a, b]
    return imgout


def HistStat(imgin):
    M, N = imgin.shape
    imgout = np.zeros((M, N), np.uint8)
    m = 3
    n = 3
    w = np.zeros((m, n), np.uint8)
    a = m // 2
    b = n // 2
    mG, sigmaG = cv2.meanStdDev(imgin)
    C = 22.8
    k0 = 0.0
    k1 = 0.1
    k2 = 0.0
    k3 = 0.1
    for x in range(a, M - a):
        for y in range(b, N - b):
            for s in range(-a, a + 1):
                for t in range(-b, b + 1):
                    w[s + a, t + b] = imgin[x + s, y + t]
            msxy, sigmasxy = cv2.meanStdDev(w)
            r = imgin[x, y]
            if (k0 * mG <= msxy <= k1 * mG) and (
                k2 * sigmaG <= sigmasxy <= k3 * sigmaG
            ):
                imgout[x, y] = np.uint8(C * r)
            else:
                imgout[x, y] = r
    return imgout


def BoxFilter(imgin):
    m = 21
    n = 21
    w = np.ones((m, n))
    w = w / (m * n)
    imgout = cv2.filter2D(imgin, cv2.CV_8UC1, w)
    return imgout


def Threshold(imgin):
    temp = cv2.blur(imgin, (15, 15))
    _, imgout = cv2.threshold(temp, 64, 255, cv2.THRESH_BINARY)
    return imgout


def LowpassGauss(imgin):
    imgout = cv2.GaussianBlur(imgin, (43, 43), 7.0)
    return imgout


def MedianFilter(imgin):
    imgout = cv2.medianBlur(imgin, 7)
    return imgout


def Sharpen(imgin):
    # Đạo hàm cấp 2 của ảnh
    w = np.array([[1, 1, 1], [1, -8, 1], [1, 1, 1]])
    temp = cv2.filter2D(imgin, cv2.CV_32FC1, w)

    # Hàm cv2.Laplacian chỉ tính đạo hàm cấp 2
    # cho bộ lọc có số -4 chính giữa
    imgout = imgin - temp
    imgout = np.clip(imgout, 0, L - 1)
    imgout = imgout.astype(np.uint8)
    return imgout


def Gradient(imgin):
    sobel_x = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    sobel_y = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])

    # Đạo hàm cấp 1 theo hướng x
    mygx = cv2.filter2D(imgin, cv2.CV_32FC1, sobel_x)
    # Đạo hàm cấp 1 theo hướng y
    mygy = cv2.filter2D(imgin, cv2.CV_32FC1, sobel_y)

    # Lưu ý: cv2.Sobel có hướng x nằm ngang
    # ngược lại với sách Digital Image Processing
    gx = cv2.Sobel(imgin, cv2.CV_32FC1, dx=1, dy=0)
    gy = cv2.Sobel(imgin, cv2.CV_32FC1, dx=0, dy=1)

    imgout = abs(gx) + abs(gy)
    imgout = np.clip(imgout, 0, L - 1)
    imgout = imgout.astype(np.uint8)
    return imgout
