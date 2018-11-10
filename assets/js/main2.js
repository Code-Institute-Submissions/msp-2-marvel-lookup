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

// function screenBlock(type) {
//     // Block the screen while initial searches take place
//     if (type == 'on') {
//         $(`#screen-block-spinner, #screen-block-fade`).css('display', 'block');
//     }
//     // Release the screen back to the user
//     if ((type == 'off')) {
//         $(`#screen-block-spinner, #screen-block-fade`).css('display', 'none');
//     }
// }

function getCharacter() {
    var url = `https://gateway.marvel.com:443/v1/public/characters${APIKEY}&name=${$("#charName").val()}`;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(char) {
            var respLen = char.data.results.length;
            if (respLen == 0) {
                alert('Invalid Name, please try again');
            }
            else {
                $('#attrHTML').html(char.attributionHTML);
                $('#dataOffset').html(char.data.offset);
                $('#dataTotal').html(char.data.total);
                $('#dataCount').html(char.data.count);
                $('#dataResultsId').html(char.data.results[0].id);
                $('#dataResultsName').html(char.data.results[0].name);
                $('#dataResultsSeriesAvailable').html(char.data.results[0].series.available);
                $('#returnCode').html(char.code);
                $('#description').html(char.data.results[0].description);
                $('#dataResultsComicsAvailable').html(char.data.results[0].comics.available);
                $('#dataResultsEventsAvailable').html(char.data.results[0].events.available);
                var imgSplitPath = char.data.results[0].thumbnail.path.split('//'),
                    imgSSLfront = 'https://' + imgSplitPath[1],
                    imgExtension = char.data.results[0].thumbnail.extension;
                $('#characterImage').html(`<a class="char-image-link" href="${imgSSLfront}/detail.${imgExtension}" 
                    data-lightbox="characterImage"data-title="${char.data.results[0].name}"><div class="char-image">
                    <img src="${imgSSLfront}/standard_large.${imgExtension}" alt="${char.data.results[0].name}"></div>`);

                getComics(char.data.results[0].comics.collectionURI, 0);

            }
        });
    $('#charForm')[0].reset();
    return false;
}

function getComics(rawURL, offset) {
    // Mixed content not allowed, reform URL to SSL version
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}`;
    var nextOffset = parseInt(offset) + 20;
    var prevOffset = parseInt(offset) - 20;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(comics) {
            var output = ``,
                firstOffset = 0,
                paginationRoundUp = 0,
                activePage = (offset + 20) / 20,
                page,
                imgSplitPath, imgSSLfront, imgExtension, i, pagesTotal;
            console.log(comics);
            $('#comicDataTotal').html(comics.data.total);
            $('#comicDataOffset').html(comics.data.offset);

            var comicsPagination = function() {
                var pagelinks = ``;
                pagelinks += `<center><ul class="pagination"><li id="comics-chevron-left" class="waves-effect"><a onclick="getComics('${rawURL}',${prevOffset})"><i class="material-icons">chevron_left</i></a></li>
                            <li id="page-1" class="waves-effect"><a onclick="getComics('${rawURL}',${firstOffset})">1</a></li>`;
                if (comics.data.total % 20 != 0) {
                    paginationRoundUp = 20 - (comics.data.total % 20);
                }
                pagesTotal = (comics.data.total + paginationRoundUp) / 20;
                if (pagesTotal > 1) {
                    if (activePage > 3) {
                        pagelinks += ` ... `;
                    }
                    for (page = activePage - 1; page < activePage + 2; page++) {
                        if (page > 1 && page < pagesTotal) {
                            pagelinks += `<li id="page-${page}" class="waves-effect"><a onclick="getComics('${rawURL}',${(page * 20) - 20})">${page}</a></li>`;
                        }
                    }
                    if (activePage < pagesTotal - 2) {
                        pagelinks += ` ... `;
                    }
                    pagelinks += `<li id="page-${pagesTotal}" class="waves-effect"><a onclick="getComics('${rawURL}',${(pagesTotal * 20) - 20})">${pagesTotal}</a></li>`;
                }
                pagelinks += `<li id="comics-chevron-right" class="waves-effect"><a onclick="getComics('${rawURL}',${nextOffset})"><i class="material-icons">chevron_right</i></a></li>
                          </ul></center>`;
                return pagelinks;
            };
            output += comicsPagination();
            console.log(comicsPagination());
            for (i = 0; i < comics.data.results.length; i++) {
                imgSplitPath = comics.data.results[i].thumbnail.path.split('//');
                imgSSLfront = 'https://' + imgSplitPath[1];
                imgExtension = comics.data.results[i].thumbnail.extension;
                output += `<div id="comic-${i}" class="col s12"><div class="col s8">${comics.data.results[i].title}</div><div class="col s4">
                            <img src="${imgSSLfront}/portrait_large.${imgExtension}"></div></div>`;
            }
            output += `<a href="#top" class="waves-effect waves-light btn"><i class="col s12 material-icons">arrow_upward</i></a>`;
            $('#comicDataResults').html(output);

            if (prevOffset < 0 && comics.data.total > nextOffset) {
                $('#comics-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
            }
            if (prevOffset >= 0 && comics.data.total - nextOffset <= 0) {
                $('#comics-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
            }
            if (prevOffset < 0 && comics.data.total < nextOffset) {
                $('#comics-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
                $('#comics-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
            }
            $(`#page-${activePage}`).addClass('active');


        });
    return false;
}


