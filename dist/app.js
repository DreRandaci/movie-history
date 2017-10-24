(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

const apiKeys = () => {
    return new Promise((resolve, reject) => {
        $.ajax('./db/apiKeys.json').done((data) => {
            resolve(data.apiKeys);
        }).fail((error) => {
            reject(error);
        });
    });
};

const retrieveKeys = () => {
    apiKeys().then((results) => {
        tmdb.setKey(results.tmdb.apiKey);
        firebaseApi.setKey(results.firebaseKeys);
        firebase.initializeApp(results.firebaseKeys);        
    }).catch((error) => {
        console.log('error in retrieve:', error);
    });
};

module.exports = { retrieveKeys };
},{"./firebaseApi":4,"./tmdb":6}],2:[function(require,module,exports){
'use strict';

const domString = (movies, images) => {                   
    let str = '';
    movies.forEach((mv, i) => {                        
        if (i % 3 === 0) {
            str += `<div class="row">`;
        }
        str += `<div class="col-sm-6 col-md-4">`;
        str +=   `<div class="thumbnail">`;
        str +=     `<img src="${images.base_url}w342${movies[i].poster_path}" alt="">`;
        str +=     `<div class="caption">`;
        str +=       `<h3>${movies[i].title}</h3>`;
        str +=       `<p>${movies[i].overview}</p>`;        
        str +=       `<p><a href="#" class="btn btn-primary" role="button">Review</a> <a href="#" class="btn btn-default" role="button">Watch List</a></p>`;
        str +=     `</div>`;
        str +=   `</div>`;
        str += `</div>`;
        if (i % 3 === 2 || i === movies.length - 1) {
            str += `</div>`;
        }
    });
    printToDom(str);
};

const clearDom = () => {
    $('#movies').empty();
};

const printToDom = (mvs) => {
    $('#movies').append(mvs);
};

module.exports = { domString, clearDom };
},{}],3:[function(require,module,exports){
'use strict';

const tmdb = require('./tmdb');

const pressEnter = () => {    
    $(document).keypress((e) => {
        if (e.key === 'Enter') {            
            let searchText = $('#searchBar').val();
            let query = searchText.replace(/\s/g, '%20');
            tmdb.searchMovies(query);
        }        
    });        
};

const myLinks = () => {
    $('.navbar-collapse').click(( e ) => {
        if (e.target.id === 'myMovies') {
            $('#searchContainer').addClass('hide');
            $('#myMoviesContainer').removeClass('hide');
            $('#authScreenContainer').addClass('hide');
        } else if (e.target.id === 'authentication') {
            $('#searchContainer').addClass('hide');
            $('#myMoviesContainer').addClass('hide');
            $('#authScreenContainer').removeClass('hide');
        } else if (e.target.id === 'search') {
            $('#searchContainer').removeClass('hide');
            $('#myMoviesContainer').addClass('hide');
            $('#authScreenContainer').addClass('hide');
        }
    });
};

module.exports = { pressEnter, myLinks };
},{"./tmdb":6}],4:[function(require,module,exports){
'use strict';

let firebaseKey = '';

const setKey = (key) => {
    firebaseKey = key;
};

module.exports = {setKey};
},{}],5:[function(require,module,exports){
'use strict';

const events = require('./events');
const apiKeys = require('./apiKeys');

$(document).ready(function() {
    apiKeys.retrieveKeys();
    events.pressEnter();
    events.myLinks();
});

},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
'use strict';

const dom = require('./dom');

let tmdbKey;
let imgConfig;

const searchTMDB = (query) => {    
    return new Promise((resolve, reject) => {
        $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false&query=${query}`
    ).done((data) => {
        resolve(data.results);        
    }).fail((error) => {
        reject(error);
        });        
    });
};

const tmdbConfiguration = () => {
    return new Promise((resolve, reject) => {
        $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
        resolve(data.images);
        }).fail((error) => {
            reject(error);
        });
    });
};

const getConfig = () => {    
    tmdbConfiguration().then((results) => {                
        imgConfig = results;        
    }).catch((error) => {
        console.log('error in getConfig:', error);
    });
};

const searchMovies = (query) => {
    console.log("firebase apps?", firebase.apps);
    searchTMDB(query).then((resuts) => {
        showResults(resuts);
    }).catch((error) => {
        console.log('error:', error);
    });        
};

const setKey = (apiKey) => {
    tmdbKey = apiKey;
    getConfig();
};

const showResults = (mvAr) => {
    dom.clearDom();
    dom.domString(mvAr, imgConfig);
};

module.exports = {searchMovies, setKey};
},{"./dom":2}]},{},[5]);
