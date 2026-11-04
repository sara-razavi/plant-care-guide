// details page, the plant name comes from the url
// e.g. plant.html?name=Monstera

const params = new URLSearchParams(window.location.search);
const plantName = params.get("name");

let plant = null;
for (let i = 0; i < plants.length; i++) {
  // ignore upper/lower case so ?name=monstera works too
  if (plantName != null && plants[i].name.toLowerCase() == plantName.toLowerCase()) {
    plant = plants[i];
  }
}

// wrong or missing name in the url
if (plant == null) {
  document.title = "Plant not found - Plant Care Guide";
  document.getElementById("plant-name").textContent = "Plant not found";
  document.getElementById("plant-info").style.display = "none";
  document.getElementById("not-found").style.display = "block";
} else {
  document.title = plant.name + " - Plant Care Guide";
  document.getElementById("plant-name").textContent = plant.name;
  document.getElementById("sci-name").textContent = plant.scientific_name;
  document.getElementById("description").textContent = plant.description;
  document.getElementById("care").textContent = plant.care_instructions;
}
