-- plant care database (postgresql)
-- create the database first:  createdb plant_care
-- then run this file:  psql -d plant_care -f database.sql

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS plants;

CREATE TABLE plants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    scientific_name VARCHAR(100),
    description TEXT,
    water_amount VARCHAR(100),
    watering_days INT, -- water every x days
    light VARCHAR(100),
    min_temp INT, -- in celsius
    max_temp INT,
    humidity VARCHAR(50),
    soil VARCHAR(100),
    care_instructions TEXT,
    -- numbers for the recommendations, the text columns are hard to compare
    min_light INT, -- 1 low, 2 medium, 3 bright indirect, 4 some direct sun
    max_light INT,
    likes_humid BOOLEAN DEFAULT false
);

-- one plant can have a few problems, so separate table
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(id),
    problem VARCHAR(100),
    solution TEXT
);

-- photos that people upload of their own plant
-- only the file name is here, the images are in static/uploads
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(id),
    filename VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- plants
INSERT INTO plants (name, scientific_name, description, water_amount, watering_days, light, min_temp, max_temp, humidity, soil, care_instructions)
VALUES
('Monstera', 'Monstera deliciosa',
 'Big tropical plant with holes and splits in the leaves, also called swiss cheese plant.',
 'Water well until it comes out of the drainage holes', 7,
 'Bright indirect light, no harsh direct sun', 18, 30,
 'Medium to high (50-60%)', 'Well draining potting mix with some perlite and bark',
 'Let the top few cm of soil dry before watering again. Wipe the leaves sometimes and give it a moss pole when it starts to climb.'),

('Snake Plant', 'Dracaena trifasciata',
 'Tall stiff leaves that grow straight up. Very hard to kill, good for beginners.',
 'Small amount, only when the soil is completely dry', 14,
 'Low to bright indirect light', 15, 29,
 'Normal room humidity is fine', 'Cactus or succulent mix with good drainage',
 'Overwatering is the main thing that kills it. In winter water it even less, around once a month.'),

('Pothos', 'Epipremnum aureum',
 'Fast growing vine with heart shaped leaves, looks nice in hanging pots.',
 'Medium amount, water until it drains', 7,
 'Medium to bright indirect light, it survives in low light too', 15, 29,
 'Normal room humidity', 'Regular potting mix',
 'The leaves droop a little when it''s thirsty. Cut long vines to make it fuller, the cuttings grow roots in water.'),

('Peace Lily', 'Spathiphyllum wallisii',
 'Dark green leaves and white flowers. It droops when it needs water so it kind of tells you.',
 'Keep the soil a bit moist, water until it drains', 7,
 'Medium to bright indirect light', 18, 27,
 'Medium to high', 'Rich potting mix that holds some water',
 'Don''t let it sit in water. Wipe the big leaves when they get dusty and cut old flowers off at the base.'),

('Spider Plant', 'Chlorophytum comosum',
 'Long thin striped leaves, makes little baby plants that hang down from it.',
 'Medium, keep the soil a little moist but not wet', 7,
 'Bright indirect light', 13, 27,
 'Normal room humidity', 'Regular well draining potting mix',
 'Brown tips happen sometimes, tap water can cause it. You can cut the babies off and plant them in their own pots.'),

('Aloe Vera', 'Aloe vera',
 'Succulent with thick spiky leaves full of gel.',
 'Deep watering but only when the soil is fully dry', 14,
 'Bright light, a few hours of direct sun is ok', 13, 27,
 'Low, dry air is fine', 'Cactus or succulent mix',
 'Use a pot with a drainage hole, it rots if the roots stay wet. Water less in winter.'),

('ZZ Plant', 'Zamioculcas zamiifolia',
 'Shiny dark green leaves. It stores water in its roots so it handles dry soil really well.',
 'Small amount, let the soil dry out completely first', 14,
 'Low to bright indirect light', 15, 26,
 'Normal room humidity', 'Well draining potting mix',
 'Yellow leaves usually mean too much water. It grows slowly so don''t worry if nothing happens for a while.'),

