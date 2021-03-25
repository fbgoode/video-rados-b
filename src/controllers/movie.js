const axios = require('axios');
const Settings = require('../../settings');
const tmdbSettings = Settings[Settings.env].tmdb;

class MovieController {

    constructor() {}

    async search(query,page = null) {
        let p1 = this.searchByTitle(query,page).then((res)=>res.results);
        let p2 = this.searchByActorName(query,page).then((res)=>res.results);
        return Promise.all([p1,p2]).then((res)=>[...res[0],...res[1]]);
    }

    async searchByTitle(title,page = null) {
        if (page) page = '&page='+page;
        else page = '';
        return axios.get(`${tmdbSettings.apiUrl}search/movie?query=${encodeURI(title)}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .catch(err=>err);
    }

    
    async searchByActorName(name,page = null) {
        if (page) page = '&page='+page;
        else page = '';
        return axios.get(`${tmdbSettings.apiUrl}search/person?query=${encodeURI(name)}&language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .then((res)=>{
            if (res.results.length) return res.results[0].id;
            else return 0;
        })
        .then((id)=>axios.get(`${tmdbSettings.apiUrl}discover/movie?with_cast=${parseInt(id)}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`))
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .catch(err=>err);
    }
    
    async getTopRated() {
        return axios.get(`${tmdbSettings.apiUrl}movie/top_rated?language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .catch(err=>err);
    }

    async getMostPopular() {
        return axios.get(`${tmdbSettings.apiUrl}movie/popular?language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
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

    async discoverByGenre(ids,page = null) {
        if (page) page = '&page='+page;
        else page = '';
        return axios.get(`${tmdbSettings.apiUrl}discover/movie?with_genres=${ids}${page}&language=es-ES&api_key=${tmdbSettings.apiKey}`)
        .then((res)=>{
            if (res.status>=200 && res.status<300) return res.data;
            else throw new Error(`The Request was unsuccessful. Code ${res.status}: ${res.statusText}`);
        })
        .catch(err=>err);
    }

}


let movieController = new MovieController();
module.exports = movieController;