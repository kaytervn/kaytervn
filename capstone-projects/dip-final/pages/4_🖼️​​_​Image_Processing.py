import streamlit as st
import cv2
from PIL import Image
from image_processing import Chapter03, Chapter04, Chapter05, Chapter09
from utils import *

inpWidth, inpHeight = 640, 640


def process_image(image, operation):
    if operation == "C3. Negative":
        result = Chapter03.Negative(image)
    elif operation == "C3. Logarit":
        result = Chapter03.Logarit(image)
    elif operation == "C3. Power":
        result = Chapter03.Power(image)
    elif operation == "C3. Piecewise Linear":
        result = Chapter03.PiecewiseLinear(image)
    elif operation == "C3. Histogram":
        result = Chapter03.Histogram(image)
    elif operation == "C3. Hist Equal":
        result = Chapter03.HistEqual(image)
    elif operation == "C3. Hist Equal Color":
        result = Chapter03.HistEqualColor(image)
    elif operation == "C3. Local Hist":
        result = Chapter03.LocalHist(image)
    elif operation == "C3. Hist Stat":
        result = Chapter03.HistStat(image)
    elif operation == "C3. Box Filter":
        result = Chapter03.BoxFilter(image)
    elif operation == "C3. Lowpass Gauss":
        result = Chapter03.LowpassGauss(image)
    elif operation == "C3. Threshold":
        result = Chapter03.Threshold(image)
    elif operation == "C3. Median Filter":
        result = Chapter03.MedianFilter(image)
    elif operation == "C3. Sharpen":
        result = Chapter03.Sharpen(image)
    elif operation == "C3. Gradient":
        result = Chapter03.Gradient(image)
    elif operation == "C4. Spectrum":
        result = Chapter04.Spectrum(image)
    elif operation == "C4. Frequency Filter":
        result = Chapter04.FrequencyFilter(image)
    elif operation == "C4. Draw Notch Reject Filter":
        result = Chapter04.DrawNotchRejectFilter()
    elif operation == "C4. Remove Moire":
        result = Chapter04.RemoveMoire(image)
    elif operation == "C5. Create Motion Noise":
        result = Chapter05.CreateMotionNoise(image)
    elif operation == "C5. Denoise Motion":
        result = Chapter05.DenoiseMotion(image)
    elif operation == "C5. Denoisest Motion":
        result = Chapter05.DenoisestMotion(image)
    elif operation == "C9. Connected Component":
        result = Chapter09.ConnectedComponent(image)
    elif operation == "C9. Count Rice":
        result = Chapter09.CountRice(image)
    else:
        result = image
    return result


def app():
    st.set_page_config(page_title="Image Processing", page_icon="🖼️", layout="wide")
    st.title("🖼️​ Image Processing")

    upload_image = st.file_uploader(
        "Choose image", type=["bmp", "png", "jpg", "jpeg", "tif", "gif"]
    )
    cols = st.columns(2)
    with cols[0]:
        input_container = st.empty()
        imagein_container = st.empty()

    with cols[1]:
        result_container = st.empty()
        imageout_container = st.empty()

    operation = st.sidebar.selectbox(
        "Select an option",
        [
            "C3. Negative",
            "C3. Logarit",
            "C3. Power",
            "C3. Piecewise Linear",
            "C3. Histogram",
            "C3. Hist Equal",
            "C3. Hist Equal Color",
            "C3. Local Hist",
            "C3. Hist Stat",
            "C3. Box Filter",
            "C3. Lowpass Gauss",
            "C3. Threshold",
            "C3. Median Filter",
            "C3. Sharpen",
            "C3. Gradient",
            "C4. Spectrum",
            "C4. Frequency Filter",
            "C4. Draw Notch Reject Filter",
            "C4. Remove Moire",
            "C5. Create Motion Noise",
            "C5. Denoise Motion",
            "C5. Denoisest Motion",
            "C9. Connected Component",
            "C9. Count Rice",
        ],
    )

    if operation == "C4. Draw Notch Reject Filter":
        if st.sidebar.button("Process"):
            result = process_image(None, operation)
            input_container.subheader("Result")
            imagein_container.image(
                standardize_image_gray(result, (inpWidth, inpHeight))
            )

    elif upload_image is not None:
        input_container.subheader("Input")
        image = Image.open(upload_image)
        frame = np.array(image)
        if operation == "C3. Hist Equal Color":
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            frame = standardize_image(frame, (inpWidth, inpHeight))
        else:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            process_img = frame
            frame = standardize_image_gray(frame, (inpWidth, inpHeight))

        imagein_container.image(frame)

        if st.sidebar.button("Process"):
            result_container.subheader("Result")
            if (
                operation == "C4. Remove Moire"
                or operation == "C5. Denoise Motion"
                or operation == "C5. Denoisest Motion"
            ):
                result = process_image(process_img, operation)
                imageout_container.image(
                    standardize_image_gray(result, (inpWidth, inpHeight))
                )
            else:
                result = process_image(frame, operation)
                imageout_container.image(result)


app()
