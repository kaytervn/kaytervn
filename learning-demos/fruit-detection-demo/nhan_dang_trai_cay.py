import streamlit as st
import numpy as np
from PIL import Image
import cv2
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
model = os.path.join(script_dir, "trai_cay.onnx")
filename_classes = os.path.join(script_dir, "trai_cay.txt")

inpWidth, inpHeight = 640, 640
confThreshold, nmsThreshold = 0.5, 0.4
classes = None
with open(filename_classes, "rt") as f:
    classes = f.read().rstrip("\n").split("\n")

st.title("Nhận dạng trái cây")

try:
    if st.session_state["LoadModel"] == True:
        print("Đã load model rồi")
except:
    st.session_state["LoadModel"] = True
    st.session_state["Net"] = cv2.dnn.readNet(model)
    print(st.session_state["LoadModel"])
    print("Load model lần đầu")


def postprocess(frame, outs):
    frameHeight, frameWidth = frame.shape[:2]
    box_scale = (frameWidth / inpWidth, frameHeight / inpHeight)

    detections = []
    for out in outs:
        detections.extend(process_output(out[0], box_scale))

    if detections:
        classIds, confidences, boxes = zip(*detections)
        indices = cv2.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)

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
            )


def process_output(out, box_scale):
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


def drawPred(frame, classId, conf, left, top, right, bottom):
    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0))
    label = f"{classes[classId]}: {conf:.2f}"
    labelSize, baseLine = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    top = max(top, labelSize[1])
    cv2.rectangle(
        frame,
        (left, top - labelSize[1]),
        (left + labelSize[0], top + baseLine),
        (255, 255, 255),
        cv2.FILLED,
    )
    cv2.putText(frame, label, (left, top), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0))


img_file_buffer = st.file_uploader(
    "Upload an image", type=["bmp", "png", "jpg", "jpeg", "tif", "gif"]
)

if img_file_buffer is not None:
    image = Image.open(img_file_buffer)
    frame = np.array(image)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    st.image(image)
    if st.button("Predict"):
        blob = cv2.dnn.blobFromImage(
            frame, size=(inpWidth, inpHeight), swapRB=True, ddepth=cv2.CV_8U
        )
        st.session_state["Net"].setInput(blob, scalefactor=0.00392)
        outs = st.session_state["Net"].forward(
            st.session_state["Net"].getUnconnectedOutLayersNames()
        )
        postprocess(frame, outs)
        frame = cv2.resize(frame, (inpWidth, inpHeight))
        color_coverted = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(color_coverted)
        st.image(pil_image)
