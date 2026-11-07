from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)


# plant data is in a json file for now, later it should come from postgres
def load_plants():
    with open("plants.json") as file:
        plants = json.load(file)
    return plants


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/plant")
def plant_page():
    # the plant name is in the url (?name=...), details.js reads it
    return render_template("plant.html")


@app.route("/api/plants")
def get_plants():
    plants = load_plants()

    # the home page only needs these
    result = []
    for plant in plants:
        result.append({
            "name": plant["name"],
            "scientific_name": plant["scientific_name"],
            "description": plant["description"]
        })
    return jsonify(result)


@app.route("/api/plants/<name>")
def get_plant(name):
    plants = load_plants()

    for plant in plants:
        if plant["name"].lower() == name.lower():
            return jsonify(plant)

    return jsonify({"error": "plant not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
