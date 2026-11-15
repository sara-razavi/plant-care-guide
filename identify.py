import numpy as np
from PIL import Image, ImageOps


def prepare(image):
    image = ImageOps.exif_transpose(image).convert("RGB")

    # the plant is usually in the middle, the edges are mostly wall and table
    w, h = image.size
    image = image.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
    return image.resize((96, 96))


def color_features(image):
    # color histogram in HSV, hue is the color itself (green, red ...),
    # saturation and value are how strong and how bright it is
    hsv = np.array(image.convert("HSV"))
    hue = np.histogram(hsv[:, :, 0], bins=18, range=(0, 256))[0]
    sat = np.histogram(hsv[:, :, 1], bins=6, range=(0, 256))[0]
    val = np.histogram(hsv[:, :, 2], bins=6, range=(0, 256))[0]
    return np.concatenate([hue, sat, val]) / (96 * 96)


def edge_features(image):
    # only color wasn't enough, a lot of plants are the same green.
    # edges show the shape: long stripes (snake plant), small leaves (fern) ...
    gray = np.array(image.convert("L"), dtype=float)
    gy, gx = np.gradient(gray)
    strength = np.hypot(gx, gy)
    direction = np.arctan2(gy, gx) % np.pi

    # which directions the edges go, the strong edges count more
    hist = np.histogram(direction, bins=9, range=(0, np.pi), weights=strength)[0]
    hist = hist / (hist.sum() + 0.000001)

    # how many edges there are at all
    amount = [strength.mean() / 255, (strength > 30).mean(), (strength > 80).mean()]
    return np.concatenate([hist, amount])


def grid_features(image):
    # hue in the 4 corners of the photo, so it knows a bit where the colors are
    hue = np.array(image.convert("HSV"))[:, :, 0]
    result = []
    for i in range(2):
        for j in range(2):
            part = hue[i * 48:(i + 1) * 48, j * 48:(j + 1) * 48]
            result.append(np.histogram(part, bins=6, range=(0, 256))[0] / part.size)
    return np.concatenate(result)


def get_features(image):
    image = prepare(image)
    return np.concatenate([color_features(image), edge_features(image), grid_features(image)])


def load_image(path, flip=False):
    image = Image.open(path)
    if flip:
        image = ImageOps.mirror(image)
    return get_features(image)
