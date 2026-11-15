import gzip
import os
import pickle

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from identify import load_image

DATASET = "dataset"


def load_dataset():
    x = []
    x_flipped = []
    y = []
    # every folder in dataset/ is one plant, the folder name is the plant name
    for plant in sorted(os.listdir(DATASET)):
        folder = os.path.join(DATASET, plant)
        if not os.path.isdir(folder):
            continue
        for name in os.listdir(folder):
            if name.lower().endswith((".jpg", ".jpeg", ".png")):
                path = os.path.join(folder, name)
                x.append(load_image(path))
                # the same photo mirrored, it's still the same plant
                x_flipped.append(load_image(path, flip=True))
                y.append(plant)
    return np.array(x), np.array(x_flipped), np.array(y)


def make_knn():
    return make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5, weights="distance"))


def make_forest():
    return RandomForestClassifier(n_estimators=150, random_state=0)


def test_model(make_model, x, x_flipped, y):
    # with only ~280 photos one split changes the result a lot
    # (the first version said 31%, that was a lucky split), so use the average of 5
    accuracies = []
    top3 = []
    for seed in range(5):
        index = np.arange(len(y))
        train, test = train_test_split(index, test_size=0.2, random_state=seed, stratify=y)

        # flipped photos only for training, if the flipped test photo is in
        # the training data the test is too easy
        x_train = np.concatenate([x[train], x_flipped[train]])
        y_train = np.concatenate([y[train], y[train]])

        model = make_model()
        model.fit(x_train, y_train)
        probs = model.predict_proba(x[test])
        best = model.classes_[probs.argmax(axis=1)]
        accuracies.append(np.mean(best == y[test]))

        # the page shows 3 guesses, so check if the right plant is in them
        hits = 0
        for i in range(len(test)):
            best3 = model.classes_[probs[i].argsort()[::-1][:3]]
            if y[test][i] in best3:
                hits += 1
        top3.append(hits / len(test))
    return np.mean(accuracies), np.mean(top3)


x, x_flipped, y = load_dataset()
print("Loaded", len(x), "photos of", len(set(y)), "plants")

models = {"knn": make_knn, "random forest": make_forest}
best_name = None
best_accuracy = 0
for name in models:
    accuracy, top3 = test_model(models[name], x, x_flipped, y)
    print(name + ":", round(accuracy * 100, 1), "% (right plant in the top 3:", round(top3 * 100, 1), "%)")
    if accuracy > best_accuracy:
        best_name = name
        best_accuracy = accuracy

print("Best model:", best_name)

# train the best one again with all the photos and save it for app.py
model = models[best_name]()
model.fit(np.concatenate([x, x_flipped]), np.concatenate([y, y]))
# the forest is 7.5 MB as a normal pickle, with gzip it's under 1 MB
with gzip.open("model.pkl.gz", "wb") as file:
    pickle.dump(model, file)
print("Saved model.pkl.gz")
