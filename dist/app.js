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

const domString = (movies, images, divName, search) => {                   
    let str = '';
    movies.forEach((mv, i) => {                        
        if (i % 3 === 0) {
            str += `<div class="row">`;
        }
        str += `<div class="col-sm-6 col-md-4 movie">`;
        str +=   `<div class="thumbnail">`;
            if (!search) {
                str +=   `<button class='btn btn-default' data-firebase-id='${movies[i].id}'>X</button>`;
            }
        str +=     `<img class='poster_path' src="${images.base_url}/w342/${movies[i].poster_path}" alt="">`;
        str +=     `<div class="caption">`;
        str +=       `<h3 class='title'>${movies[i].title}</h3>`;
        str +=       `<p class='overview'>${movies[i].overview}</p>`; 
            if (search) {       
        str +=       `<p>`; 
        str +=       `<a class="review btn btn-primary" role="button">Review</a>`;
        str +=       `<a class="wishlist btn btn-default" role="button">Wishlist</a>`;
        str +=       `</p>`;
            } else {
                str += `<p>Rating: ${movies[i].rating}</p>`;
            }
        str +=     `</div>`;
        str +=   `</div>`;
        str += `</div>`;
        if (i % 3 === 2 || i === movies.length - 1) {
            str += `</div>`;
        }
    });
    printToDom(str, divName);
};

const clearDom = (divName) => {
    $(`#${divName}`).empty();
};

const printToDom = (mvs, divName) => {
    $(`#${divName}`).append(mvs);
};

module.exports = { domString, clearDom };
},{}],3:[function(require,module,exports){
'use strict';

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');
const dom = require('./dom');

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
            firebaseApi.getMovieList().then((results) => {
                dom.clearDom('moviesMine');
                dom.domString(results, tmdb.getImgConfig(), 'moviesMine', false);
            }).catch((err) => {
                console.log("error in getMovieList", err);
            });
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

const googleAuth = () => {
    $("#googleBtn").click( ( e ) => {
        firebaseApi.authenticateGoogle().then(( result ) => {
            
        }).catch(( error ) => {
            console.log('error in authenticateGoogle');
        });
    });
};

const wishListEvents = () => {
    $('body').on('click', '.wishlist', (e) => {
        let mommy = e.target.closest('.movie');        
        let newMovie = {
            "title": $(mommy).find('.title').html(),
            "overview": $(mommy).find('.overview').html(),
            "poster_path": $(mommy).find('.poster_path').attr('src').split('/').pop(),
            "rating": 0,
            "isWatched": false,
            "uid": ""
        };
        firebaseApi.saveMovie(newMovie).then(() => {
            $(mommy).remove();
        }).catch((err) => {
            console.log(err);
        });
    });
};

const reviewEvents = () => {
    $('body').on('click', '.review', (e) => {
        let mommy = e.target.closest('.movie');        
        let newMovie = {
            "title": $(mommy).find('.title').html(),
            "overview": $(mommy).find('.overview').html(),
            "poster_path": $(mommy).find('.poster_path').attr('src').split('/').pop(),
            "rating": 0,
            "isWatched": true,
            "uid": ""
        };
        firebaseApi.saveMovie(newMovie).then(() => {
            $(mommy).remove();
        }).catch((err) => {
            console.log(err);
        });
    });
};

const init = () => {
    myLinks();
    googleAuth();
    pressEnter();
    wishListEvents();
    reviewEvents();
};

module.exports = { init };
},{"./dom":2,"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
'use strict';

let firebaseKey = '';
let userUid = '';

const setKey = ( key ) => {
    firebaseKey = key;
};

let authenticateGoogle = () => {
    return new Promise(( resolve, reject ) => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then((authData) => {
        	userUid = authData.user.uid;
            resolve(authData.user);
        }).catch((error) => {
            reject(error);
        });
    });
  };

const getMovieList = () => {
    let moviesArray = [];
    return new Promise(( resolve, reject ) => {
        $.ajax(`${firebaseKey.databaseURL}/movies.json?orderBy="uid"&equalTo="${userUid}"`).then((fbMovies) => {
            if (fbMovies != null) {
            Object.keys(fbMovies).forEach(( key ) => {
                fbMovies[key].id = key;
                moviesArray.push(fbMovies[key]);
            });
        }
            resolve(moviesArray);
        }).catch(( err ) => {

        });
    });
};

const saveMovie = (movie) => {
    movie.uid = userUid;
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "POST",
            url: `${firebaseKey.databaseURL}/movies.json`,
            data: JSON.stringify(movie)
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = { setKey, authenticateGoogle, getMovieList, saveMovie };
},{}],5:[function(require,module,exports){
'use strict';

const events = require('./events');
const apiKeys = require('./apiKeys');

$(document).ready(function() {
    apiKeys.retrieveKeys(); 
    events.init();       
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
    dom.clearDom("movies");
    dom.domString(mvAr, imgConfig, "movies", true);
};

const getImgConfig = () => {
    return imgConfig;
};

module.exports = { searchMovies, setKey, getImgConfig };
},{"./dom":2}]},{},[5]);
