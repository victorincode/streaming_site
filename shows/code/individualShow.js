import { loadTemplate } from '../template.js';

class ElementNames {
    static seasonNavigation = "season-navigation";
    static seasonName = "season-nametag";
    static imageSection = "image-section";
    static imagePhotoId = "image-photo";
    static episodeList = "episode-list";
}

class IndividualShow {
    #mainContainer;
    #contentContainer;
    #showData = {}; 
    #currentSeason = 1;
    #currentSeasonData = {};
    #startUrl = "https://api.themoviedb.org/3/tv/";
    #seriesId = 95479;
    #urlMiddle = "/season/";
    #urlEnd = "?api_key=";
    #apiKey = "64f44f1d52f9493b67df43ad61941d4b";
    #imageUrlPath = "https://image.tmdb.org/t/p/";
    #episodeWidth = 500;
    #content = {};

    constructor() {
        // Change this to use session storage retrieved from clicking a specific
        // show.
        loadTemplate();
        // this.#showData = JSON.parse(localStorage.getItem("showData"));
        this.#mainContainer = document.querySelector("main");
    }
    run = async () => {
        this.#showData = await this.#getShowData();
        this.#currentSeasonData = await this.#getSeasonData();
        this.#loadSeasonInformation();
        this.#loadSeasonNavigation();
        this.#loadEpisodeList();
    }
    #getShowData = () => {
        const showData = fetch(this.showUrl)
            .then(response => response.json());
        return showData;
    }
    get showUrl() {
        return this.#startUrl + this.#seriesId + this.#urlEnd + this.#apiKey;
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
        image.src = this.#imageUrlPath + "original/" + path;
        console.log(this.#imageUrlPath + path);
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
        for (let i = 0; i < seasonLength; i++) {
            const itemElement = document.createElement("li");
            const seasonNumber = document.createElement("button");
            seasonNumber.textContent = i;
            seasonNumber.id = "season-" + String(i);
            itemElement.appendChild(seasonNumber);
            list.appendChild(itemElement);
        }
        return list;
    }
    // This is ran when changing seasons.
    #updateSeasonContent = async () => {
        const imagePhoto = document.getElementById(ElementNames.imagePhotoId);
        const path = this.#showData.seasons[this.season].poster_path;
        imagePhoto.src = this.#imageUrlPath + "original/" + path;
        this.#currentSeasonData = await this.#getSeasonData();
        this.#loadEpisodeList();

    }
    ////////////////////////// 

    #loadEpisodeList = () => {

        const activeButton = document.getElementById("season-" + String(this.#currentSeason));
        activeButton.click();
        activeButton.focus();

        const episodeContainer = document.createElement("section");
        episodeContainer.id = ElementNames.episodeList;
        this.#contentContainer.appendChild(episodeContainer);
        episodeContainer.className = ElementNames.episodeList;
        const episodeList = document.createElement("ul");
        episodeList.id = "all-episodes";
        episodeContainer.append(episodeList);
        const seasonEpisodes = this.#currentSeasonData.episodes;
        for (const episode in seasonEpisodes) {
            this.#loadEpisode(seasonEpisodes[episode]);
        }
    }
    #loadEpisode = (episode) => {
        const episodeList = document.getElementById("all-episodes");
        const episodeElement = document.createElement("li");
        const episodeImage = document.createElement("img");
        episodeElement.appendChild(episodeImage);
        episodeImage.src = this.#imageUrlPath + "w" + this.#episodeWidth + episode.still_path;
        episodeImage.width = this.#episodeWidth;
        episodeImage.loading = "lazy";
        const episodeTitleElement = document.createElement("h3");
        episodeElement.appendChild(episodeTitleElement);
        const episodeTitle = episode.name;
        const episodeNumber = episode.episode_number;
        episodeTitleElement.innerText = `${episodeNumber}. ${episodeTitle}`;
        episodeImage.alt = `${episodeNumber}. ${episodeTitle}`;
        episodeList.appendChild(episodeElement);
    }
    set season(value) {
        if (this.#currentSeason === value) return;
        this.#currentSeason = value;
        const episodeList = document.getElementById(ElementNames.episodeList);
        episodeList.remove();
        this.#updateSeasonContent();
    }
    get season() {
        return this.#currentSeason;
    }
}

const individualShow = new IndividualShow();
individualShow.run();



