/* global $ */
const APIKEY = '?apikey=caed232232648c6736c78c39d5280237';

$(document).ready(function() {
    // large list of characters, populate autocomplete with separate script
    $.getScript('./assets/js/characters.js');
    $('.collapsible').collapsible();
});

function toggleVisibility(id) {
    $(id).slideToggle(500);
}

function screenBlock(type) {
    // Block the screen while initial searches take place
    if (type == 'on') {
        $(`#screen-block-spinner, #screen-block-fade`).css('display', 'block');
    }
    // Release the screen back to the user
    if ((type == 'off')) {
        $(`#screen-block-spinner, #screen-block-fade`).css('display', 'none');
    }
}

function getCharacter() {
    var url = `https://gateway.marvel.com:443/v1/public/characters${APIKEY}&name=${$("#charName").val()}`;
    screenBlock('on');
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(character) {
            // resp = resp.data.results;
            var respLen = character.data.results.length;
            if (respLen == 0) {
                screenBlock('off');
                alert('Invalid Name, please try again');
            }
            else {
                var imgSplitPath = character.data.results[0].thumbnail.path.split('//'),
                    imgSSLfront = 'https://' + imgSplitPath[1],
                    imgExtension = character.data.results[0].thumbnail.extension;
                if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                    $('#characterImage').html(`<img src="/assets/images/notfound/na-250x250.jpg" alt="Image N/A">`);
                }
                else {
                    $('#characterImage').html(`<a class="char-image-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="characterImage"data-title="${character.data.results[0].name}">
                    <div class="char-image"><img src="${imgSSLfront}/standard_fantastic.${imgExtension}" alt="${character.data.results[0].name}"></div>`);
                }
                //Shorten excessively long character names
                var splitNameParenthesis = character.data.results[0].name.split(' ('),
                    splitNameForwardSlash = splitNameParenthesis[0].split('/'),
                    shortName = splitNameForwardSlash[0],
                    descriptionLen = character.data.results[0].description.length;
                $('#characterName').html(`<div class="card silver-light-bg-colour characterName-card add-transparency">
                <div class="card-content force"><span class="card-title Fjalla red-txt-colour">${shortName}</span>
                <div class="card-action hide-on-small-only bottom-dweller"><table><tr><th>Comics</th><th>Series</th>
                <th>Events</th></tr><tr><td>${character.data.results[0].comics.available}</td><td>${character.data.results[0].series.available}</td>
                <td>${character.data.results[0].events.available}</td></tr></table></div></div></div>`);
                if (descriptionLen == 0) {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-action red-bg-colour">
                    <a class="red-bg-colour Fjalla" href="${character.data.results[0].urls[0].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-content">
                    <p>${character.data.results[0].description}</p></div><div class="card-action red-bg-colour">
                    <a class="red-bg-colour Fjalla" href="${character.data.results[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                // Hide possible existing lists and get additional data
                $('#comicsList, #seriesList, #eventsList').html('').addClass('hide');
                $('#comicsListHeader, #seriesListHeader, #eventsListHeader').html(`<span>
                <img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..."></span>`).animate({ opacity: 1 }, 100).removeClass('hide');
                getComics(character.data.results[0].comics.collectionURI, 0);
                getComicsSeriesEvents('series', character.data.results[0].series.collectionURI, 0);
                getComicsSeriesEvents('events', character.data.results[0].events.collectionURI, 0);
            }
        });
    $('#charForm')[0].reset();
    return false;
}

