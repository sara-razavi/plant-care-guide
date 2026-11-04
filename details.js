// details page, the plant name comes from the url
// e.g. plant.html?name=Monstera

const params = new URLSearchParams(window.location.search);
const plantName = params.get("name");

let plant = null;
for (let i = 0; i < plants.length; i++) {
  if (plants[i].name == plantName) {
    plant = plants[i];
  }
}

document.title = plant.name + " - Plant Care Guide";
document.getElementById("plant-name").textContent = plant.name;
document.getElementById("sci-name").textContent = plant.scientific_name;
document.getElementById("description").textContent = plant.description;
document.getElementById("care").textContent = plant.care_instructions;
