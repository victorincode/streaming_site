import { ElementNames } from "./elementNames.js";
import { ApiData } from "./api.js";
export class EpisodeInformation{
    #episode = {};
    constructor(episode){
        this.#episode = episode;
        console.log(episode);
        this.#createTemplate();
    }
    #createTemplate = () => {
        const season = this.#episode.season_number;
        const episodeNumber = this.#episode.episode_number;
        const title = this.#episode.name;
        const episodeTitle = `S${season} E${episodeNumber}: ${title}`;
        const overview = `${this.#episode.overview}`;
        const template = `
        <section class="${ElementNames.imageSection}">
            <img width="500" height="500" src="${ApiData.imageUrlPath + this.#episode.still_path}">
            <div class="${ElementNames.showInformation}">
                <h2>${episodeTitle}</h2>
                <p>${overview}</p>
            </div>
        </section
        `;
        document.querySelector("main").innerHTML = template;
    }

    run = () => {

    }
}