function getComics(rawURL, offset) {
    $("#welcomeMessage").addClass('hide');
    screenBlock('on');
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}`;
    var nextOffset = parseInt(offset) + 20;
    var prevOffset = parseInt(offset) - 20;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function() {
                $('#comicsListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                $('#comicsList').addClass('hide');
                return;
            }
        })
        .done(function(comics) {
            screenBlock('off');
            var respLen = comics.data.results.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (respLen == 0) {
                $('#comicsListHeader').html(`<span>No 2018 Comics Found</span>`).animate({ opacity: 0.85 }, 1000);
            }
            else {
                $('#comicsListHeader').html(`<span>Comics List 2018</span>`);
                output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>`;
                for (var i = 0; i < respLen; i++) {
                    imgSplitPath = comics.data.results[i].thumbnail.path.split('//');
                    imgSSLfront = 'https://' + imgSplitPath[1];
                    imgExtension = comics.data.results[i].thumbnail.extension;
                    output += `<div class="col s6 m3 l2 center">
                                    <a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="ComicImages" data-title="${comics.data.results[i].title}">
                                    <img class="imageCovers" src="${imgSSLfront}/portrait_medium.${imgExtension}" alt="${comics.data.results[i].title}"></a></div>`;
                }
                output += `</td></tr><tr><td><a class="red-txt-colour Lato" href="http://marvel.com">
                    © 2018 MARVEL</a></td></tr></table></div>`;
                $('#comicsList').html(`${output}`).removeClass('hide');
            }
        });
}

function getComicsSeriesEvents(type, rawURL, offset) {
    $("#welcomeMessage").addClass('hide');
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}`;
    var nextOffset = parseInt(offset) + 20;
    var prevOffset = parseInt(offset) - 20;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function(xhr) {
                if (type == 'series') {
                    $('#seriesListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                    $('#seriesList').addClass('hide');
                }
                if (type == 'events') {
                    $('#eventsListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                    $('#eventsList').addClass('hide');
                    $('#eventsList-fail-margin').addClass('extra-bottom-margin');
                }
                return;
            }
        })
        .done(function(resp) {
            screenBlock('off');
            var respLen = resp.data.results.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (type == 'series') {
                console.log('series: ', resp);
                resp = resp.data.results;

                if (respLen == 0) {
                    $('#seriesListHeader').html(`<span>No 2018 Series Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#seriesListHeader').html(`<span>Series List 2018</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><div class="row"><div class="col s12"><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank">
                        <i class="fas fa-external-link-square-alt"></i> ${resp[i].title}</a></div></div><div class="row trim-bottom-margin">
                        <span class="col s12">Series Characters:</span>`;
                        // Create divs to hold character images
                        for (var j = 0; j < resp[i].characters.available; j++) {
                            var splitSeriesURI = resp[i].characters.collectionURI.split('/'),
                                seriesCharID = splitSeriesURI[6];
                            output += `<div id="char-${seriesCharID}-${resp[i].id}" class="col s3 l2 seriesCharacterImage"></div>`;
                        }
                        getAdditionalData('seriesCharacters', resp[i].characters.collectionURI);
                        output += `</div></td>`;
                        // Convert to https image links
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<td><img class="imageMissing hide-on-small-only center" src="./assets/images/notfound/na-140x140.jpg"></a></td></tr>`;
                        }
                        else {
                            output += `<td><a class="imageSeries-link center" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="SeriesImages" 
                            data-title="${resp[i].title}"><img class="imageSeries hide-on-small-only" src="${imgSSLfront}/standard_large.${imgExtension}" 
                            alt="${resp[i].title}"></a></td></tr>`;
                        }
                    }
                    $('#seriesList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">
                    © 2018 MARVEL</a></td><td>&nbsp;</td></tr></table></div>`).removeClass('hide');

                }
            }
            if (type == 'events') {
                resp = resp.data.results;

                if (respLen == 0) {
                    $('#eventsListHeader').html(`<span>No Events Found</span>`).animate({ opacity: 0.85 }, 1000);
                    $('#eventsList-bottom-margin-substitute').addClass('extra-bottom-margin');
                }
                else {
                    $('#eventsListHeader').html(`<span>Events List</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><div class="col s12"><h6><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank"><i class="fas fa-external-link-square-alt">
                            </i> ${resp[i].title}</a></h6><p class="grey-txt-colour">${resp[i].description}</p></div><div id="event-button-${resp[i].id}" class="col s12 m6 offset-m3 center">
                            <a class="btn red-bg-colour loader-padding"><img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..."></a>
                            </div></td></tr><tr id="eventCharacters${resp[i].id}" class="toggle-target"><td>`;
                        // Create divs to hold character images    
                        for (var j = 0; j < resp[i].characters.available; j++) {
                            var splitEventURI = resp[i].characters.collectionURI.split('/'),
                                eventCharID = splitEventURI[6];
                            output += `<div id="char-${eventCharID}-${j}" class="col s4 m2 eventCharacterImage"></div>`;
                        }
                        getAdditionalData('eventCharacters', resp[i].characters.collectionURI);
                    }
                    $('#eventsList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">
                    © 2018 MARVEL</a></td></tr></table></div>`).removeClass('hide');
                }
            }
        });
    return false;
}

