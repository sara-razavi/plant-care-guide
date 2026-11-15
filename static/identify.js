// identify page, sends the photo to the backend and shows what the model thinks it is

const photoInput = document.getElementById("identify-input");
const preview = document.getElementById("preview");
const button = document.getElementById("identify-btn");
const result = document.getElementById("identify-result");
const guessList = document.getElementById("guesses");

// under this the model is mostly guessing (on the test photos it was right only 23% of the time)
const NOT_SURE = 25;

function photoUrl(name) {
  return "/static/images/" + name.toLowerCase().replaceAll(" ", "_") + ".jpg";
}

// show the photo before sending it, and clear the old result
photoInput.addEventListener("change", function () {
  result.textContent = "";
  guessList.innerHTML = "";
  if (photoInput.files.length > 0) {
    preview.src = URL.createObjectURL(photoInput.files[0]);
    preview.style.display = "block";
  }
});

button.addEventListener("click", function () {
  guessList.innerHTML = "";

  if (photoInput.files.length == 0) {
    result.textContent = "Choose a photo first.";
    result.style.color = "#777";
    return;
  }

  const formData = new FormData();
  formData.append("photo", photoInput.files[0]);
  result.textContent = "Looking at the photo...";
  result.style.color = "#777";
  // so it doesn't send the same photo twice
  button.disabled = true;

  fetch("/api/identify", { method: "POST", body: formData })
    .then(function (response) {
      if (response.status == 413) {
        return { error: "The photo is too big, the limit is 10 MB." };
      }
      return response.json();
    })
    .then(function (data) {
      button.disabled = false;
      if (data.error) {
        result.textContent = data.error;
        result.style.color = "#b03a2e";
        return;
      }

      const best = data.guesses[0];
      if (best.percent < NOT_SURE) {
        result.textContent = "Not sure, maybe " + best.name + "? Try a clearer photo of the whole plant.";
        result.style.color = "#b8860b";
      } else {
        result.textContent = "Best guess: " + best.name;
        result.style.color = "#2e5e3e";
      }

      // the guesses with a small photo and a bar for how sure it is
      for (let i = 0; i < data.guesses.length; i++) {
        const g = data.guesses[i];
        const li = document.createElement("li");
        li.innerHTML = '<img class="guess-img" src="' + photoUrl(g.name) + '" alt="' + g.name + '">' +
          '<div class="guess-text"><a href="/plant?name=' + g.name + '">' + g.name + "</a> " + g.percent + "%" +
          '<div class="bar"><div class="bar-fill" style="width: ' + g.percent + '%"></div></div></div>';
        guessList.appendChild(li);
      }
    })
    .catch(function () {
      button.disabled = false;
      result.textContent = "Something went wrong, try again.";
      result.style.color = "#b03a2e";
    });
});
