export class ApiData{
    static imageUrlPath = "https://image.tmdb.org/t/p/original/";
    
    static getShowData = (seriesId) => {
        const startUrl = "https://api.themoviedb.org/3/tv/";
        const urlEnd = "?api_key=";
        const apiKey = "64f44f1d52f9493b67df43ad61941d4b";
        const showUrl = startUrl + seriesId + urlEnd + apiKey;
        const showData = fetch(showUrl)
            .then(response => response.json());
        return showData;
    }
    static getSeasonData = (seriesId, season) => {
        const startUrl = "https://api.themoviedb.org/3/tv/";
        const urlMiddle = "/season/";
        const urlEnd = "?api_key=";
        const apiKey = "64f44f1d52f9493b67df43ad61941d4b";
        const showUrl = startUrl + seriesId + urlMiddle + season + urlEnd + apiKey;
        const showData = fetch(showUrl)
            .then(response => response.json());
        return showData;
    }
}