function getAdditionalData(type, resourceURI) {
    // Turn URL into https and grab unique identifiers
    var urlSplit = resourceURI.split('//'),
        urlSecure = `https://${urlSplit[1]}`,
        splitForID = urlSplit[1].split('/'),
        seriesID, eventsID, url;
    if (type == 'seriesCharacters') {
        seriesID = splitForID[4];
        url = `${urlSecure}${APIKEY}&orderBy=name&limit=100`;
    }
    if (type == 'eventCharacters') {
        eventsID = splitForID[4];
        url = `${urlSecure}${APIKEY}&orderBy=name&limit=100`;
    }
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results;
            var respLen = resp.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            if (type == 'seriesCharacters') {
                if (respLen != 0) {
                    for (var i = 0; i < respLen; i++) {
                        output = '';
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<a class="seriesCharacter-link center" href="./assets/images/notfound/na-500x500.jpg" 
                            data-lightbox="SeriesCharacters-${seriesID}" data-title="${resp[i].name}">
                            <img class="seriesCharacter size55" src="./assets/images/notfound/na-140x140.jpg" alt="${resp[i].name}"></a>`;
                            $(`#char-${resp[i].id}-${seriesID}`).html(`${output}`);
                        }
                        else {
                            output += `<a class="seriesCharacter-link center" href="${imgSSLfront}/detail.${imgExtension}" 
                            data-lightbox="SeriesCharacters-${seriesID}" data-title="${resp[i].name}">
                            <img class="seriesCharacter size55" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].name}"></a>`;
                            $(`#char-${resp[i].id}-${seriesID}`).html(`${output}`);
                        }
                    }
                }
            }
            if (type == 'eventCharacters') {
                if (respLen != 0) {
                    for (var i = 0; i < respLen; i++) {
                        output = '';
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<a class="eventCharacter-link center" href="./assets/images/notfound/na-500x500.jpg" 
                            data-lightbox="EventCharacters-${eventsID}" data-title="${resp[i].name}">
                            <img class="eventCharacter size70" src="./assets/images/notfound/na-140x140.jpg" alt="${resp[i].name}"></a>`;
                            $(`#char-${eventsID}-${i}`).html(`${output}`);
                        }
                        else {
                            output += `<a class="eventCharacter-link center" href="${imgSSLfront}/detail.${imgExtension}" 
                            data-lightbox="EventCharacters-${eventsID}" data-title="${resp[i].name}">
                            <img class="eventCharacter size70" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].name}"></a>`;
                            $(`#char-${eventsID}-${i}`).html(`${output}`);
                        }
                        $(`#event-button-${eventsID}`).html(`<a class="btn red-bg-colour Fjalla center" 
                        onclick="toggleVisibility('#eventCharacters${eventsID}','#arrows-event-button-${eventsID}')">
                        Characters for this event&nbsp;&nbsp;&nbsp;<i class="far fa-plus-square"></i></a>`);
                    }
                }
            }
        });
}
