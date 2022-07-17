export class ApiData {
    #startUrl = "http://api.themoviedb.org/3/tv/";
    #seriesId = 1996;
    #apiMiddle = "/season/"
    #seriesSeason = 1;
    #urlEnd = "?api_key=";
    #apiKey = "64f44f1d52f9493b67df43ad61941d4b";
    #imageStartPath = "https://image.tmdb.org/t/p/original";
    #content = {};

    #getEntireUrl = () => this.#startUrl + this.#seriesId + this.#apiMiddle + this.#seriesSeason + this.#urlEnd + this.#apiKey;
    #get = () => {
        const data = fetch(this.#getEntireUrl())
            .then(response => response.json());
        return data;
    }
    set = async() => {
        this.#content = await this.#get();
        const formatData = JSON.stringify(this.#content);
        localStorage.setItem("api-data", formatData);
        localStorage.setItem("imageUrlPath", this.#imageStartPath);
    }
}
