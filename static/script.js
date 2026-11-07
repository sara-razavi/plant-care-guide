// home page, gets the plants from the backend and makes the cards
// then the search works on those cards

const plantList = document.getElementById("plant-list");
const searchInput = document.getElementById("search");
const noResult = document.getElementById("no-result");

fetch("/api/plants")
  .then(function (response) {
    return response.json();
  })
  .then(function (plants) {
    for (let i = 0; i < plants.length; i++) {
      const card = document.createElement("div");
      card.className = "plant-card";
      card.innerHTML = "<h3>" + plants[i].name + "</h3>" +
        '<p class="sci-name">' + plants[i].scientific_name + "</p>" +
        "<p>" + plants[i].description + "</p>" +
        '<a href="/plant?name=' + plants[i].name + '">See care guide</a>';
      plantList.appendChild(card);
    }
  });

searchInput.addEventListener("input", function () {
  const text = searchInput.value.toLowerCase();
  // get the cards here, they don't exist yet when the page loads
  const cards = document.querySelectorAll(".plant-card");
  let found = 0;

  for (let i = 0; i < cards.length; i++) {
    const name = cards[i].querySelector("h3").textContent.toLowerCase();
    const sciName = cards[i].querySelector(".sci-name").textContent.toLowerCase();

    // check both names, so "ficus" finds the rubber plant too
    if (name.includes(text) || sciName.includes(text)) {
      cards[i].style.display = "block";
      found++;
    } else {
      cards[i].style.display = "none";
    }
  }

  if (found == 0) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }
});
