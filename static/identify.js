// identify page, sends the photo to the backend and shows what the model thinks it is

const photoInput = document.getElementById("identify-input");
const preview = document.getElementById("preview");
const result = document.getElementById("identify-result");
const guessList = document.getElementById("guesses");

// show the photo before sending it
photoInput.addEventListener("change", function () {
  if (photoInput.files.length > 0) {
    preview.src = URL.createObjectURL(photoInput.files[0]);
    preview.style.display = "block";
  }
});

document.getElementById("identify-btn").addEventListener("click", function () {
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

  fetch("/api/identify", { method: "POST", body: formData })
    .then(function (response) {
      if (response.status == 413) {
        return { error: "The photo is too big, the limit is 10 MB." };
      }
      return response.json();
    })
    .then(function (data) {
      if (data.error) {
        result.textContent = data.error;
        result.style.color = "#b03a2e";
        return;
      }

      result.textContent = "Best guess: " + data.guesses[0].name;
      result.style.color = "#2e5e3e";

      // the guesses with a bar for how sure it is
      for (let i = 0; i < data.guesses.length; i++) {
        const g = data.guesses[i];
        const li = document.createElement("li");
        li.innerHTML = '<a href="/plant?name=' + g.name + '">' + g.name + "</a> " + g.percent + "%" +
          '<div class="bar"><div class="bar-fill" style="width: ' + g.percent + '%"></div></div>';
        guessList.appendChild(li);
      }
    })
    .catch(function () {
      result.textContent = "Something went wrong, try again.";
      result.style.color = "#b03a2e";
    });
});
