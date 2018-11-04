var charName;

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with script in file characters.js
    $('.collapsible').collapsible();
    // $('#charName').change(function() { 
    //     var parentForm = $(this).closest("form");
    //     if (parentForm)
    //         parentForm.submit(getCharacter());
});


function getCharacter() {
    charName = document.getElementById('charName').value;
    var url = 'https://gateway.marvel.com:443/v1/public/characters?apikey=caed232232648c6736c78c39d5280237&name=' + charName;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results;
            var respLen = resp.length;
            if (respLen == 0) {
                alert('Invalid Name, please try again');
            }
            else {
                $('#charID').text(resp[0].id.toString());
                var imgSplitPath = resp[0].thumbnail.path.split('//');
                var imgSSLfront = 'https://' + imgSplitPath[1];
                var imgExtension = resp[0].thumbnail.extension;
                $('#characterImage').html(`<a class="char-image-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="characterImage">
                                    <div class="char-image hide-on-med-and-up"><img src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="char-image hide-on-large-only hide-on-small-only"><img src="${imgSSLfront}/standard_xlarge.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="char-image hide-on-med-and-down"><img src="${imgSSLfront}/standard_fantastic.${imgExtension}" alt="${resp[0].name}"></div>`);
                var splitNameParenthesis = resp[0].name.split(' (');
                var splitNameForwardSlash = splitNameParenthesis[0].split('/');
                var shortName = splitNameForwardSlash[0];
                $('#characterName').html(`${shortName}`);
                var descriptionLen = resp[0].description.length;
                if (descriptionLen == 0) {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card"><div class="card-action white-text red-bg-colour">
                                                    <a class="fjalla-link" href="${resp[0].urls[1].url}" target="_blank">${shortName} at Marvel.com</a></div></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card"><div class="card-content"><p>${resp[0].description}</p></div>
                                            <div class="card-action white-text red-bg-colour"><a class="fjalla-link" href="${resp[0].urls[1].url}" target="_blank">
                                            ${shortName} at Marvel.com</a></div></div></div>`);
                }
                $('#comicsList, #seriesList, #eventList').html('').addClass('hide');
                $('#comicsListHeader, #seriesListHeader, #eventsListHeader').html(`<span><img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..."></span>`).animate({opacity:1},1000).removeClass('hide');

                setTimeout([
                    getMoreInfo('comics'),
                    getMoreInfo('series'),
                    getMoreInfo('events')
                ], 1000);
            }
            console.log('Character result:', resp);
        });
    // Reset search field to blank
    charName = "";
    document.getElementById("charForm").reset();
    return false;
}

function getMoreInfo(type) {
    // Remove welcomeMessage from view and clean up collapsible headers
    $("#welcomeMessage").addClass('hide');
    // Decide follow-up search to execute
    var charID = $("#charID").text();
    var url;
    if (type == 'comics') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/comics?apikey=caed232232648c6736c78c39d5280237&format=comic&formatType=comic&dateRange=2018-01-01%2C%202018-12-31&orderBy=focDate&limit=100';
    }
    if (type == 'series') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/series?apikey=caed232232648c6736c78c39d5280237&limit=100&startYear=2018&contains=comic&orderBy=startYear';
    }
    if (type == 'events') {
        url = 'https://gateway.marvel.com:443/v1/public/events?apikey=caed232232648c6736c78c39d5280237&orderBy=startDate&limit=100&characters=' + charID;
    }
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results;
            var respLen = resp.length;
            if (type == 'comics') {
                if (respLen == 0) {
                    $('#comicsListHeader').html(`<span>>>> <del> No Comics Found </del> <<<</span>`).animate({opacity: 0.7},1000);

                }
                else {
                    $('#comicsListHeader').html(`<span>Comics List</span>`);
                    console.log('Comics results:', resp);
                }
            }
            if (type == 'series') {
                if (respLen == 0) {
                    $('#seriesListHeader').html(`<span>>>> <del> No Series Found </del> <<<</span>`).animate({opacity:0.7},1000);
                }
                else {
                    $('#seriesListHeader').html(`<span>Series List</span>`);
                    console.log('Series results:', resp);
                }
            }
            if (type == 'events') {
                if (respLen == 0) {
                    $('#eventsListHeader').html(`<span>>>> <del> No Events Found </del> <<<</span>`).animate({opacity:0.7},1000);
                }
                else {
                    $('#eventsListHeader').html(`<span>Events List</span>`);
                    console.log('Events results:', resp);
                }
            }
        });
    return false;
}
