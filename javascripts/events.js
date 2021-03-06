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

const getMahMovies = () => {
    firebaseApi.getMovieList().then((results) => {
        dom.clearDom('moviesMine');
        dom.domString(results, tmdb.getImgConfig(), 'moviesMine', false);
    }).catch((err) => {
        console.log("error in getMovieList:", err);
    });
};

const myLinks = () => {
    $('.navbar-collapse').click(( e ) => {
        if (e.target.id === 'myMovies') {
            $('#searchContainer').addClass('hide');
            $('#myMoviesContainer').removeClass('hide');
            $('#authScreenContainer').addClass('hide'); 
            getMahMovies();           
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

const deleteMovie = () => {
    $('body').on('click', '.delete', (e) => {
        let movieId = $(e.target).data('firebase-id');
        firebaseApi.deleteMovie(movieId).then((results) => {
            getMahMovies();
        }).catch((err) => {
            console.log('error in deleteMovie:', err);
        });
    });
};

const init = () => {
    myLinks();
    googleAuth();
    pressEnter();
    wishListEvents();
    reviewEvents();
    deleteMovie();
};

module.exports = { init };