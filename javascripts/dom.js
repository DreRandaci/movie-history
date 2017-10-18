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