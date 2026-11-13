import os
import pickle

import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

from identify import load_image

DATASET = "dataset"


def load_dataset():
    x = []
    y = []
    # every folder in dataset/ is one plant, the folder name is the plant name
    for plant in sorted(os.listdir(DATASET)):
        folder = os.path.join(DATASET, plant)
        if not os.path.isdir(folder):
            continue
        for name in os.listdir(folder):
            if name.lower().endswith((".jpg", ".jpeg", ".png")):
                x.append(load_image(os.path.join(folder, name)))
                y.append(plant)
    return np.array(x), np.array(y)


x, y = load_dataset()
print("Loaded", len(x), "photos of", len(set(y)), "plants")
for plant in sorted(set(y)):
    print("  " + plant + ":", list(y).count(plant))

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)

# try a few k values like in the handwriting project
# (no k = 1, then it's always 100% sure about one plant and the page can't show other guesses)
best_k = 3
best_accuracy = 0
for k in [3, 5, 7, 9]:
    model = KNeighborsClassifier(n_neighbors=k, weights="distance")
    model.fit(x_train, y_train)
    accuracy = model.score(x_test, y_test)
    print("k =", k, "accuracy:", round(accuracy * 100, 1), "%")
    if accuracy > best_accuracy:
        best_k = k
        best_accuracy = accuracy

print("Best k:", best_k)

# train again with all the photos and save it for app.py
model = KNeighborsClassifier(n_neighbors=best_k, weights="distance")
model.fit(x, y)
with open("model.pkl", "wb") as file:
    pickle.dump(model, file)
print("Saved model.pkl")
