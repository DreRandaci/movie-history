'use strict';

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

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

const googleAuth = () => {
    $("#googleBtn").click( ( e ) => {
        firebaseApi.authenticateGoogle().then(( result ) => {
            console.log('result', result);
        }).catch(( error ) => {
            console.log('error in authenticateGoogle');
        });
    });
};

module.exports = { pressEnter, myLinks, googleAuth };