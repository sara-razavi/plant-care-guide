from flask import Flask, render_template, jsonify
import psycopg2

app = Flask(__name__)


def get_connection():
    # password is not in the code, set PGPASSWORD if your postgres needs one
    conn = psycopg2.connect(dbname="plant_care", user="postgres", host="localhost")
    return conn


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/plant")
def plant_page():
    # the plant name is in the url (?name=...), details.js reads it
    return render_template("plant.html")


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


if __name__ == "__main__":
    app.run(debug=True)
