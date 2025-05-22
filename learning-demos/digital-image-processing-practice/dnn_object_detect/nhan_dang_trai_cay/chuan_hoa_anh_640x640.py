import cv2
import numpy as np
import os

folder_name = "thom"
image_path_in = (
    "D:/OTHER_DOCUMENTS/Github/Python_Programming_Notes/XuLyAnhSo/dnn_object_detect/nhan_dang_trai_cay/trai_cay/"
    + folder_name
    + "/"
)
image_path_out = (
    "D:/OTHER_DOCUMENTS/Github/Python_Programming_Notes/XuLyAnhSo/dnn_object_detect/nhan_dang_trai_cay/trai_cay_640x640/"
    + folder_name
    + "/"
)

lst_image_in = os.listdir(image_path_in)
dem = 0
for filename in lst_image_in:
    fullname = image_path_in + filename
    image_in = cv2.imread(fullname, cv2.IMREAD_COLOR)
    M, N, C = image_in.shape
    if M < N:
        image_out = np.zeros((N, N, C), np.uint8) + 255
        image_out[0:M, :, :] = image_in[:, :, :]
    elif M > N:
        image_out = np.zeros((M, M, C), np.uint8) + 255
        image_out[:, 0:N, :] = image_in[:, :, :]
    else:
        image_out = image_in.copy()
    image_out = cv2.resize(image_out, (640, 640))
    fullname_out = image_path_out + folder_name + "_%04d.jpg" % dem
    print(fullname_out)
    dem += 1
    cv2.imwrite(fullname_out, image_out)
