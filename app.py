from flask import Flask, render_template, jsonify, request, url_for
from PIL import Image, ImageOps
from datetime import datetime
import psycopg2
import os

app = Flask(__name__)

# photos from phones can be big, more than 10 MB gets a 413 error
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

UPLOAD_FOLDER = os.path.join("static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_connection():
    # password is not in the code, set PGPASSWORD if your postgres needs one
    conn = psycopg2.connect(dbname="plant_care", user="postgres", host="localhost")
    return conn


# postgres not running: send a short json error, not the big html error page
@app.errorhandler(psycopg2.OperationalError)
def database_error(error):
    print("database error:", error)
    return jsonify({"error": "can't connect to the database, is postgres running?"}), 500


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/plant")
def plant_page():
    # the plant name is in the url (?name=...), details.js reads it
    return render_template("plant.html")


@app.route("/recommend")
def recommend_page():
    return render_template("recommend.html")


@app.route("/api/plants")
def get_plants():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, scientific_name, description FROM plants ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # the home page only needs these
    result = []
    for row in rows:
        result.append({
            "name": row[0],
            "scientific_name": row[1],
            "description": row[2]
        })
    return jsonify(result)


@app.route("/api/plants/<name>")
def get_plant(name):
    conn = get_connection()
    cur = conn.cursor()

    # lower() on both sides so the name is not case sensitive
    cur.execute("""
        SELECT id, name, scientific_name, description, water_amount, watering_days, light,
               min_temp, max_temp, humidity, soil, care_instructions
        FROM plants
        WHERE LOWER(name) = LOWER(%s)
    """, (name,))
    row = cur.fetchone()

    if row == None:
        cur.close()
        conn.close()
        return jsonify({"error": "plant not found"}), 404

    plant = {
        "name": row[1],
        "scientific_name": row[2],
        "description": row[3],
        "water_amount": row[4],
        "watering_days": row[5],
        "light": row[6],
        "min_temp": row[7],
        "max_temp": row[8],
        "humidity": row[9],
        "soil": row[10],
        "care_instructions": row[11],
        "problems": []
    }

    # problems are in their own table
    cur.execute("SELECT problem, solution FROM problems WHERE plant_id = %s ORDER BY id", (row[0],))
    for problem in cur.fetchall():
        plant["problems"].append({"problem": problem[0], "solution": problem[1]})

    cur.close()
    conn.close()
    return jsonify(plant)


def get_tips(light, water, dry, temp):
    tips = []

    if light == 1:
        tips.append("In low light plants grow slowly and use less water, so check the soil before watering.")
    if light == 4:
        tips.append("Direct sun can burn leaves, turn the pots sometimes and watch for brown spots.")

    if water == 3:
        tips.append("Watering often is fine for some plants, but most of them still don't like wet soil all the time.")
    if water == 14:
        tips.append("Use pots with drainage holes and a well draining mix, plants that need little water hate wet roots.")

    if dry:
        tips.append("Your air is dry, put the pots on a tray with pebbles and water or keep the plants close together.")

    if temp != None:
        if temp < 16:
            tips.append("Your room is quite cold, keep the plants away from cold windows at night.")
        elif temp > 27:
            tips.append("Your room is warm, the soil dries faster so you may need to water a bit more often.")

    return tips


@app.route("/api/recommend")
def recommend():
    # answers from the form on the recommend page
    light = int(request.args.get("light"))
    water = int(request.args.get("water"))
    dry = request.args.get("dry") == "yes"
    temp = request.args.get("temp")
    if temp == None or temp == "":
        temp = None
    else:
        temp = float(temp)

    # plants that need water less often are ok too, you just water them less
    query = """
        SELECT name, scientific_name, description, watering_days
        FROM plants
        WHERE min_light <= %s AND max_light >= %s AND watering_days >= %s
    """
    values = [light, light, water]

    # dry air is bad for the plants that like humidity
    if dry:
        query += " AND likes_humid = false"
    if temp != None:
        query += " AND min_temp <= %s AND max_temp >= %s"
        values.append(temp)
        values.append(temp)
    query += " ORDER BY name"

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(query, values)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    plants = []
    for row in rows:
        plants.append({
            "name": row[0],
            "scientific_name": row[1],
            "description": row[2],
            "watering_days": row[3]
        })

    return jsonify({"plants": plants, "tips": get_tips(light, water, dry, temp)})


@app.route("/api/plants/<name>/photos", methods=["POST"])
def upload_photo(name):
    if "photo" not in request.files or request.files["photo"].filename == "":
        return jsonify({"error": "Choose a photo first."}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM plants WHERE LOWER(name) = LOWER(%s)", (name,))
    row = cur.fetchone()
    if row == None:
        cur.close()
        conn.close()
        return jsonify({"error": "plant not found"}), 404

    # opening it with pillow also checks that it's really an image
    try:
        image = Image.open(request.files["photo"])
        # phone photos came out sideways without this
        image = ImageOps.exif_transpose(image)
        image = image.convert("RGB")
    except OSError:
        cur.close()
        conn.close()
        return jsonify({"error": "This file is not an image (use jpg or png)."}), 400

    # make it smaller, the gallery doesn't need a 4000px photo
    image.thumbnail((800, 800))
    filename = row[1].lower().replace(" ", "_") + "_" + datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".jpg"
    image.save(os.path.join(UPLOAD_FOLDER, filename), "JPEG", quality=85)

    cur.execute("INSERT INTO photos (plant_id, filename) VALUES (%s, %s)", (row[0], filename))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"url": url_for("static", filename="uploads/" + filename)}), 201


@app.route("/api/plants/<name>/photos")
def get_photos(name):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT photos.filename, photos.uploaded_at
        FROM photos JOIN plants ON plants.id = photos.plant_id
        WHERE LOWER(plants.name) = LOWER(%s)
        ORDER BY photos.uploaded_at DESC
    """, (name,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # newest first
    result = []
    for row in rows:
        result.append({
            "url": url_for("static", filename="uploads/" + row[0]),
            "date": row[1].strftime("%Y-%m-%d %H:%M")
        })
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
