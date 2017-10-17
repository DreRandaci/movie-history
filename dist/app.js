(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const domString = (movies) => {
    let str = '';
    movies.forEach((mv, i) => {
        if (i % 3 === 0) {
            str += `<div class="row">`;
        }
        str += `<div class="col-sm-6 col-md-4">`;
        str +=   `<div class="thumbnail">`;
        str +=     `<img src="${mv.poster_path}" alt="">`;
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
},{}],2:[function(require,module,exports){
'use strict';

let dom = require('./dom');

let singleMovie = {
    adult:false,
    backdrop_path:"/c2Ax8Rox5g6CneChwy1gmu4UbSb.jpg",
    genre_ids:[28, 12, 878, 14],
    id:140607,
    original_language:"en",
    original_title:"Star Wars: The Force Awakens",
    overview:"Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil Kylo Ren and his army of Stormtroopers.",
    popularity:49.408373,
    poster_path:"/weUSwMdQIa3NaXVzwUoIIcAi85d.jpg",
    release_date:"2015-12-15",
    title:"Star Wars: The Force Awakens",
    video:false,
    vote_average:7.5,
    vote_count:7965
};

dom.domString([singleMovie, singleMovie, singleMovie, singleMovie]);
},{"./dom":1}]},{},[2]);
