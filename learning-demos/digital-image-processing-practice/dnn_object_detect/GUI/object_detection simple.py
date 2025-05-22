import cv2 as cv
import numpy as np

model = "road_signs.onnx"
filename_classes = "road_signs.txt"
input_image = "test/road_sign.jpg"
inpWidth, inpHeight = 640, 640
confThreshold, nmsThreshold = 0.5, 0.4


def postprocess(frame, outs, classes, confThreshold, nmsThreshold):
    frameHeight, frameWidth = frame.shape[:2]
    box_scale = (frameWidth / inpWidth, frameHeight / inpHeight)

    detections = []
    for out in outs:
        detections.extend(process_output(out[0], box_scale, confThreshold))

    if detections:
        classIds, confidences, boxes = zip(*detections)
        indices = cv.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)

        for i in indices.flatten():
            box = boxes[i]
            left, top, width, height = box
            drawPred(
                frame,
                classIds[i],
                confidences[i],
                left,
                top,
                left + width,
                top + height,
                classes,
            )


def process_output(out, box_scale, confThreshold):
    detections = []
    for detection in out.transpose(1, 0):
        scores = detection[4:]
        classId = np.argmax(scores)
        confidence = scores[classId]
        if confidence > confThreshold:
            center_x, center_y, width, height = detection[:4]
            left = int((center_x - width / 2) * box_scale[0])
            top = int((center_y - height / 2) * box_scale[1])
            width = int(width * box_scale[0])
            height = int(height * box_scale[1])
            detections.append((classId, confidence, [left, top, width, height]))
    return detections


def drawPred(frame, classId, conf, left, top, right, bottom, classes):
    cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0))

    label = f"{classes[classId]}: {conf:.2f}"
    labelSize, baseLine = cv.getTextSize(label, cv.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    top = max(top, labelSize[1])
    cv.rectangle(
        frame,
        (left, top - labelSize[1]),
        (left + labelSize[0], top + baseLine),
        (255, 255, 255),
        cv.FILLED,
    )
    cv.putText(frame, label, (left, top), cv.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0))


def main():
    classes = None
    with open(filename_classes, "rt") as f:
        classes = f.read().rstrip("\n").split("\n")

    net = cv.dnn.readNet(model)

    winName = "Deep learning object detection in OpenCV"
    cv.namedWindow(winName, cv.WINDOW_AUTOSIZE)

    frame = cv.imread(input_image, cv.IMREAD_COLOR)
    if frame is None:
        print("Error: Could not load image.")
        return

    blob = cv.dnn.blobFromImage(
        frame, size=(inpWidth, inpHeight), swapRB=True, ddepth=cv.CV_8U
    )
    net.setInput(blob, scalefactor=0.00392)
    outs = net.forward(net.getUnconnectedOutLayersNames())

    postprocess(frame, outs, classes, confThreshold, nmsThreshold)
    frame = cv.resize(frame, (inpWidth, inpHeight))

    cv.imshow(winName, frame)
    cv.waitKey(0)


if __name__ == "__main__":
    main()
