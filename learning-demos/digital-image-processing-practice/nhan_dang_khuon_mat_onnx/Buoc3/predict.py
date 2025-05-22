import numpy as np
import cv2 as cv
import joblib

face_detection_model = "../model/face_detection_yunet_2023mar.onnx"
face_recognition_model = "../model/face_recognition_sface_2021dec.onnx"
score_threshold = 0.9
nms_threshold = 0.3
top_k = 5000

svc = joblib.load("../model/svc.pkl")
mydict = ["DucTrong", "HuuTai", "ThanhLoi", "TrongDung", "VanTrung"]


def visualize(input, faces, fps, thickness=2):
    if faces[1] is not None:
        for face in faces[1]:
            if checkValidFace(input, face) is not None:
                color = (0, 255, 0)
            else:
                color = (0, 0, 255)
            coords = face[:-1].astype(np.int32)
            cv.rectangle(
                input,
                (coords[0], coords[1]),
                (coords[0] + coords[2], coords[1] + coords[3]),
                color,
                thickness,
            )
            cv.circle(input, (coords[4], coords[5]), 2, (255, 0, 0), thickness)
            cv.circle(input, (coords[6], coords[7]), 2, (0, 0, 255), thickness)
            cv.circle(input, (coords[8], coords[9]), 2, (0, 255, 0), thickness)
            cv.circle(input, (coords[10], coords[11]), 2, (255, 0, 255), thickness)
            cv.circle(input, (coords[12], coords[13]), 2, (0, 255, 255), thickness)
    cv.putText(
        input,
        "FPS: {:.2f}".format(fps),
        (1, 16),
        cv.FONT_HERSHEY_SIMPLEX,
        0.5,
        (0, 255, 0),
        2,
    )


def checkValidFace(frame, face_box):
    face_align = recognizer.alignCrop(frame, face_box)
    face_feature = recognizer.feature(face_align)
    test_predict = svc.predict(face_feature)
    confidence = np.max(np.abs(svc.decision_function(face_feature)))
    if confidence > nms_threshold:
        return test_predict
    else:
        return None


if __name__ == "__main__":
    recognizer = cv.FaceRecognizerSF.create(face_recognition_model, "")

    tm = cv.TickMeter()

    cap = cv.VideoCapture(0)

    frameWidth = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
    frameHeight = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
    detector = cv.FaceDetectorYN.create(
        face_detection_model,
        "",
        (frameWidth, frameHeight),
        score_threshold,
        nms_threshold,
        top_k,
    )
    detector.setInputSize([frameWidth, frameHeight])

    while True:
        _, frame = cap.read()

        tm.start()
        faces = detector.detect(frame)
        tm.stop()

        key = cv.waitKey(1)
        if key == 27:
            break
        if faces[1] is not None:
            for face_box in faces[1]:
                test_predict = checkValidFace(frame, face_box)
                if test_predict is not None:
                    result = mydict[test_predict[0]]
                    color = (0, 255, 0)
                else:
                    result = "Unknown"
                    color = (0, 0, 255)
                cv.putText(
                    frame,
                    result,
                    (int(face_box[0]), int(face_box[1]) - 10),
                    cv.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    color,
                    2,
                )
        visualize(frame, faces, tm.getFPS())
        cv.imshow("Live", frame)
    cv.destroyAllWindows()
