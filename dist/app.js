(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const tmdb = require('./tmdb');

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
    }).catch((error) => {
        console.log('error in retrieve:', error);
    });
};

module.exports = {retrieveKeys, apiKeys};
},{"./tmdb":5}],2:[function(require,module,exports){
'use strict';

const domString = (movies) => {
    $('#movies').html('');
    let str = '';
    movies.forEach((mv, i) => {
        if (i % 3 === 0) {
            str += `<div class="row">`;
        }
        str += `<div class="col-sm-6 col-md-4">`;
        str +=   `<div class="thumbnail">`;
        str +=     `<img src="" alt="">`;
        str +=     `<div class="caption">`;
        str +=       `<h3>${mv.title}</h3>`;
        str +=       `<p>${mv.overview}</p>`;        
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

const printToDom = (mvs) => {
    $('#movies').append(mvs);
};

module.exports = {domString};
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

module.exports = {pressEnter};
},{"./tmdb":5}],4:[function(require,module,exports){
'use strict';

const events = require('./events');
const apiKeys = require('./apiKeys');

$(document).ready(function() {
    apiKeys.retrieveKeys();
    events.pressEnter();
});

},{"./apiKeys":1,"./events":3}],5:[function(require,module,exports){
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
},{"./dom":2}]},{},[4]);
