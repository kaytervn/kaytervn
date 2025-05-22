import os
import cv2
import yaml

f = open("J:/My Drive/TrainingYOLOv8/road_signs/data.yaml", "r")
data = yaml.safe_load(f)
f.close()
names = data["names"]

image_path = "J:/My Drive/TrainingYOLOv8/road_signs/valid/images/"
lst_image = os.listdir(image_path)

label_path = "J:/My Drive/TrainingYOLOv8/road_signs/valid/labels/"
lst_label = os.listdir(label_path)

l = len(lst_image)
for i in range(0, l):
    fullname_image = image_path + lst_image[i]
    image = cv2.imread(fullname_image, cv2.IMREAD_COLOR)

    fullname_label = label_path + lst_label[i]
    f = open(fullname_label, "r")
    data = f.readlines()
    f.close()
    for line in data:
        word = line.split()
        label = int(word[0])
        xc = float(word[1])
        yc = float(word[2])
        w = float(word[3])
        h = float(word[4])
        xmin = xc - w / 2
        ymin = yc - h / 2
        xmax = xc + w / 2
        ymax = yc + h / 2

        xmin = int(xmin * 640)
        xmax = int(xmax * 640)
        ymin = int(ymin * 640)
        ymax = int(ymax * 640)

        cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 0, 255))
        cv2.putText(
            image,
            names[label],
            (xmin, ymin + 15),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 0, 255),
        )
    cv2.imshow("Image", image)
    key = cv2.waitKey(0)
    # Mã ASCII của ESC là 27
    if key == 27:
        break
