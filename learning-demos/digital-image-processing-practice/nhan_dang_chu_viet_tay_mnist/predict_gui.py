import tensorflow as tf
from tensorflow.keras import datasets, models, optimizers
import numpy as np
import cv2
import tkinter as tk
from PIL import Image, ImageTk

OPTIMIZER = tf.keras.optimizers.Adam()

# load model
model_architecture = "digit_config.json"
model_weights = "digit_weight.h5"
model = models.model_from_json(open(model_architecture).read())
model.load_weights(model_weights)

model.compile(
    loss="categorical_crossentropy", optimizer=OPTIMIZER, metrics=["accuracy"]
)

# data: shuffled and split between train and test sets
(_, _), (X_test, _) = datasets.mnist.load_data()

# reshape
X_test = X_test.reshape((10000, 28, 28, 1))


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Nhận dạng chữ số MNIST")
        self.data = None
        self.image_tk = None
        self.lbl_predict = tk.Label(
            self, height=11, relief=tk.SUNKEN, border=1, font=("Consolas", 15)
        )
        self.tao_anh_ngau_nhien()
        self.cvs_image = tk.Canvas(
            self, width=28 * 10, height=28 * 10, relief=tk.SUNKEN, border=1
        )
        self.cvs_image.create_image(0, 0, anchor=tk.NW, image=self.image_tk)
        lbl_frm_menu = tk.LabelFrame(self)
        btn_create_image = tk.Button(
            lbl_frm_menu, text="Create Image", command=self.btn_create_image_click
        )
        btn_predict = tk.Button(
            lbl_frm_menu, text="Predict", command=self.btn_predict_click
        )
        btn_create_image.grid(row=0, column=0, padx=5, pady=5)
        btn_predict.grid(row=1, column=0, padx=5, pady=5, sticky=tk.EW)

        self.cvs_image.grid(row=0, column=0, padx=5, pady=5)
        lbl_frm_menu.grid(row=0, column=1, padx=5, pady=7, sticky=tk.NW)
        self.lbl_predict.grid(row=1, column=0, padx=5, pady=5, sticky=tk.EW)

    def tao_anh_ngau_nhien(self):
        self.lbl_predict.config(text="")
        # Tạo 100 số nguyên ngẫu nhiên nằm trong phạm vi [0, 9999]
        index = np.random.randint(0, 9999, 100)
        sample = np.zeros((100, 28, 28, 1))
        for i in range(0, 100):
            sample[i] = X_test[index[i]]

        # Tạo ảnh để xem
        image = np.zeros((10 * 28, 10 * 28), np.uint8)
        k = 0
        for i in range(0, 10):
            for j in range(0, 10):
                image[i * 28 : (i + 1) * 28, j * 28 : (j + 1) * 28] = sample[k, :, :, 0]
                k += 1

        color_coverted = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(color_coverted)
        self.image_tk = ImageTk.PhotoImage(image_pil)

        # normalize
        self.data = sample / 255.0
        # cast
        self.data = self.data.astype("float32")

    def btn_predict_click(self):
        ket_qua = model.predict(self.data, verbose=0)
        chu_so = []
        for i in range(0, 100):
            x = np.argmax(ket_qua[i])
            chu_so.append(x)
        s = ""
        dem = 0
        for x in chu_so:
            s += str(x) + " "
            dem += 1
            if dem % 10 == 0:
                s += "\n"

        self.lbl_predict.config(text=s)

    def btn_create_image_click(self):
        self.tao_anh_ngau_nhien()
        self.cvs_image.create_image(0, 0, anchor=tk.NW, image=self.image_tk)
        self.cvs_image.update()


if __name__ == "__main__":
    app = App()
    app.mainloop()
