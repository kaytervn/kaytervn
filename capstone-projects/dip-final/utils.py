import cv2
import numpy as np


def center_crop_resize(image, target_size):
    height, width = image.shape[:2]
    crop_size = min(height, width)
    y = (height - crop_size) // 2
    x = (width - crop_size) // 2
    cropped_image = image[y : y + crop_size, x : x + crop_size]
    resized_image = cv2.resize(cropped_image, target_size)
    return resized_image


def standardize_image(image, target_size):
    M, N, C = image.shape
    max_dim = max(M, N)
    image_out = np.zeros((max_dim, max_dim, C), np.uint8)
    image_out[:M, :N, :] = image[:, :, :]
    image_out = cv2.resize(image_out, target_size)
    return image_out


def standardize_image_gray(image, target_size):
    M, N = image.shape
    max_dim = max(M, N)
    image_out = np.zeros((max_dim, max_dim), np.uint8)
    image_out[:M, :N] = image[:, :]
    image_out = cv2.resize(image_out, target_size)
    return image_out
