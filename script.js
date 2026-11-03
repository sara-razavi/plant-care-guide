// search plants on the home page

const searchInput = document.getElementById("search");
const cards = document.querySelectorAll(".plant-card");
const noResult = document.getElementById("no-result");

searchInput.addEventListener("input", function () {
  const text = searchInput.value.toLowerCase();
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
