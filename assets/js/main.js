var charName, output;

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with script in file characters.js
    $('.collapsible').collapsible();
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
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card"><div class="card-action red-bg-colour">
                                                    <a class="red-bg-colour Fjalla" href="${resp[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card"><div class="card-content"><p>${resp[0].description}</p></div>
                                            <div class="card-action red-bg-colour"><a class="red-bg-colour Fjalla" href="${resp[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                $('#comicsList, #seriesList, #eventList').html('').addClass('hide');
                $('#comicsListHeader, #seriesListHeader, #eventsListHeader').html(`<span><img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..."></span>`).animate({ opacity: 1 }, 100).removeClass('hide');

                setTimeout([
                    getMoreInfo('comics'),
                    getMoreInfo('series'),
                    getMoreInfo('events')
                ], 1000);
            }
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
            var respLen = resp.length, imgSplitPath, imgSSLfront, imgExtension;
            output='';
            if (type == 'comics') {
                if (respLen == 0) {
                    $('#comicsListHeader').html(`<span>No Comics Found</span>`).animate({ opacity: 0.85 }, 1000);

                }
                else {
                    $('#comicsListHeader').html(`<span>Comics List</span>`);
                    console.log('Comics results:', resp);
                    output += `<span><div class="row format-list silver-light-bg-colour">`
                    for (var i = 0; i < respLen; i++) {
                        imgSplitPath = resp[i].images[0].path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].images[0].extension;
                        output += `<div class="col s6 m3 l2">
                                    <a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="Covers">
                                    <img class="imageCovers" src="${imgSSLfront}/portrait_medium.${imgExtension}" alt="${resp[i].title}"></a></div>`;
                    }
                    output += `<h6 class="col s12"><a class="red-txt-colour Fjalla" href="http://marvel.com">© 2018 MARVEL</a></h6></span>`;
                    $('#comicsList').html(`<span>${output}<span>`).removeClass('hide');
                }
            }
            if (type == 'series') {
                if (respLen == 0) {
                    $('#seriesListHeader').html(`<span>No Series Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#seriesListHeader').html(`<span>Series List</span>`);
                    console.log('Series results:', resp);
                }
            }
            if (type == 'events') {
                if (respLen == 0) {
                    $('#eventsListHeader').html(`<span>No Events Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#eventsListHeader').html(`<span>Events List</span>`);
                    console.log('Events results:', resp);
                }
            }
        });
    return false;
}