('Rubber Plant', 'Ficus elastica',
 'Big glossy leaves, it can grow into a small tree inside.',
 'Medium amount, water when the top few cm are dry', 10,
 'Bright indirect light', 16, 27,
 'Medium', 'Well draining potting mix',
 'Wipe the leaves with a wet cloth sometimes. The white sap can irritate skin so be careful when you cut it.'),

('Fiddle Leaf Fig', 'Ficus lyrata',
 'Large violin shaped leaves. Popular but a little picky.',
 'Water well, then let the top few cm dry', 7,
 'Lots of bright indirect light, some morning sun is good', 16, 27,
 'Medium (40-60%)', 'Well draining indoor plant mix',
 'It doesn''t like being moved or cold drafts and can drop leaves. Turn the pot every few weeks so it grows straight.'),

('Jade Plant', 'Crassula ovata',
 'Small tree-like succulent with thick round leaves.',
 'Small amount, only when the soil is dry', 14,
 'Bright light, a few hours of direct sun is good', 13, 27,
 'Low, dry air is fine', 'Cactus or succulent mix',
 'Wrinkly leaves mean it needs water, soft yellow leaves mean too much water. Water less in winter.'),

('Boston Fern', 'Nephrolepis exaltata',
 'Bushy fern with long arching fronds.',
 'A lot, keep the soil moist all the time but not soggy', 3,
 'Bright indirect light, no direct sun', 16, 24,
 'High (above 50%)', 'Peat based mix that holds water',
 'Needs humid air, a bathroom with a window is a good spot. Brown crispy fronds mean the air or soil is too dry.'),

('Moth Orchid', 'Phalaenopsis',
 'Orchid with flowers that last for weeks on a tall stem.',
 'Water well and let it drain, never leave it sitting in water', 7,
 'Bright indirect light, no direct sun', 18, 29,
 'Medium to high (50-70%)', 'Orchid bark mix, not normal soil',
 'Roots look green after watering and silver when they are dry. When the flowers fall you can cut the stem above a node.'),

-- my own plants, added for the plant identification
('Aglaonema', 'Aglaonema (red hybrid)',
 'Also called chinese evergreen. Green leaves with red edges and pink spots, it grows slowly and stays compact.',
 'Medium amount, water when the top few cm are dry', 7,
 'Medium to bright indirect light, red types need more light to keep the color', 16, 29,
 'Medium (40-60%)', 'Well draining potting mix',
 'Keep it away from cold windows and drafts, it doesn''t like it under 15 C. Wipe the leaves sometimes. The sap can irritate skin.'),

('Zebra Haworthia', 'Haworthiopsis attenuata',
 'Small succulent with thick pointy leaves covered in white stripes, a bit like a tiny aloe.',
 'Small amount, only when the soil is completely dry', 14,
 'Bright light, some morning sun is ok', 10, 30,
 'Low, dry air is fine', 'Cactus or succulent mix',
 'Water even less in winter. Strong summer sun can turn the leaves red or brown. It grows slowly and makes small babies at the base.');

