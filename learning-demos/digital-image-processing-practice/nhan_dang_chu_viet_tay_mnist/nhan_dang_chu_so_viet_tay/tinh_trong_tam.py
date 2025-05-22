import cv2
import numpy as np

imgin = cv2.imread("ChuSo.bmp", cv2.IMREAD_GRAYSCALE)
M, N = imgin.shape
val, temp = cv2.threshold(imgin, 128, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# Ảnh temp là ảnh trắng đen (ảnh nhị phân)
# Tính trọng tâm
moments = cv2.moments(temp)
cx = int(moments["m10"] / moments["m00"])
cy = int(moments["m01"] / moments["m00"])
# cv2.circle(temp, (cx, cy), 3, (255, 255, 255), -1)

xc = N // 2
yc = M // 2
imgout = np.zeros((M, N), np.uint8)

for x in range(0, M):
    for y in range(0, N):
        r = temp[x, y]
        if r > 0:
            dx = xc - cx
            dy = yc - cy
            x_moi = x + dx
            y_moi = y + dy
            if x_moi < 0:
                x_moi = 0
            if x_moi > M - 1:
                x_moi = M - 1
            if y_moi < 0:
                y_moi = 0
            if y_moi > N - 1:
                y_moi = N - 1
            imgout[x_moi, y_moi] = r

cv2.imshow("Nguong", temp)
cv2.imshow("Imgout", imgout)
cv2.waitKey()
