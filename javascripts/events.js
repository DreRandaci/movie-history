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
                dom.domString(results, tmdb.getImgConfig(), 'moviesMine');
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
        // console.log('wishlist e:', e.target.closest('.movie'));
        let mommy = e.target.closest('.movie');        

        let newMovie = {
            "title": $(mommy).find('.title').html(),
            "overview": $(mommy).find('.overview').html(),
            "poster_path": $(mommy).find('.poster_path').attr('src').split('/').pop(),
            "rating": 0,
            "isWatched": false,
            "uid": ""
        };
        console.log("newMovie:", newMovie);
        //firebaseApi.saveMovie().then().catch();
    });
};

module.exports = { pressEnter, myLinks, googleAuth, wishListEvents };