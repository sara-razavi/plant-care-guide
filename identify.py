import numpy as np
from PIL import Image, ImageOps


def get_features(image):
    image = ImageOps.exif_transpose(image).convert("RGB")

    # the plant is usually in the middle, the edges are mostly wall and table
    w, h = image.size
    image = image.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
    image = image.resize((64, 64))

    # color histogram in HSV, hue is the color itself (green, red ...),
    # saturation and value are how strong and how bright it is
    hsv = np.array(image.convert("HSV"))
    hue = np.histogram(hsv[:, :, 0], bins=12, range=(0, 256))[0]
    sat = np.histogram(hsv[:, :, 1], bins=4, range=(0, 256))[0]
    val = np.histogram(hsv[:, :, 2], bins=4, range=(0, 256))[0]

    features = np.concatenate([hue, sat, val]) / (64 * 64)
    return features


def load_image(path):
    return get_features(Image.open(path))
