// plant data for the details page, copied from database.sql
// not all the columns yet, adding them when the page needs them

const plants = [
  {
    name: "Monstera",
    scientific_name: "Monstera deliciosa",
    description: "Big tropical plant with holes and splits in the leaves, also called swiss cheese plant.",
    water_amount: "Water well until it comes out of the drainage holes",
    watering_days: 7,
    light: "Bright indirect light, no harsh direct sun",
    min_temp: 18,
    max_temp: 30,
    care_instructions: "Let the top few cm of soil dry before watering again. Wipe the leaves sometimes and give it a moss pole when it starts to climb."
  },
  {
    name: "Snake Plant",
    scientific_name: "Dracaena trifasciata",
    description: "Tall stiff leaves that grow straight up. Very hard to kill, good for beginners.",
    water_amount: "Small amount, only when the soil is completely dry",
    watering_days: 14,
    light: "Low to bright indirect light",
    min_temp: 15,
    max_temp: 29,
    care_instructions: "Overwatering is the main thing that kills it. In winter water it even less, around once a month."
  },
  {
    name: "Pothos",
    scientific_name: "Epipremnum aureum",
    description: "Fast growing vine with heart shaped leaves, looks nice in hanging pots.",
    water_amount: "Medium amount, water until it drains",
    watering_days: 7,
    light: "Medium to bright indirect light, it survives in low light too",
    min_temp: 15,
    max_temp: 29,
    care_instructions: "The leaves droop a little when it's thirsty. Cut long vines to make it fuller, the cuttings grow roots in water."
  },
  {
    name: "Peace Lily",
    scientific_name: "Spathiphyllum wallisii",
    description: "Dark green leaves and white flowers. It droops when it needs water so it kind of tells you.",
    water_amount: "Keep the soil a bit moist, water until it drains",
    watering_days: 7,
    light: "Medium to bright indirect light",
    min_temp: 18,
    max_temp: 27,
    care_instructions: "Don't let it sit in water. Wipe the big leaves when they get dusty and cut old flowers off at the base."
  },
  {
    name: "Spider Plant",
    scientific_name: "Chlorophytum comosum",
    description: "Long thin striped leaves, makes little baby plants that hang down from it.",
    water_amount: "Medium, keep the soil a little moist but not wet",
    watering_days: 7,
    light: "Bright indirect light",
    min_temp: 13,
    max_temp: 27,
    care_instructions: "Brown tips happen sometimes, tap water can cause it. You can cut the babies off and plant them in their own pots."
  },
  {
    name: "Aloe Vera",
    scientific_name: "Aloe vera",
    description: "Succulent with thick spiky leaves full of gel.",
    water_amount: "Deep watering but only when the soil is fully dry",
    watering_days: 14,
    light: "Bright light, a few hours of direct sun is ok",
    min_temp: 13,
    max_temp: 27,
    care_instructions: "Use a pot with a drainage hole, it rots if the roots stay wet. Water less in winter."
  },
  {
    name: "ZZ Plant",
    scientific_name: "Zamioculcas zamiifolia",
    description: "Shiny dark green leaves. It stores water in its roots so it handles dry soil really well.",
    water_amount: "Small amount, let the soil dry out completely first",
    watering_days: 14,
    light: "Low to bright indirect light",
    min_temp: 15,
    max_temp: 26,
    care_instructions: "Yellow leaves usually mean too much water. It grows slowly so don't worry if nothing happens for a while."
  },
  {
    name: "Rubber Plant",
    scientific_name: "Ficus elastica",
    description: "Big glossy leaves, it can grow into a small tree inside.",
    water_amount: "Medium amount, water when the top few cm are dry",
    watering_days: 10,
    light: "Bright indirect light",
    min_temp: 16,
    max_temp: 27,
    care_instructions: "Wipe the leaves with a wet cloth sometimes. The white sap can irritate skin so be careful when you cut it."
  },
  {
    name: "Fiddle Leaf Fig",
    scientific_name: "Ficus lyrata",
    description: "Large violin shaped leaves. Popular but a little picky.",
    water_amount: "Water well, then let the top few cm dry",
    watering_days: 7,
    light: "Lots of bright indirect light, some morning sun is good",
    min_temp: 16,
    max_temp: 27,
    care_instructions: "It doesn't like being moved or cold drafts and can drop leaves. Turn the pot every few weeks so it grows straight."
  },
  {
    name: "Jade Plant",
    scientific_name: "Crassula ovata",
    description: "Small tree-like succulent with thick round leaves.",
    water_amount: "Small amount, only when the soil is dry",
    watering_days: 14,
    light: "Bright light, a few hours of direct sun is good",
    min_temp: 13,
    max_temp: 27,
    care_instructions: "Wrinkly leaves mean it needs water, soft yellow leaves mean too much water. Water less in winter."
  },
  {
    name: "Boston Fern",
    scientific_name: "Nephrolepis exaltata",
    description: "Bushy fern with long arching fronds.",
    water_amount: "A lot, keep the soil moist all the time but not soggy",
    watering_days: 3,
    light: "Bright indirect light, no direct sun",
    min_temp: 16,
    max_temp: 24,
    care_instructions: "Needs humid air, a bathroom with a window is a good spot. Brown crispy fronds mean the air or soil is too dry."
  },
  {
    name: "Moth Orchid",
    scientific_name: "Phalaenopsis",
    description: "Orchid with flowers that last for weeks on a tall stem.",
    water_amount: "Water well and let it drain, never leave it sitting in water",
    watering_days: 7,
    light: "Bright indirect light, no direct sun",
    min_temp: 18,
    max_temp: 29,
    care_instructions: "Roots look green after watering and silver when they are dry. When the flowers fall you can cut the stem above a node."
  }
];
