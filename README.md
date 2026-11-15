# Plant Care Guide

A small website for house plant care. You pick a plant and see how to water it, how much light it needs, the right temperature, humidity and soil, and its common problems. It can also suggest plants for your room and guess a plant from a photo. There are 14 plants for now.

## Where the idea came from

In 2024 I wrote a business plan called Gardenli for my Fundamentals of Entrepreneurship course. It was an idea for a house plant platform with care guides, reminders, a shop and expert advice. This website is a small working version of the care guide part.

## The business plan file

[gardenli-business-plan.pdf](gardenli-business-plan.pdf) is the full plan in Persian, written on the business plan form we had for the course.

## How it works

- The plant data is in PostgreSQL (`database.sql`) and `app.py` (Flask) sends it to the pages as JSON
- The home page lists the plants with a search box, and every plant has its own care page
- On the plant page you can see your next watering day, check your room temperature and upload your own photos
- Find a Plant suggests plants based on light, watering, dry air and temperature
- Identify guesses the plant in a photo with a simple scikit-learn model (`train_model.py`) trained on 281 photos in `dataset/` (credits in `dataset/credits.csv`)

## Tech

Python (Flask), PostgreSQL, HTML, CSS, JavaScript, Pillow, NumPy, scikit-learn

## How to run

If your `postgres` user has a password, put it in the `PGPASSWORD` environment variable first.

```bash
git clone https://github.com/sara-razavi/plant-care-guide.git
cd plant-care-guide
createdb -U postgres plant_care
psql -U postgres -d plant_care -f database.sql
pip install -r requirements.txt
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Author

**Sara Razavi**: [GitHub](https://github.com/sara-razavi)
