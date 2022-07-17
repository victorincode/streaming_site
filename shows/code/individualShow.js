import { loadTemplate } from '../template.js';

class ElementNames{
    static seasonNavigation = "season-navigation";
    static seasonName = "season-nametag";
    static imageSection = "image-section";
    static imagePhotoId = "image-photo";
}

class IndividualShow {
    #mainContainer;
    #contentContainer;
    #imageUrlPath;;
    #deviceType;
    #showData = {};
    #currentSeason = 2;
    #currentSeasonData = {};
    constructor() {
        // Change this to use session storage retrieved from clicking a specific
        // show.
        loadTemplate();
        this.#currentSeasonData = JSON.parse(localStorage.getItem("seasonData"));
        this.#showData = JSON.parse(localStorage.getItem("showData"));
        this.#imageUrlPath = localStorage.getItem("imageUrlPath");
        this.#mainContainer = document.querySelector("main");
    }
    run = () => {
        this.#loadSeasonInformation();
        this.#loadSeasonNavigation();
    }

    #loadSeasonInformation = () => {
        this.#contentContainer = document.createElement("article");
        this.#contentContainer.className = "content-container";
        this.#mainContainer.appendChild(this.#contentContainer);
        this.#loadSeasonImage();
    }

    #loadSeasonImage = () => {
        const imageSection = document.createElement("section");
        imageSection.className = ElementNames.imageSection;
        this.#contentContainer.appendChild(imageSection);
        const image = document.createElement("img");
        const seasonImage = this.#showData.seasons[this.season].poster_path;
        image.id = ElementNames.imagePhotoId;
        image.src = this.#imageUrlPath + seasonImage;
        imageSection.appendChild(image);
    }
    ///////////////
    #loadSeasonNavigation = () => {
        const navigation = document.createElement("nav");
        this.#contentContainer.appendChild(navigation);
        navigation.className = ElementNames.seasonNavigation;
        const nametag = document.createElement("h2");
        nametag.innerText = "Season";
        navigation.appendChild(nametag); 
        const navigationList = this.#createSeasonNavigationList();
        navigation.appendChild(navigationList);
    }

    #createSeasonNavigationList = () => {
        const list = document.createElement("ul");
        list.className = ElementNames.seasonNavigation;
        list.addEventListener("click", event => {
            this.season = Number(event.target.textContent);
        });
        const seasonLength = this.#showData.seasons.length;
        for(let i=0; i<seasonLength; i++){
            const itemElement = document.createElement("li");
            const seasonNumber = document.createElement("button");
            seasonNumber.textContent = i;
            itemElement.appendChild(seasonNumber);
            list.appendChild(itemElement);
        }
        return list;
    }
    // This is ran when changing seasons.
    #updateSeasonContent(){
        const imagePhoto = document.getElementById(ElementNames.imagePhotoId);
        const path = this.#showData.seasons[this.season].poster_path;
        const imagePath = this.#imageUrlPath + path;
        imagePhoto.src = imagePath;
    }
    ////////////////////////// 
    set season(value){
        if(this.#currentSeason === value) return;
        this.#currentSeason = value;
        this.#updateSeasonContent();
    }
    get season(){
        return this.#currentSeason;
    }
}

const individualShow = new IndividualShow();
individualShow.run();


// class ApiData {
//     #startUrl = "http://api.themoviedb.org/3/tv/";
//     #seriesId = 1996;
//     #urlEnd = "?api_key=";
//     #apiKey = "64f44f1d52f9493b67df43ad61941d4b";
//     #imageStartPath = "https://image.tmdb.org/t/p/original";
//     #content = {};

//     #getEntireUrl = () => this.#startUrl + this.#seriesId + this.#urlEnd + this.#apiKey;
//     get = () => {
//         const data = fetch(this.#getEntireUrl())
//             .then(response => response.json());
//         return data;
//     }
// }

// const getData = async() => {
//     const api = new ApiData();
//     const data = await api.get();
//     console.log(data);
//     localStorage.setItem("show-data", JSON.stringify(data));
// }

// getData();
