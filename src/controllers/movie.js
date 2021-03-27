const axios = require('axios');
const Settings = require('../../settings');
const tmdbSettings = Settings[Settings.env].tmdb;

const mapGenre = (id) => {
    switch (id) {
        case 28:
            return "Acción";
        case 12:
            return "Aventura";
        case 16:
            return "Animación";
        case 35:
            return "Comedia";
        case 80:
            return "Crimen";
        case 99:
            return "Documental";
        case 18:
            return "Drama";
        case 10751:
            return "Familia";
        case 14:
            return "Fantasía";
        case 36:
            return "Historia";
        case 27:
            return "Terror";
        case 10402:
            return "Música";
        case 9648:
            return "Misterio";
        case 10749:
            return "Romance";
        case 878:
            return "Ciencia ficción";
        case 10770:
            return "Película de TV";
        case 53:
            return "Suspense";
        case 10752:
            return "Bélica";
        case 37:
            return "Western";
        default:
            return null;
    }
}

const mapGenreId = (genre) => {
    switch (genre) {
        case "Acción":
            return 28;
        case "Aventura":
            return 12;
        case "Animación":
            return 16;
        case "Comedia":
            return 35;
        case "Crimen":
            return 80;
        case "Documental":
            return 99;
        case "Drama":
            return 18;
        case "Familia":
            return 10751;
        case "Fantasía":
            return 14;
        case "Historia":
            return 36;
        case "Terror":
            return 27;
        case "Música":
            return 10402;
        case "Misterio":
            return 9648;
        case "Romance":
            return 10749;
        case "Ciencia ficción":
            return 878;
        case "Película de TV":
            return 10770;
        case "Suspense":
            return 53;
        case "Bélica":
            return 10752;
        case "Western":
            return 37;
        default:
            return null;
    }
}

class MovieController {

    constructor() {}

    mapData(data) {
        return {
            title : data.title,
            adult : data.adult,
            genres : data.genre_ids.map(a => mapGenre(a)),
            overview : data.overview,
            popularity : data.popularity,
            poster_path : `https://image.tmdb.org/t/p/w185${data.poster_path}`,
            poster_path_hd : `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            release_date : data.release_date,
            vote_average : data.vote_average,
            vote_count : data.vote_count
        }
    }

    async search(query,page = null) {
        let p1 = this.searchByTitle(query,page);
        let p2 = this.searchByActorName(query,page);
        return Promise.all([p1,p2]).then((res)=>[...res[0],...res[1]]);
    }

    async searchByTitle(title,page = null) {
        if (page) page = '&page='+page;
        else page = '';
        return axios.get(`${tmdbSettings.apiUrl}search/movie?query=${encodeURI(title)}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data.results;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then(data=>data.map(data=>this.mapData(data)))
        .catch(err=>err);
    }

    
    async searchByActorName(name,page = null) {
        if (page) page = '&page='+page;
        else page = '';
        console.log(encodeURI(name))
        return axios.get(`${tmdbSettings.apiUrl}search/person?query=${encodeURI(name)}${page}&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            console.log(res.data)
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then((res)=>{
            if (res.results.length) return res.results[0].id;
            else return 0;
        })
        .then((id)=>axios.get(`${tmdbSettings.apiUrl}discover/movie?with_cast=${parseInt(id)}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`))
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data.results;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then(data=>data.map(data=>this.mapData(data)))
        .catch(err=>err);
    }
    
    async getTopRated() {
        return axios.get(`${tmdbSettings.apiUrl}movie/top_rated?language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data.results;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then(data=>data.map(data=>this.mapData(data)))
        .catch(err=>err);
    }

    async getMostPopular() {
        return axios.get(`${tmdbSettings.apiUrl}movie/popular?language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data.results;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then(data=>data.map(data=>this.mapData(data)))
        .catch(err=>err);
    }

    async discoverByGenre(genre,page = null) {
        let ids = mapGenreId(genre);
        if (page) page = '&page='+page;
        else page = '';
        return axios.get(`${tmdbSettings.apiUrl}discover/movie?with_genres=${ids}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data.results;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then(data=>data.map(data=>this.mapData(data)))
        .catch(err=>err);
    }

    async getById(id) {
        return axios.get(`${tmdbSettings.apiUrl}movie/${parseInt(id)}?language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .catch(err=>err);
    }

}


let movieController = new MovieController();
module.exports = movieController;