'use strict';

const events = require('./events');
const apiKeys = require('./apiKeys');

$(document).ready(function() {
    apiKeys.retrieveKeys();    
    events.myLinks();
    events.googleAuth();
    events.pressEnter();
    events.wishListEvents();
});
