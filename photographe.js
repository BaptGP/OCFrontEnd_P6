//Recup JSON
const queryStringUrlId = window.location.search;
const myID = queryStringUrlId.slice(4);
if (queryStringUrlId.length <= 4) {
  window.location = "index.html";
}
let objectPhotographers = null;
let objectMedia = null;

function ajaxGet (file) {
  return new Promise(function (resolve, reject) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          resolve(xmlhttp.responseText);
        } else {
          reject(xmlhttp);
        }
      }
    };
    xmlhttp.onerror = function (error) {
      reject(error);
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send(null);
  });
}

ajaxGet("photographe.json")
  .then((response) => {
    const data = JSON.parse(response);
    objectPhotographers = data.photographers.filter((item) => item.id == myID);
    objectMedia = data.media.filter((item) => item.photographerId == myID);
    content();
    trie();
    totalLike();
    modal();
    accessibility();
  })
  .catch((erreur) => {
    console.log(erreur);
  });

//Fonction Banniere
function content () {
  /* BANNER */
  for (const element of objectPhotographers) {
    const banner = document.getElementById("banner");
    const bannerText = document.getElementById("banner-text");
    const totalLike = document.getElementById("total-like");

    const name = document.createElement("h1");
    name.innerHTML = element.name;

    const loc = document.createElement("h2");
    loc.setAttribute("class", "banner-text_loc");
    loc.innerHTML = element.city + ", " + element.country;

    const description = document.createElement("p");
    description.setAttribute("class", "banner-text_description");
    description.innerHTML = element.tagline;

    const tag = document.createElement("div");
    tag.setAttribute("class", "tag");
    for (let i = 0; i < element.tags.length; i++) {
      const tagOne = document.createElement("span");
      const tags = element.tags;
      tagOne.innerHTML = "#" + tags[i];
      tag.append(tagOne);
    }

    const img = document.createElement("img");
    img.setAttribute("alt", `photo de ${element.name}`);
    img.src = element.portrait;

    const price = document.createElement("span");
    price.innerHTML = element.price + "€/jour";

    bannerText.append(name);
    bannerText.append(loc);
    bannerText.append(description);
    bannerText.append(tag);
    banner.append(img);
    totalLike.append(price);
  }
}
//Fonction Media
function media (content) {
  /* CONTENT */
  let incImg = 0;
  const contentImg = document.getElementById("content-img");
  const slides = document.getElementById("slides");
  slides.innerHTML = "";
  contentImg.innerHTML = "";
  for (const element of content) {
    const contentBlock = document.createElement("div");
    contentBlock.setAttribute("class", "content-img-block");

    incImg += 1;

    if (element.image) {
      const img = document.createElement("img");
      const aImg = document.createElement("a");
      aImg.setAttribute("onclick", `openModal();currentSlide(${incImg})`);
      aImg.setAttribute("href", "#");
      aImg.append(img);
      img.setAttribute("class", "content-image");
      img.setAttribute("alt", `${element.title}`);
      img.src = `Sample_Photos/${element.photographerId}/${element.image}`;
      contentBlock.append(aImg);
    } else if (element.video) {
      const divVideo = document.createElement("a");
      divVideo.setAttribute("class", "div-video");
      divVideo.setAttribute("href", "#");
      const video = document.createElement("video");
      const iconVideo = document.createElement("img");
      iconVideo.src = "Sample_Photos/pngegg.png";
      iconVideo.setAttribute("class", "icone-video");
      iconVideo.setAttribute("onclick", `openModal();currentSlide(${incImg})`);
      divVideo.setAttribute("onclick", `openModal();currentSlide(${incImg})`);
      video.src = `Sample_Photos/${element.photographerId}/${element.video}`;
      video.setAttribute("type", "video/mp4");
      video.setAttribute("onclick", `openModal();currentSlide(${incImg})`);
      divVideo.append(iconVideo);
      contentBlock.append(video);
      contentBlock.append(divVideo);
    }

    const contentText = document.createElement("div");
    contentText.setAttribute("class", "content-img-solo_text");

    const mySlides = document.createElement("div");
    mySlides.setAttribute("class", "mySlides");
    slides.append(mySlides);

    if (element.image) {
      const modalImg = document.createElement("img");
      modalImg.setAttribute("alt", `${element.title}`);
      modalImg.src = `Sample_Photos/${element.photographerId}/${element.image}`;
      mySlides.append(modalImg);
    } else if (element.video) {
      const modalVideo = document.createElement("video");
      modalVideo.setAttribute("autoplay", "true");
      modalVideo.setAttribute("controls", "controls");
      modalVideo.src = `Sample_Photos/${element.photographerId}/${element.video}`;
      modalVideo.setAttribute("type", "video/mp4");
      mySlides.append(modalVideo);
    }

    const title = document.createElement("h3");
    title.innerHTML = element.title;
    contentText.append(title);

    const divLike = document.createElement("div");
    divLike.setAttribute("class", "div-like");

    const like = document.createElement("div");
    like.innerHTML = element.likes;

    const iconLike = document.createElement("a");
    iconLike.setAttribute("class", "fas fa-heart");
    iconLike.setAttribute("href", "#");
    divLike.append(like);
    divLike.append(iconLike);

    iconLike.addEventListener("click", () => {
      const totalLikes = document.getElementById("total-like_number");
      if (iconLike.classList[2] === "red-heart") {
        iconLike.classList.remove("red-heart");
        like.innerHTML = element.likes;
        totalLikes.innerHTML = parseInt(totalLikes.innerHTML) - 1;
      } else {
        iconLike.classList.add("red-heart");
        like.innerHTML = element.likes + 1;      
        totalLikes.innerHTML = parseInt(totalLikes.innerHTML) + 1;
      }
    });

    contentImg.append(contentBlock);

    contentBlock.append(contentText);
    contentText.append(divLike);
  }
}
//Fonction Like
function totalLike () {
  let incLike = 0;
  for (let i = 0; i < objectMedia.length; i++) {
    incLike += objectMedia[i].likes;
  }
  const totalLikes = document.getElementById("total-like_number");
  totalLikes.innerHTML = incLike;
}
//Fonction contact
function modal () {
  const modalContact = document.querySelector(".modal-contact");
  const contact = document.getElementById("contact");
  const close = document.getElementById("close-modal");
  contact.addEventListener("click", function () {
    modalContact.style.display = "flex";
    document.getElementById("firstName").focus();
  });
  close.addEventListener("click", function () {
    modalContact.style.display = "none";
  });

  // Formulaire
  const form = document.getElementById("form");
  const errorMessages = {
    lastName: "Veuillez entrer un nom comportant 2 caractères ou plus.",
    firstName: "Veuillez entrer un prénom comportant 2 caractères ou plus.",
    email: "Veuillez entrer une adresse email valide.",
    message: "Veuillez rédiger un message"
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const msg = document.getElementById("msg").value;
    const regxEmail = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/;

    if (firstName.length < 2) {
      document.getElementById("prenom").innerHTML = errorMessages.firstName;
    } else {
      document.getElementById("prenom").innerHTML = "";
    }
    if (lastName.length < 2) {
      document.getElementById("nom").innerHTML = errorMessages.lastName;
    } else {
      document.getElementById("nom").innerHTML = "";
    }
    if (!regxEmail.test(email)) {
      document.getElementById("emailerror").innerHTML = errorMessages.email;
    } else {
      document.getElementById("emailerror").innerHTML = "";
      if (msg.length == null) {
        document.getElementById("msgerror").innerHTML = errorMessages.message;
      } else {
        document.getElementById("msgerror").innerHTML = "";
      }
    }
    if (
      firstName.length >= 2 &&
      lastName.length >= 2 &&
      regxEmail.test(email)
    ) {
      console.log({
        Prenom: firstName,
        Nom: lastName,
        Email: email,
        Message: msg
      });
      modalContact.style.display = "none";
    }
  });
}


