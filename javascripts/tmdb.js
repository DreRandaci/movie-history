'use strict';

const dom = require('./dom');

let tmdbKey;

const searchTMDB = (query) => {    
    return new Promise((resolve, reject) => {
        $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false&query=${query}`
    ).done((data) => {
        resolve(data);        
    }).fail((error) => {
        reject(error);
        });        
    });
};

const searchMovies = (query) => {
    searchTMDB(query).then((resuts) => {
        showResults(resuts);
    }).catch((error) => {
        console.log('error:', error);
    });        
};

const setKey = (apiKey) => {
    tmdbKey = apiKey;
};

const showResults = (mvAr) => {
    dom.domString(mvAr.results);
};

module.exports = {searchMovies, setKey};