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

function wateringText(days) {
  if (days == 7) {
    return "Once a week";
  } else if (days == 14) {
    return "Every 2 weeks";
  }
  return "Every " + days + " days";
}

function toFahrenheit(c) {
  return Math.round(c * 9 / 5 + 32);
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

  document.getElementById("water-amount").textContent = plant.water_amount;
  document.getElementById("watering-days").textContent = wateringText(plant.watering_days);

  document.getElementById("light").textContent = plant.light;
  document.getElementById("temperature").textContent = plant.min_temp + " to " + plant.max_temp + " °C (" +
    toFahrenheit(plant.min_temp) + " to " + toFahrenheit(plant.max_temp) + " °F)";
}

// next watering, from the day it was last watered
const lastWatered = document.getElementById("last-watered");
const nextWatering = document.getElementById("next-watering");

lastWatered.addEventListener("change", function () {
  if (lastWatered.value == "") {
    nextWatering.textContent = "";
    return;
  }

  const last = new Date(lastWatered.value);
  const next = new Date(last);
  next.setDate(next.getDate() + plant.watering_days);

  const today = new Date();
  const daysLeft = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    nextWatering.textContent = "Next watering: " + next.toDateString() + " (in " + daysLeft + " days)";
  } else if (daysLeft == 0) {
    nextWatering.textContent = "Water it today!";
  } else {
    nextWatering.textContent = "Watering is " + (-daysLeft) + " days late, water it now!";
  }
});

// is the room ok for this plant?
const roomTemp = document.getElementById("room-temp");
const tempResult = document.getElementById("temp-result");

document.getElementById("check-temp").addEventListener("click", function () {
  if (roomTemp.value == "") {
    tempResult.textContent = "Type your room temperature first.";
    tempResult.style.color = "#777";
    return;
  }

  const temp = Number(roomTemp.value);

  if (temp < plant.min_temp) {
    tempResult.textContent = "Too cold for it, it needs at least " + plant.min_temp + " °C.";
    tempResult.style.color = "#b03a2e";
  } else if (temp > plant.max_temp) {
    tempResult.textContent = "Too hot for it, try to keep it at " + plant.max_temp + " °C or less.";
    tempResult.style.color = "#b03a2e";
  } else {
    tempResult.textContent = "Good, " + plant.name + " is fine at this temperature.";
    tempResult.style.color = "#2e5e3e";
  }
});