// LIGHTBOX
function openModal () {
  document.getElementById("myModal").style.display = "block";
  document.addEventListener("keydown", (key) => {
    if (key.code === "ArrowRight") {
      plusSlides(1);
    } else if (key.code === "ArrowLeft") {
      plusSlides(-1);
    } else if (key.code === "Escape") {
      document.getElementById("myModal").style.display = "none";
    }
  });
}
function closeModal () {
  document.getElementById("myModal").style.display = "none";
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides (n) {
  showSlides((slideIndex += n));
}

function currentSlide (n) {
  showSlides((slideIndex = n));
}

function showSlides (n) {
  const slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}


//Trie
function trie() {
  const categories = document.getElementById("categories");
  const categoriesModal = document.getElementById("categories_modal");
  categories.addEventListener("click", () => {
    categoriesModal.style.display = "flex";
  });
  const pop = document.getElementById("pop");
  const date = document.getElementById("date");
  const title = document.getElementById("title");
  media(objectMedia);
  pop.addEventListener("click", (e) => {
    categories.innerHTML = pop.innerHTML;
    categoriesModal.style.display = "none";
    objectMedia.sort((a, b) => {
      return b.likes - a.likes;
    });
    media(objectMedia);
  });
  date.addEventListener("click", (e) => {
    categories.innerHTML = date.innerHTML;
    categoriesModal.style.display = "none";
    objectMedia.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    media(objectMedia);
  });
  title.addEventListener("click", (e) => {
    categories.innerHTML = title.innerHTML;
    categoriesModal.style.display = "none";
    objectMedia.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    media(objectMedia);
  });
}


// Accessibility

function accessibility () {
  document.addEventListener("keydown", (key) => {
    if (
      key.code === "Tab" &&
      document.querySelector("#send") === document.activeElement
    ) {
      key.preventDefault();
      document.getElementById("close-modal").focus();
    }
  });
}
