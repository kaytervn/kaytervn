import cv2 as cv
import time

camera_device = 0
# -- 2. Read the video stream
cap = cv.VideoCapture(camera_device)
if not cap.isOpened:
    print("--(!)Error opening video capture")
    exit(0)
while True:
    ret, frame = cap.read()
    if frame is None:
        print("--(!) No captured frame -- Break!")
        break
    cv.imshow("Video", frame)
    # Mã ASCII của ESC là 27
    key = cv.waitKey(10)
    if key == 27:
        break
    if key == ord("s") or key == ord("S"):
        t = time.localtime()
        filename = (
            "XuLyAnhSo\co_ban\screenshot\image_%04d_%02d_%02d_%02d_%02d_%02d.jpg"
            % (
                t.tm_year,
                t.tm_mon,
                t.tm_mday,
                t.tm_hour,
                t.tm_min,
                t.tm_sec,
            )
        )
        cv.imwrite(filename, frame)
