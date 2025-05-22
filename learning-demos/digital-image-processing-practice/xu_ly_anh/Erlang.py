import cv2
import numpy as np
import math

M = 480
L = 256
imgin = np.zeros((M, L), np.uint8) + 255
imgout = np.zeros((M, L), np.uint8) + 255

a = 0.032
b = 3
p = np.zeros(L, np.float32)
for v in range(0, L - 1):
    p[v] = (
        math.pow(a, b) * math.pow(v, b - 1) * math.exp(-a * v) / math.factorial(b - 1)
    )
    print("%.10f" % p[v])

print("max = ", np.max(p))
print("vi tri max = ", np.argmax(p))
print("sum = ", np.sum(p))
scale = 10000
for v in range(0, L - 1):
    cv2.line(imgin, (v, M - 1), (v, M - 1 - int(scale * p[v])), (0, 0, 0))
cv2.imshow("Erlang", imgin)

q = np.zeros(L, np.float32)
for v in range(0, L - 1):
    z = L - 1 - v
    q[z] = p[v]

for z in range(0, L - 1):
    cv2.line(imgout, (z, M - 1), (z, M - 1 - int(scale * q[z])), (0, 0, 0))
cv2.imshow("ErlangFlip", imgout)
cv2.waitKey(0)
