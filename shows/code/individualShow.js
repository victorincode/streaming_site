import { loadTemplate } from '../template.js';

class ElementNames{
    static seasonNavigation = "season-navigation";
    static seasonName = "season-nametag";
    static imageSection = "image-section";
    static imagePhotoId = "image-photo";
    static episodeList = "episode-list";
}

class IndividualShow {
    #mainContainer;
    #contentContainer;
    #imageUrlPath;;
    #showData = {};
    #currentSeason = 2;
    #currentSeasonData = {};
    #startUrl = "http://api.themoviedb.org/3/tv/";
    #seriesId = 1996;
    #urlMiddle = "/season/";
    #urlEnd = "?api_key=";
    #apiKey = "64f44f1d52f9493b67df43ad61941d4b";
    #imageStartPath = "https://image.tmdb.org/t/p/w300";
    #content = {};
    
    constructor() {
        // Change this to use session storage retrieved from clicking a specific
        // show.
        loadTemplate();
        this.#showData = JSON.parse(localStorage.getItem("showData"));
        this.#imageUrlPath = localStorage.getItem("imageUrlPath");
        this.#mainContainer = document.querySelector("main");
    }
    run = async() => {
        this.#currentSeasonData = await this.#getSeasonData();
        this.#loadSeasonInformation();
        this.#loadSeasonNavigation();
        this.#loadEpisodeList();
    }
    
    #getSeasonData = () => {
        const data = fetch(this.#getEntireUrl())
            .then(response => response.json());
        return data;
    }
    #getEntireUrl = () => this.#startUrl + this.#seriesId + this.#urlMiddle + this.season + this.#urlEnd + this.#apiKey;
    
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
        const path = this.#showData.seasons[this.season].poster_path;
        image.id = ElementNames.imagePhotoId;
        image.alt = `Season ${this.season} image`;
        image.src = this.#getImagePath(path);
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
    #getImagePath = (path) => this.#imageUrlPath + path;
    // This is ran when changing seasons.
    #updateSeasonContent = async() =>{
        const imagePhoto = document.getElementById(ElementNames.imagePhotoId);
        const path = this.#showData.seasons[this.season].poster_path;
        imagePhoto.src = this.#getImagePath(path);
        this.#currentSeasonData = await this.#getSeasonData();
        this.#loadEpisodeList();

    }
    ////////////////////////// 

    #loadEpisodeList = () => {
        console.log("season:", this.season);
        const episodeContainer = document.createElement("section");
        episodeContainer.id = ElementNames.episodeList;
        this.#contentContainer.appendChild(episodeContainer);
        episodeContainer.className = ElementNames.episodeList;
        const episodeList = document.createElement("ul");
        episodeContainer.append(episodeList);
        const seasonEpisodes = this.#currentSeasonData.episodes;

        for(const episode in seasonEpisodes){
            const episodeElement = document.createElement("li");
            episodeList.appendChild(episodeElement);
            const episodeImage = document.createElement("img");
            episodeElement.appendChild(episodeImage);
            episodeImage.src = this.#getImagePath(seasonEpisodes[episode].still_path);
            episodeImage.loading = "lazy";
            const episodeTitleElement = document.createElement("h3");
            episodeElement.appendChild(episodeTitleElement);
            const episodeTitle = seasonEpisodes[episode].name;
            const episodeNumber = seasonEpisodes[episode].episode_number;
            episodeTitleElement.innerText = `${episodeNumber}. ${episodeTitle}`;
            episodeImage.alt = `${episodeNumber}. ${episodeTitle}`;
        }
        console.log("finished loading everything.");
    }
    set season(value){
        if(this.#currentSeason === value) return;
        this.#currentSeason = value;
        const episodeList = document.getElementById(ElementNames.episodeList);
        episodeList.remove();
        this.#updateSeasonContent();
    }
    get season(){
        return this.#currentSeason;
    }
}

const individualShow = new IndividualShow();
individualShow.run();