function getComicsSeriesEvents(type, charID) {
    $("#welcomeMessage").addClass('hide');
    var url;
    if (type == 'comics') {
        url = `https://gateway.marvel.com:443/v1/public/characters/${charID}/comics${APIKEY}&format=comic&formatType=comic&dateRange=2018-01-01%2C%202018-12-31&orderBy=focDate&limit=100`;
    }
    if (type == 'series') {
        url = `https://gateway.marvel.com:443/v1/public/characters/${charID}/series${APIKEY}&limit=100&startYear=2018&contains=comic&orderBy=startYear`;
    }
    if (type == 'events') {
        url = `https://gateway.marvel.com:443/v1/public/characters/${charID}/events${APIKEY}&orderBy=startDate&limit=100`;
    }
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function(xhr) {
                if (type == 'comics') {
                    $('#comicsListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                    $('#comicsList').addClass('hide');
                }
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

            console.log(type, resp);

            resp = resp.data.results;
            var respLen = resp.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (type == 'comics') {
                if (respLen == 0) {
                    $('#comicsListHeader').html(`<span>No 2018 Comics Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#comicsListHeader').html(`<span>Comics List 2018</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>`;
                    for (var i = 0; i < respLen; i++) {
                        // Convert to https image links
                        imgSplitPath = resp[i].images[0].path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].images[0].extension;
                        output += `<div class="col s6 m3 l2 center">
                                    <a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="ComicImages" data-title="${resp[i].title}">
                                    <img class="imageCovers" src="${imgSSLfront}/portrait_medium.${imgExtension}" alt="${resp[i].title}"></a></div>`;
                    }
                    output += `</td></tr><tr><td><a class="red-txt-colour Lato" href="http://marvel.com">
                    © 2018 MARVEL</a></td></tr></table></div>`;
                    $('#comicsList').html(`${output}`).removeClass('hide');
                }
            }
            if (type == 'series') {
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
                            var splitSeriesURI = resp[i].characters.items[j].resourceURI.split('/'),
                                seriesCharID = splitSeriesURI[6];
                            output += `<div id="char-${seriesCharID}-${resp[i].id}" class="col s3 l2 seriesCharacterImage"></div>`;
                        }
                        // getAdditionalData('seriesCharacters', resp[i].characters.collectionURI);
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
                        // getAdditionalData('eventCharacters', resp[i].characters.collectionURI);
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
