import tkinter as tk
from tkinter.filedialog import askopenfilename, asksaveasfilename
import cv2
from chapter3 import *


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Xử lý ảnh")
        self.geometry("320x320")
        self.imgin = None
        self.imgout = None
        self.filename = None

        menu = tk.Menu(self)
        file_menu = tk.Menu(menu, tearoff=0)
        file_menu.add_command(
            label="Open Image", command=self.mnu_file_open_image_click
        )
        file_menu.add_command(
            label="Open Image Color", command=self.mnu_file_open_image_color_click
        )
        file_menu.add_command(
            label="Save Image", command=self.mnu_file_save_image_click
        )
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.destroy)
        menu.add_cascade(label="File", menu=file_menu)
        self.config(menu=menu)

        chapter3_menu = tk.Menu(menu, tearoff=0)
        chapter3_menu.add_command(label="Negative", command=self.mnu_c3_negative_click)
        chapter3_menu.add_command(
            label="Negative Color", command=self.mnu_c3_negative_color_click
        )
        chapter3_menu.add_command(label="Logarit", command=self.mnu_c3_logarit_click)
        chapter3_menu.add_command(label="Power", command=self.mnu_c3_power_click)
        chapter3_menu.add_command(
            label="Piecewise Linear", command=self.mnu_c3_piecewise_linear_click
        )
        chapter3_menu.add_command(
            label="Histogram", command=self.mnu_c3_histogram_click
        )
        chapter3_menu.add_command(
            label="Hist Equal", command=self.mnu_c3_hist_equal_click
        )

        menu.add_cascade(label="Chapter3", menu=chapter3_menu)
        self.config(menu=menu)

    def mnu_file_open_image_click(self):
        ftypes = [("Image", "*.jpg *.tif *.bmp *.gif *.png")]
        self.filename = askopenfilename(filetypes=ftypes, title="Open Image")
        if self.filename is not None:
            self.imgin = cv2.imread(self.filename, cv2.IMREAD_GRAYSCALE)
            cv2.imshow("ImageIn", self.imgin)

    def mnu_file_open_image_color_click(self):
        ftypes = [("Image", "*.jpg *.tif *.bmp *.gif *.png")]
        self.filename = askopenfilename(filetypes=ftypes, title="Open Image")
        if self.filename is not None:
            self.imgin = cv2.imread(self.filename, cv2.IMREAD_COLOR)
            cv2.imshow("ImageIn", self.imgin)

    def mnu_file_save_image_click(self):
        ftypes = [("Image", "*.jpg *.tif *.bmp *.gif *.png")]
        filename = asksaveasfilename(
            filetypes=ftypes, title="Save Image", initialfile=self.filename
        )
        if filename is not None:
            cv2.imwrite(filename, self.imgout)

    def mnu_c3_negative_click(self):
        self.imgout = Negative(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_negative_color_click(self):
        self.imgout = NegativeColor(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_logarit_click(self):
        self.imgout = Logarit(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_power_click(self):
        self.imgout = Power(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_piecewise_linear_click(self):
        self.imgout = PiecewiseLinear(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_histogram_click(self):
        self.imgout = Histogram(self.imgin)
        cv2.imshow("ImageOut", self.imgout)

    def mnu_c3_hist_equal_click(self):
        self.imgout = HistEqual(self.imgin)
        cv2.imshow("ImageOut", self.imgout)


if __name__ == "__main__":
    app = App()
    app.mainloop()
