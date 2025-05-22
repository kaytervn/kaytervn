import sys
import tkinter
from tkinter import Frame, Tk, BOTH, Text, Menu, END
from tkinter.filedialog import Open, SaveAs
import cv2
import numpy as np
import Chapter03 as c3
import Chapter04 as c4
import Chapter05 as c5
import Chapter09 as c9

class Main(Frame):
    
    def __init__(self, parent):
        Frame.__init__(self, parent)
        self.parent = parent
        self.initUI()
  
    def initUI(self):
        self.parent.title("Machine Vision")
        self.pack(fill=BOTH, expand=1)
  
        menubar = Menu(self.parent)
        self.parent.config(menu=menubar)
  
        fileMenu = Menu(menubar, tearoff = 0)
        fileMenu.add_command(label="Open", command=self.onOpen)
        fileMenu.add_command(label="OpenColor", command=self.onOpenColor)

        fileMenu.add_command(label="Save", command=self.onSave)
        fileMenu.add_separator()
        fileMenu.add_command(label="Exit", command=self.quit)
        menubar.add_cascade(label="File", menu=fileMenu)

        chapter3Menu = Menu(menubar, tearoff = 0)
        chapter3Menu.add_command(label="Negative", command=self.onNegative)
        chapter3Menu.add_command(label="Logarit", command=self.onLogarit)
        chapter3Menu.add_command(label="PiecewiseLinear", command=self.onPiecewiseLinear)
        chapter3Menu.add_command(label="Histogram", command=self.onHistogram)
        chapter3Menu.add_command(label="HistEqual", command=self.onHistEqual)
        chapter3Menu.add_command(label="HistEqualColor", command=self.onHistEqualColor)
        chapter3Menu.add_command(label="LocalHist", command=self.onLocalHist)
        chapter3Menu.add_command(label="HistStat", command=self.onHistStat)
        chapter3Menu.add_command(label="BoxFilter", command=self.onBoxFilter)
        chapter3Menu.add_command(label="LowpassGauss", command=self.onLowpassGauss)
        chapter3Menu.add_command(label="Threshold", command=self.onThreshold)
        chapter3Menu.add_command(label="MedianFilter", command=self.onMedianFilter)
        chapter3Menu.add_command(label="Sharpen", command=self.onSharpen)

        chapter3Menu.add_command(label="Gradient", command=self.onGradient)

        menubar.add_cascade(label="Chapter3", menu=chapter3Menu)

        chapter4Menu = Menu(menubar, tearoff = 0)
        chapter4Menu.add_command(label="Spectrum", command=self.onSpectrum)
        chapter4Menu.add_command(label="FrequencyFilter", command=self.onFrequencyFilter)
        chapter4Menu.add_command(label="DrawNotchRejectFilter", command=self.onDrawNotchRejectFilter)
        chapter4Menu.add_command(label="RemoveMoire", command=self.onRemoveMoire)
        menubar.add_cascade(label="Chapter4", menu=chapter4Menu)

        chapter5Menu = Menu(menubar, tearoff = 0)
        chapter5Menu.add_command(label="CreateMotionNoise", command=self.onCreateMotionNoise)
        chapter5Menu.add_command(label="DenoiseMotion", command=self.onDenoiseMotion)
        chapter5Menu.add_command(label="DenoisestMotion", command=self.onDenoisestMotion)
        menubar.add_cascade(label="Chapter5", menu=chapter5Menu)

        chapter9Menu = Menu(menubar, tearoff = 0)
        chapter9Menu.add_command(label="Erosion", command=self.onErosion)
        chapter9Menu.add_command(label="Dilation", command=self.onDilation)
        chapter9Menu.add_command(label="OpeningClosing", command=self.onOpeningClosing)
        chapter9Menu.add_command(label="Boundary", command=self.onBoundary)
        chapter9Menu.add_command(label="HoleFilling", command=self.onHoleFilling)
        chapter9Menu.add_command(label="HoleFillingMouse", command=self.onHoleFillingMouse)
        chapter9Menu.add_command(label="ConnectedComponent", command=self.onConnectedComponent)
        chapter9Menu.add_command(label="CountRice", command=self.onCountRice)

        menubar.add_cascade(label="Chapter9", menu=chapter9Menu)

        self.txt = Text(self)
        self.txt.pack(fill=BOTH, expand=1)
  
    def onOpen(self):
        global ftypes
        ftypes = [('Images', '*.jpg *.tif *.bmp *.gif *.png')]
        dlg = Open(self, filetypes = ftypes)
        fl = dlg.show()
  
        if fl != '':
            global imgin
            imgin = cv2.imread(fl,cv2.IMREAD_GRAYSCALE)
            # imgin = cv2.imread(fl,cv2.IMREAD_COLOR);
            cv2.namedWindow("ImageIn", cv2.WINDOW_AUTOSIZE)
            cv2.imshow("ImageIn", imgin)

    def onOpenColor(self):
        global ftypes
        ftypes = [('Images', '*.jpg *.tif *.bmp *.gif *.png')]
        dlg = Open(self, filetypes = ftypes)
        fl = dlg.show()
  
        if fl != '':
            global imgin
            imgin = cv2.imread(fl,cv2.IMREAD_COLOR);
            cv2.namedWindow("ImageIn", cv2.WINDOW_AUTOSIZE)
            cv2.imshow("ImageIn", imgin)

    def onSave(self):
        dlg = SaveAs(self,filetypes = ftypes);
        fl = dlg.show()
        if fl != '':
            cv2.imwrite(fl,imgout)

    def onNegative(self):
        global imgout
        imgout = c3.Negative(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onLogarit(self):
        global imgout
        imgout = c3.Logarit(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onPiecewiseLinear(self):
        global imgout
        imgout = c3.PiecewiseLinear(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onHistogram(self):
        global imgout
        imgout = c3.Histogram(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onHistEqual(self):
        global imgout
        #imgout = c3.HistEqual(imgin)
        imgout = cv2.equalizeHist(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onHistEqualColor(self):
        global imgout
        imgout = c3.HistEqualColor(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onLocalHist(self):
        global imgout
        imgout = c3.LocalHist(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onHistStat(self):
        global imgout
        imgout = c3.HistStat(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onBoxFilter(self):
        global imgout
        #imgout = cv2.boxFilter(imgin, cv2.CV_8UC1, (21,21))
        imgout = cv2.blur(imgin,(21,21))
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onLowpassGauss(self):
        global imgout
        imgout = cv2.GaussianBlur(imgin,(43,43),7.0)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onThreshold(self):
        global imgout
        imgout = c3.Threshold(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onMedianFilter(self):
        global imgout
        #imgout = c3.MedianFilter(imgin)
        imgout = cv2.medianBlur(imgin, 7)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onSharpen(self):
        global imgout
        imgout = c3.Sharpen(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onGradient(self):
        global imgout
        imgout = c3.Gradient(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onSpectrum(self):
        global imgout
        imgout = c4.Spectrum(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onFrequencyFilter(self):
        global imgout
        imgout = c4.FrequencyFilter(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onDrawNotchRejectFilter(self):
        global imgout
        imgout = c4.DrawNotchRejectFilter()
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onRemoveMoire(self):
        global imgout
        imgout = c4.RemoveMoire(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onCreateMotionNoise(self):
        global imgout
        imgout = c5.CreateMotionNoise(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onDenoiseMotion(self):
        global imgout
        imgout = c5.DenoiseMotion(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onDenoisestMotion(self):
        global imgout
        temp = cv2.medianBlur(imgin, 7)
        imgout = c5.DenoiseMotion(temp)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onErosion(self):
        global imgout
        imgout = c9.Erosion(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onDilation(self):
        global imgout
        imgout = c9.Dilation(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onOpeningClosing(self):
        global imgout
        imgout = c9.OpeningClosing(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onBoundary(self):
        global imgout
        imgout = c9.Boundary(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onHoleFilling(self):
        c9.HoleFilling(imgin)
        cv2.namedWindow("ImageIn", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageIn", imgin)

    def onMouse(self, event, x, y, flags, param):
        if flags & cv2.EVENT_FLAG_LBUTTON:
            cv2.floodFill(imgin, self.mask, (x,y), (255,255,255))
            cv2.namedWindow("ImageIn", cv2.WINDOW_AUTOSIZE)
            cv2.imshow("ImageIn", imgin)

    def onHoleFillingMouse(self):
        M, N = imgin.shape
        self.mask = np.zeros((M+2, N+2), np.uint8)
        cv2.setMouseCallback('ImageIn', self.onMouse)

    def onConnectedComponent(self):
        global imgout
        imgout = c9.ConnectedComponent(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)

    def onCountRice(self):
        global imgout
        imgout = c9.CountRice(imgin)
        cv2.namedWindow("ImageOut", cv2.WINDOW_AUTOSIZE)
        cv2.imshow("ImageOut", imgout)



root = Tk()
Main(root)
root.geometry("640x480+100+100")
root.mainloop()

