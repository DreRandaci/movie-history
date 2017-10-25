'use strict';

const domString = (movies, images, divName) => {                   
    let str = '';
    movies.forEach((mv, i) => {                        
        if (i % 3 === 0) {
            str += `<div class="row">`;
        }
        str += `<div class="col-sm-6 col-md-4 movie">`;
        str +=   `<div class="thumbnail">`;
        str +=     `<img class='poster_path' src="${images.base_url}/w342/${movies[i].poster_path}" alt="">`;
        str +=     `<div class="caption">`;
        str +=       `<h3 class='title'>${movies[i].title}</h3>`;
        str +=       `<p class='overview'>${movies[i].overview}</p>`;        
        str +=       `<p>`; 
        str +=       `<a class="review btn btn-primary" role="button">Review</a>`;
        str +=       `<a class="wishlist btn btn-default" role="button">Wishlist</a>`;
        str +=       `</p>`;
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