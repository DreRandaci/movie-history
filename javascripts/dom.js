'use strict';

const domString = (movies, images, divName) => {                   
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
    printToDom(str, divName);
};

const clearDom = (divName) => {
    $(`#${divName}`).empty();
};

const printToDom = (mvs, divName) => {
    $(`#${divName}`).append(mvs);
};

module.exports = { domString, clearDom };