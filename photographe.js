/* Recup JSON */
const queryStringUrlId = window.location.search;
const myID = queryStringUrlId.slice(4);
if(queryStringUrlId.length <= 4){
  window.location = "index.html";
}



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
    let contentImg = document.getElementById('content-img')
    data.photographers.filter(item => item.id == myID).forEach(element => {
        let banner = document.getElementById('banner')
        let bannerText = document.getElementById('banner-text')

        let name = document.createElement('h2')
        name.innerHTML = element.name

        let loc = document.createElement('span')
        loc.setAttribute('class', 'banner-text_loc')
        loc.innerHTML = element.city + ", " + element.country
        
        let description = document.createElement('span')
        description.setAttribute('class', 'banner-text_description')
        description.innerHTML = element.tagline

        let tag = document.createElement('div')
        tag.setAttribute('class', 'tag')
        for(i = 0; i<element.tags.length; i++){
            let tagOne = document.createElement('span');
            let tags = element.tags
            tagOne.innerHTML = "#" + tags[i]
            tag.append(tagOne);
        }
        
        let img = document.createElement('img')
        img.src = element.portrait


        bannerText.append(name)
        bannerText.append(loc)
        bannerText.append(description)
        bannerText.append(tag)
        banner.append(img)

        
    });
    data.media.filter(item => item.photographerId == myID).forEach(element => {

        

        let contentBlock = document.createElement('div')
        contentBlock.setAttribute('class', 'content-img-block')

        let img = document.createElement('img')
        img.src = `Sample_Photos/${element.photographerId}/${element.image}`

        let contentText = document.createElement('div')
        contentText.setAttribute('class', 'content-img-solo_text')

        let title = document.createElement('h3')
        title.innerHTML = element.title
        contentText.append(title)
        
        let like = document.createElement('div')
        like.innerHTML = element.likes
        contentText.append(like)

        contentImg.append(contentBlock)
        contentBlock.append(img)
        contentBlock.append(contentText)
    });

});
