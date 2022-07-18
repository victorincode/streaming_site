import { loadTemplate } from '../template.js';
class ElementNames {
    static contentContainer = "content-container";
    static seasonNavigation = "season-navigation";
    static seasonName = "season-nametag";
    static imageSection = "image-section";
    static imagePhotoId = "image-photo";
    static episodeContainerId = "all-episodes";
    static episodeList = "episode-list";
}
class IndividualShow {
    #showData = {};
    #currentSeason = 1;
    #currentSeasonData = {};
    #startUrl = "https://api.themoviedb.org/3/tv/";
    #seriesId = 95479;
    #urlMiddle = "/season/";
    #urlEnd = "?api_key=";
    #apiKey = "64f44f1d52f9493b67df43ad61941d4b";
    #imageUrlPath = "https://image.tmdb.org/t/p/original/";
    #content = {};

    constructor() {
        loadTemplate();
        this.#init();
    }
    run = async () => {
        this.#showData = await this.#getShowData();
        this.#currentSeasonData = await this.#getSeasonData();
        this.#loadSeasonInformation();
        this.#loadSeasonNavigation();
    }
    #init = () => {
        const siteTemplate = `
        <article class="${ElementNames.contentContainer}">
            <section class="${ElementNames.imageSection}" id="${ElementNames.imageSection}"></section>
            <nav class="${ElementNames.seasonNavigation}" id="${ElementNames.seasonNavigation}">
                <h2>Season</h2>
            </nav>
            <section class="${ElementNames.episodeList}" id="${ElementNames.episodeList}">
                <ul id="${ElementNames.episodeContainerId}"></ul>
            </section>
        </article>   
        `;
        document.querySelector("main").innerHTML += siteTemplate;
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
        const imageElement = document.getElementById(ElementNames.imageSection);
        const posterPath = this.#showData.seasons[this.season].poster_path;
        const seasonImage = `
            <img id="${ElementNames.imagePhotoId}" alt="Season ${this.season} image" src="${this.#imageUrlPath + posterPath}">
        `;
        imageElement.innerHTML = seasonImage;
        this.#loadEpisodeList();

    }

    #loadSeasonNavigation = () => {
        const navigationList = document.createElement("ul");
        navigationList.addEventListener("click", event => {
                this.season = Number(event.target.textContent);
            });
        const seasonLength = this.#showData.seasons.length;
        for (let i = 0; i < seasonLength; i++) {
            const list = `<li> <button id="season-${i}">${i}</button> </li>`;
            navigationList.innerHTML += list;
        }
        const seasonNavigationBar = document.getElementById(ElementNames.seasonNavigation);
        seasonNavigationBar.append(navigationList);
    }
    #loadEpisodeList = () => {
        let episodeList = document.getElementById(ElementNames.episodeContainerId);
        episodeList.innerHTML = "";
        const seasonEpisodes = this.#currentSeasonData.episodes;
        for (const episode in seasonEpisodes) {
            this.#loadEpisode(seasonEpisodes[episode], episodeList);
        }
    }
    #loadEpisode = (episode, episodeList) => {
        const episodeTitle = `${episode.episode_number}. ${episode.name}`;
        const episodeData = `
        <li>
            <img width="1920" height="1080" loading="lazy" alt="${episodeTitle}" src="${this.#imageUrlPath + episode.still_path}">
            <h3>${episodeTitle}</h3>
        </li>
        `;
        episodeList.innerHTML += episodeData;
    }
    set season(value) {
        if (this.#currentSeason === value) return;
        this.#currentSeason = value;
        const episodeList = document.getElementById(ElementNames.episodeList);
        episodeList.remove();
        this.#loadSeasonInformation();
    }
    get season() {
        return this.#currentSeason;
    }
}

const individualShow = new IndividualShow();
individualShow.run();



