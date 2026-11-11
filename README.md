# Plant Care Guide

A website where you pick a house plant and see how to take care of it: how much and how often to water it, how much light it needs, the right temperature, humidity and soil, and its common problems. There are 12 plants for now. The data is in a PostgreSQL database, and a small Flask backend sends it to the pages as JSON.

## How it works

1. `database.sql` creates two tables, `plants` and `problems`, and fills them with 12 house plants and 2 or 3 common problems for each one
2. `app.py` is the Flask backend. It reads the plants from PostgreSQL with psycopg2 and sends them as JSON (`/api/plants` for the list, `/api/plants/<name>` for one plant)
3. The home page gets the list with `fetch` and makes a card for every plant. The search box filters the cards by name or scientific name
4. Clicking a card opens the plant page with all the care info for that plant
5. On the plant page you can enter the day you last watered it to see the next watering day (the browser remembers it), check if your room temperature is ok for the plant, and click a common problem to see what to do
6. The Find a Plant page (`/recommend`) asks how much light the spot gets, how often you can water, if the air is dry, and the room temperature (optional). Then `/api/recommend` picks the plants that fit from the database and adds a few care tips

## Tech

- Python (Flask)
- PostgreSQL (psycopg2)
- HTML, CSS, JavaScript

## Project structure

```
.
├── app.py
├── database.sql
├── requirements.txt
├── templates/
│   ├── index.html
│   ├── plant.html
│   └── recommend.html
└── static/
    ├── style.css
    ├── script.js
    ├── details.js
    └── recommend.js
```

## How to run

You need Python 3 and PostgreSQL. First clone the repo:

```bash
git clone https://github.com/sara-razavi/plant-care-guide.git
cd plant-care-guide
```

Create the `plant_care` database and load the plants into it:

```bash
createdb -U postgres plant_care
psql -U postgres -d plant_care -f database.sql
```

Install the Python packages:

```bash
pip install -r requirements.txt
```

The app connects to `plant_care` on `localhost` as the `postgres` user. If that user has a password, put it in the `PGPASSWORD` environment variable before starting the app (in PowerShell: `$env:PGPASSWORD = "your password"`, on macOS or Linux: `export PGPASSWORD="your password"`).

Then start it and open http://127.0.0.1:5000 in your browser:

```bash
python app.py
```

## Author

**Sara Razavi**: [GitHub](https://github.com/sara-razavi)
