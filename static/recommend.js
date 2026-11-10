// recommend page, sends the answers to the backend and shows the plants that fit

const resultsBox = document.getElementById("results");
const resultList = document.getElementById("result-list");
const resultCount = document.getElementById("result-count");
const tipList = document.getElementById("care-tips");

document.getElementById("recommend-btn").addEventListener("click", function () {
  const light = document.getElementById("light").value;
  const water = document.getElementById("water").value;
  const dry = document.getElementById("dry").value;
  const temp = document.getElementById("temp").value;

  const url = "/api/recommend?light=" + light + "&water=" + water + "&dry=" + dry + "&temp=" + temp;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // remove the results of the last search
      resultList.innerHTML = "";
      tipList.innerHTML = "";

      for (let i = 0; i < data.tips.length; i++) {
        const li = document.createElement("li");
        li.textContent = data.tips[i];
        tipList.appendChild(li);
      }

      if (data.plants.length == 0) {
        resultCount.textContent = "No plant fits all of these, try changing an answer.";
      } else {
        resultCount.textContent = data.plants.length + " plants fit your home:";
      }

      // same cards as the home page, with the watering too
      for (let i = 0; i < data.plants.length; i++) {
        const p = data.plants[i];
        const card = document.createElement("div");
        card.className = "plant-card";
        card.innerHTML = "<h3>" + p.name + "</h3>" +
          '<p class="sci-name">' + p.scientific_name + "</p>" +
          "<p>" + p.description + "</p>" +
          '<p class="note">Water every ' + p.watering_days + " days</p>" +
          '<a href="/plant?name=' + p.name + '">See care guide</a>';
        card.addEventListener("click", function () {
          window.location.href = "/plant?name=" + p.name;
        });
        resultList.appendChild(card);
      }

      resultsBox.style.display = "block";
    });
});
