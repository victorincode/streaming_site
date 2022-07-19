import {EpisodeInformation} from './episodeInformation.js';
import {ElementNames} from './elementNames.js';
import { ApiData } from './api.js';

class IndividualShow {
    #showData = {};
    #currentSeason = 0;
    #currentSeasonData = {};
    // #seriesId = 30984;
    #seriesId = 95479

    constructor() {
        this.#loadTemplate();
    }
    run = async () => {
        this.#showData = await ApiData.getShowData(this.#seriesId);
        console.log(this.#showData);
        this.#loadSeasonInformation();
        this.#loadSeasonNavigation();
    }
    #loadTemplate = () => {
        const siteTemplate = `
        <main class="main-container">
            <section class="${ElementNames.imageSection}" id="${ElementNames.imageSection}">
            </section>
            <article class="${ElementNames.contentContainer}">
                <nav class="${ElementNames.seasonNavigation}" id="${ElementNames.seasonNavigation}">
                    <h2>Season</h2>
                </nav>
                <ul class="${ElementNames.episodeList}" id="${ElementNames.episodeList}"></ul>
            </article>
        </main>   
        `;
        document.querySelector("body").innerHTML += siteTemplate;
    }
    #loadSeasonInformation = async() => {
        this.#currentSeasonData = await ApiData.getSeasonData(this.#seriesId, this.#currentSeason);
        const imageElement = document.getElementById(ElementNames.imageSection);
        const posterPath = this.#currentSeasonData.poster_path;
        const seasonImage = `
        <img id="${ElementNames.imagePhotoId}" alt="Season ${this.season} image" src="${ApiData.imageUrlPath + posterPath}">
        `;
        const showOverview = this.#getOverview();
        imageElement.innerHTML = seasonImage + showOverview;
        this.#loadEpisodeList();
        
    }
    #getOverview = () => {
        let overview = this.#currentSeasonData.overview;
        if(overview.length === 0){
            overview = this.#showData.overview;
        }
        const template = `
        <div class="${ElementNames.showInformation}" id="${ElementNames.showInformation}">
            <h1>${this.#showData.name}</h1>
            <p>${overview}</p>
        </div>
        `;
        return template;
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
    #loadEpisodeList = async() => {
        let episodeList = document.getElementById(ElementNames.episodeList);
        episodeList.innerHTML = "";
        episodeList.addEventListener("click", event => {
            if(event.target.id === ElementNames.individualEpisode){
                const currentEpisode = this.#currentSeasonData.episodes[event.target.dataset.episode - 1];
                const episodeInformation = new EpisodeInformation(currentEpisode);
                console.log("clicked");
                episodeInformation.run();

            }

        }, false);
        sessionStorage.setItem("current-season", JSON.stringify(this.#currentSeasonData));
        const seasonEpisodes = this.#currentSeasonData.episodes;
        for (const episode in seasonEpisodes) {
            this.#loadEpisode(seasonEpisodes[episode], episodeList);
        }
    }
    #loadEpisode = (episode, episodeList) => {
        const episodeTitle = `${episode.episode_number}. ${episode.name}`;
        const episodeData = `
        <li id="${ElementNames.individualEpisode}" data-episode="${episode.episode_number}">
            <img width="1920" height="1080" loading="lazy" alt="${episodeTitle}" src="${ApiData.imageUrlPath + episode.still_path}">
            <h3>${episodeTitle}</h3>
        </li>
        `;
        episodeList.innerHTML += episodeData;
    }
    set season(value) {
        if (this.#currentSeason === value) return;
        this.#currentSeason = value;
        this.#loadSeasonInformation();
    }
    get season() {
        return this.#currentSeason;
    }
}

const individualShow = new IndividualShow();
individualShow.run();



