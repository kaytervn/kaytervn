import tkinter as tk
import numpy as np
import cv2 as cv
from tkinter.filedialog import Open
from PIL import Image, ImageTk

model = "road_signs.onnx"
filename_classes = "road_signs.txt"
inpWidth, inpHeight = 640, 640
confThreshold, nmsThreshold = 0.5, 0.4
classes = None
with open(filename_classes, "rt") as f:
    classes = f.read().rstrip("\n").split("\n")


def postprocess(frame, outs):
    frameHeight, frameWidth = frame.shape[:2]
    box_scale = (frameWidth / inpWidth, frameHeight / inpHeight)

    detections = []
    for out in outs:
        detections.extend(process_output(out[0], box_scale))

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


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.resizable(False, False)
        self.filename = None
        self.title("Road Signs Detection")
        self.cvs_image = tk.Canvas(
            self, width=inpWidth, height=inpHeight, relief=tk.SUNKEN, border=1
        )
        lbl_frm_menu = tk.LabelFrame(self)
        btn_open_image = tk.Button(
            lbl_frm_menu, text="Open Image", command=self.btn_open_image_click
        )
        btn_detect_image = tk.Button(
            lbl_frm_menu, text="Detect", command=self.btn_detect_click
        )
        btn_open_image.grid(row=0, column=0, padx=5, pady=5)
        btn_detect_image.grid(row=1, column=0, padx=5, pady=5, sticky=tk.EW)
        self.cvs_image.grid(row=0, column=0, padx=5, pady=5)
        lbl_frm_menu.grid(row=0, column=1, padx=5, pady=7, sticky=tk.N)

    def btn_open_image_click(self):
        ftypes = [("Image", "*.jpg *.tif *.bmp *.gif *.png")]
        dlg = Open(self, filetypes=ftypes)
        self.filename = dlg.show()
        if self.filename != "":
            image = Image.open(self.filename)
            self.image_tk = ImageTk.PhotoImage(image.resize((inpWidth, inpHeight)))
            self.cvs_image.create_image(0, 0, anchor=tk.NW, image=self.image_tk)

    def btn_detect_click(self):
        net = cv.dnn.readNet(model)
        frame = cv.imread(self.filename, cv.IMREAD_COLOR)
        blob = cv.dnn.blobFromImage(
            frame, size=(inpWidth, inpHeight), swapRB=True, ddepth=cv.CV_8U
        )
        net.setInput(blob, scalefactor=0.00392)
        outs = net.forward(net.getUnconnectedOutLayersNames())
        postprocess(frame, outs)
        frame = cv.resize(frame, (inpWidth, inpHeight))
        color_coverted = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        pil_image = Image.fromarray(color_coverted)
        self.image_tk = ImageTk.PhotoImage(pil_image)
        self.cvs_image.create_image(0, 0, anchor=tk.NW, image=self.image_tk)


if __name__ == "__main__":
    app = App()
    app.mainloop()
