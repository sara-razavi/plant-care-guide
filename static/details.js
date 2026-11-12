// details page, the plant name comes from the url
// e.g. /plant?name=Monstera

const params = new URLSearchParams(window.location.search);
const plantName = params.get("name");

let plant = null;

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

// "1 day" not "1 days"
function daysText(n) {
  if (n == 1) {
    return "1 day";
  }
  return n + " days";
}

// new Date("2026-11-05") is midnight in UTC, that's 3:30 in the morning here,
// so after midnight the days were wrong. this makes the date in local time
function toLocalDate(text) {
  const parts = text.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// same problem with toISOString(), it gives the UTC date
function todayText() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

function showNotFound() {
  document.title = "Plant not found - Plant Care Guide";
  document.getElementById("plant-name").textContent = "Plant not found";
  document.getElementById("plant-info").style.display = "none";
  document.getElementById("not-found").style.display = "block";
}

function showError() {
  document.title = "Error - Plant Care Guide";
  document.getElementById("plant-name").textContent = "Something went wrong";
  document.getElementById("plant-info").style.display = "none";
  document.getElementById("load-error").style.display = "block";
}

function showPlant() {
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

  document.getElementById("humidity").textContent = plant.humidity;
  document.getElementById("soil").textContent = plant.soil;

  // common problems, click one to see the solution
  const problemList = document.getElementById("problems");
  for (let i = 0; i < plant.problems.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = "<strong>" + plant.problems[i].problem + "</strong>" +
      '<p class="solution">' + plant.problems[i].solution + "</p>";
    li.addEventListener("click", function () {
      li.classList.toggle("open");
    });
    problemList.appendChild(li);
  }

  // the watering date saved from last time (if there is one)
  const saved = localStorage.getItem("watered_" + plant.name);
  if (saved != null) {
    lastWatered.value = saved;
    showNextWatering();
  }

  loadPhotos();
}

// photos of this plant that were uploaded before
function loadPhotos() {
  fetch("/api/plants/" + plant.name + "/photos")
    .then(function (response) {
      return response.json();
    })
    .then(function (photos) {
      const box = document.getElementById("photos");
      box.innerHTML = "";

      if (photos.length == 0) {
        box.innerHTML = '<p class="note">No photos yet.</p>';
        return;
      }

      for (let i = 0; i < photos.length; i++) {
        const div = document.createElement("div");
        div.className = "photo";
        div.innerHTML = '<img src="' + photos[i].url + '" alt="' + plant.name + '">' +
          "<p>" + photos[i].date + "</p>";
        box.appendChild(div);
      }
    });
}

// ask the backend for this plant
fetch("/api/plants/" + plantName)
  .then(function (response) {
    // 404 = no plant with this name (or no name at all)
    if (response.status == 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error("server error " + response.status);
    }
    return response.json();
  })
  .then(function (data) {
    if (data == null) {
      showNotFound();
    } else {
      plant = data;
      showPlant();
    }
  })
  .catch(function () {
    // usually postgres is not running, before the page just stayed empty
    showError();
  });

// next watering, from the day it was last watered
const lastWatered = document.getElementById("last-watered");
const nextWatering = document.getElementById("next-watering");

function showNextWatering() {
  if (lastWatered.value == "") {
    nextWatering.textContent = "";
    return;
  }

  const last = toLocalDate(lastWatered.value);
  const next = new Date(last);
  next.setDate(next.getDate() + plant.watering_days);

  // compare whole days, the time of day doesn't matter
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((next - today) / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    nextWatering.textContent = "Next watering: " + next.toDateString() + " (in " + daysText(daysLeft) + ")";
  } else if (daysLeft == 0) {
    nextWatering.textContent = "Water it today!";
  } else {
    nextWatering.textContent = "Watering is " + daysText(-daysLeft) + " late, water it now!";
  }
}

lastWatered.addEventListener("change", function () {
  // remember it for this plant, so it's still there next time
  if (lastWatered.value == "") {
    localStorage.removeItem("watered_" + plant.name);
  } else {
    localStorage.setItem("watered_" + plant.name, lastWatered.value);
  }
  showNextWatering();
});

document.getElementById("watered-today").addEventListener("click", function () {
  lastWatered.value = todayText();
  localStorage.setItem("watered_" + plant.name, lastWatered.value);
  showNextWatering();
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

// enter works too, not only the button
roomTemp.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    document.getElementById("check-temp").click();
  }
});

// upload a photo of your plant
const photoInput = document.getElementById("photo-input");
const uploadResult = document.getElementById("upload-result");

document.getElementById("upload-btn").addEventListener("click", function () {
  if (photoInput.files.length == 0) {
    uploadResult.textContent = "Choose a photo first.";
    uploadResult.style.color = "#777";
    return;
  }

  const formData = new FormData();
  formData.append("photo", photoInput.files[0]);
  uploadResult.textContent = "Uploading...";
  uploadResult.style.color = "#777";

  fetch("/api/plants/" + plant.name + "/photos", { method: "POST", body: formData })
    .then(function (response) {
      // flask sends 413 as an html page, not json
      if (response.status == 413) {
        return { error: "The photo is too big, the limit is 10 MB." };
      }
      return response.json();
    })
    .then(function (data) {
      if (data.error) {
        uploadResult.textContent = data.error;
        uploadResult.style.color = "#b03a2e";
        return;
      }
      uploadResult.textContent = "Photo saved!";
      uploadResult.style.color = "#2e5e3e";
      photoInput.value = "";
      loadPhotos();
    })
    .catch(function () {
      uploadResult.textContent = "Something went wrong, try again.";
      uploadResult.style.color = "#b03a2e";
    });
});