-- common problems
-- plant_id is the order of the plants above (1 = Monstera, 2 = Snake Plant ...)
INSERT INTO problems (plant_id, problem, solution) VALUES
(1, 'Yellow leaves', 'Usually too much water. Let the soil dry more between waterings.'),
(1, 'Brown crispy edges', 'Air is too dry or it stayed dry for too long.'),
(1, 'New leaves have no splits', 'Not enough light, move it closer to a window. Young plants don''t split yet.'),
(2, 'Soft mushy leaves', 'Root rot from overwatering. Cut off the bad parts and repot in dry soil.'),
(2, 'Leaves falling over', 'Too much water or not enough light.'),
(3, 'Yellow leaves', 'Too much water, let the top of the soil dry first.'),
(3, 'Long vines with few leaves', 'Not enough light. Move it somewhere brighter and trim the vines.'),
(3, 'Brown crispy leaves', 'It''s too dry, water a bit more often.'),
(4, 'Drooping leaves', 'It needs water, usually comes back a few hours after watering.'),
(4, 'No flowers', 'Not enough light, move it to a brighter spot.'),
(4, 'Brown leaf tips', 'Dry air or chemicals in tap water. Try filtered water.'),
(5, 'Brown tips', 'Fluoride in tap water or dry air. Use filtered or rain water.'),
(5, 'Pale faded leaves', 'Too much direct sun.'),
(5, 'No baby plants', 'Plant is still young or needs more light.'),
(6, 'Soft brown leaves', 'Too much water, let the soil dry out completely.'),
(6, 'Thin curling leaves', 'It''s thirsty, give it a good drink.'),
(6, 'Stretched pale growth', 'Not enough light.'),
(7, 'Yellow leaves', 'Too much water, let it dry out completely.'),
(7, 'Wrinkled stems', 'It''s very thirsty, water it.'),
(8, 'Dropping leaves', 'Sudden change in temperature or light, or too much water.'),
(8, 'Yellow leaves', 'Too much water.'),
(8, 'Drooping leaves', 'Needs water or the room is too cold.'),
(9, 'Brown spots on leaves', 'Usually root rot from too much water.'),
(9, 'Dropping leaves', 'It was moved or it''s near a cold draft.'),
(9, 'Small leaves and long stems', 'Not enough light.'),
(10, 'Wrinkled leaves', 'It needs water.'),
(10, 'Soft yellow leaves', 'Too much water.'),
(10, 'Leaves falling off', 'Too much or too little water, or it''s too cold.'),
(11, 'Brown crispy fronds', 'Air is too dry, raise the humidity.'),
(11, 'Yellow fronds', 'Too much or too little water, check the soil.'),
(11, 'Leaflets dropping', 'Not enough humidity or light.'),
(12, 'Wrinkled leaves', 'Not enough water or the roots are damaged.'),
(12, 'Mushy brown roots', 'Root rot. Cut the rotten roots and repot in fresh bark.'),
(12, 'Won''t flower again', 'Needs more light, or a bit cooler nights to start blooming.'),
(13, 'Leaves losing the red color', 'Not enough light, move it to a brighter spot.'),
(13, 'Brown leaf tips', 'Dry air or too much fertilizer.'),
(13, 'Yellow lower leaves', 'Too much water, or just old leaves dying.'),
(14, 'Soft mushy leaves', 'Too much water. Let it dry out completely and check the roots.'),
(14, 'Leaves turning red or brown', 'Too much direct sun, move it a bit away from the window.'),
(14, 'Thin wrinkled leaves', 'It needs water.');

-- light and humidity for the recommendations (same info as the text above)
UPDATE plants SET min_light = 3, max_light = 3, likes_humid = true WHERE name = 'Monstera';
UPDATE plants SET min_light = 1, max_light = 3 WHERE name = 'Snake Plant';
UPDATE plants SET min_light = 1, max_light = 3 WHERE name = 'Pothos';
UPDATE plants SET min_light = 2, max_light = 3, likes_humid = true WHERE name = 'Peace Lily';
UPDATE plants SET min_light = 3, max_light = 3 WHERE name = 'Spider Plant';
UPDATE plants SET min_light = 3, max_light = 4 WHERE name = 'Aloe Vera';
UPDATE plants SET min_light = 1, max_light = 3 WHERE name = 'ZZ Plant';
UPDATE plants SET min_light = 3, max_light = 3 WHERE name = 'Rubber Plant';
UPDATE plants SET min_light = 3, max_light = 4 WHERE name = 'Fiddle Leaf Fig';
UPDATE plants SET min_light = 3, max_light = 4 WHERE name = 'Jade Plant';
UPDATE plants SET min_light = 3, max_light = 3, likes_humid = true WHERE name = 'Boston Fern';
UPDATE plants SET min_light = 3, max_light = 3, likes_humid = true WHERE name = 'Moth Orchid';
UPDATE plants SET min_light = 2, max_light = 3 WHERE name = 'Aglaonema';
UPDATE plants SET min_light = 3, max_light = 4 WHERE name = 'Zebra Haworthia';

-- SELECT * FROM plants;
-- SELECT * FROM problems WHERE plant_id = 1;
