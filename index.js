/* Recup JSON */
function readTextFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("photographe.json", function(text){
    let data = JSON.parse(text);
    data.photographers.forEach(element => {
        let main = document.getElementById('main');
        let mainPhotographe = document.createElement('div');
        mainPhotographe.setAttribute('class', 'main-photographe');

        let img = document.createElement('img');
        img.src = element.portrait;
        img.addEventListener('click', function(event){
            event.preventDefault();
            window.location = "photographe.html?id=" + element.id;
        })

        let mainText = document.createElement('div');
        mainText.setAttribute('class', 'main-text');

        let name = document.createElement('h2');
        name.innerHTML = element.name

        let loc = document.createElement('span');
        loc.setAttribute('class', 'main-text_loc');
        loc.innerHTML = element.city + ", " + element.country;

        let description = document.createElement('span');
        description.setAttribute('class', 'main-text_description');
        description.innerHTML = element.tagline;

        let price = document.createElement('span');
        price.setAttribute('class', 'main-text_price');
        price.innerHTML = element.price + "€/jour";

        let mainTag = document.createElement('div');
        mainTag.setAttribute('class', 'main-text_tag');

        
        for(i = 0; i<element.tags.length; i++){
            let tag = document.createElement('span');
            let tags = element.tags
            tag.innerHTML = tags[i]
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

