/* Recup JSON */
function readTextFile (file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status === 200) {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

// Fonction affichage photographe + trie
function filterTag (tag = null) {
  readTextFile("photographe.json", function (text) {
    const data = JSON.parse(text);
    let contentPhotographers = null;
    if (tag != null) {
      const tagsButton = document.getElementById(`tag-${tag}`);
      const classTagButton = document.querySelectorAll(
        `.tag-button:not(#tag-${tag})`
      );
      if (tagsButton.classList[1] === "select") {
        tagsButton.classList.remove("select");
        contentPhotographers = data.photographers;
      } else {
        for (let i = 0; i < classTagButton.length; i++) {
          if (classTagButton[i].classList[1] === "select") {
            classTagButton[i].classList.remove("select");
            tagsButton.classList.add("select");
            contentPhotographers = data.photographers.filter((photographers) =>
              photographers.tags.includes(tag)
            );
          } else {
            tagsButton.classList.add("select");
            contentPhotographers = data.photographers.filter((photographers) =>
              photographers.tags.includes(tag)
            );
          }
        }
      }
    } else {
      contentPhotographers = data.photographers; 
    }
    const main = document.getElementById("main");
    main.innerHTML = "";
    contentPhotographers.forEach((element) => {
      const mainPhotographe = document.createElement("a");
      mainPhotographe.setAttribute("href", `photographe.html?id=${element.id}`);
      mainPhotographe.setAttribute("class", "main-photographe");

      const img = document.createElement("img");
      img.setAttribute("role", "img");
      img.setAttribute("alt", `Photo de ${element.name}`);
      img.src = element.portrait;

      const mainText = document.createElement("div");
      mainText.setAttribute("class", "main-text");

      const name = document.createElement("h2");
      name.innerHTML = element.name;

      const loc = document.createElement("h3");
      loc.setAttribute("class", "main-text_loc");
      loc.innerHTML = element.city + ", " + element.country;

      const description = document.createElement("p");
      description.setAttribute("class", "main-text_description");
      description.innerHTML = element.tagline;

      const price = document.createElement("span");
      price.setAttribute("class", "main-text_price");
      price.innerHTML = element.price + "€/jour";

      const mainTag = document.createElement("div");
      mainTag.setAttribute("class", "main-text_tag");

      for (let i = 0; i < element.tags.length; i++) {
        const tag = document.createElement("span");
        const tags = element.tags;
        tag.innerHTML = tags[i];
        mainTag.append(tag);
      }

      main.append(mainPhotographe);
      mainPhotographe.append(img);
      mainPhotographe.append(mainText);
      mainText.append(name);
      mainText.append(loc);
      mainText.append(description);
      mainText.append(price);
      mainText.append(mainTag);
    });
  });
}

filterTag();