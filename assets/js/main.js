/* global $ */
const APIKEY = '?apikey=caed232232648c6736c78c39d5280237';

$(document).ready(function() {
    // large list of characters, populate autocomplete with separate script
    $.getScript('./assets/js/characters.js');
    $('.collapsible').collapsible();
});

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
                $('#attributionText').html(character.attributionText);
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
                getSeries(character.data.results[0].series.collectionURI, 0);
                getEvents(character.data.results[0].events.collectionURI, 0);
            }
        });
    $('#charForm')[0].reset();
    return false;
}

function getComics(rawURL, offset) {
    $("#welcomeMessage").addClass('hide');
    screenBlock('on');
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}&limit=24`;
    var nextOffset = parseInt(offset) + 24;
    var prevOffset = parseInt(offset) - 24;
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
                $('#comicsListHeader').html(`<span>No Comics Found</span>`).animate({ opacity: 0.85 }, 1000);
            }
            else {
                var activePage = (offset + 24) / 24;
                var comicsPagination = function() {
                    var firstOffset = 0,
                        paginationRoundUp = 0,
                        page,
                        pagesTotal;
                    var pageLinks = ``;
                    pageLinks += `<center><ul class="pagination"><li id="comics-chevron-left" class="waves-effect"><a onclick="getComics('${rawURL}',${prevOffset})"><i class="material-icons">chevron_left</i></a></li>
                            <li id="page-1" class="comics-page-1 waves-effect"><a onclick="getComics('${rawURL}',${firstOffset})">1</a></li>`;
                    if (comics.data.total % 24 != 0) {
                        paginationRoundUp = 24 - (comics.data.total % 24);
                    }
                    pagesTotal = (comics.data.total + paginationRoundUp) / 24;
                    if (pagesTotal > 1) {
                        if (activePage > 3) {
                            pageLinks += ` ... `;
                        }
                        for (page = activePage - 1; page < activePage + 2; page++) {
                            if (page > 1 && page < pagesTotal) {
                                pageLinks += `<li id="page-${page}" class="comics-page-${page} waves-effect"><a onclick="getComics('${rawURL}',${(page * 24) - 24})">${page}</a></li>`;
                            }
                        }
                        if (activePage < pagesTotal - 2) {
                            pageLinks += ` ... `;
                        }
                        pageLinks += `<li id="page-${pagesTotal}" class="comics-page-${pagesTotal} waves-effect"><a onclick="getComics('${rawURL}',${(pagesTotal * 24) - 24})">${pagesTotal}</a></li>`;
                    }
                    pageLinks += `<li id="comics-chevron-right" class="waves-effect"><a onclick="getComics('${rawURL}',${nextOffset})"><i class="material-icons">chevron_right</i></a></li>
                          </ul></center>`;
                    return pageLinks;
                };
                $('#comicsListHeader').html(`<span>Comics List</span>`);
                output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>`;
                output += `${comicsPagination()}</td><tr><td>`;
                for (var i = 0; i < respLen; i++) {
                    imgSplitPath = comics.data.results[i].thumbnail.path.split('//');
                    imgSSLfront = 'https://' + imgSplitPath[1];
                    imgExtension = comics.data.results[i].thumbnail.extension;
                    output += `<div class="col s6 m3 l2 center"><a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" 
                                data-lightbox="ComicImages" data-title="${comics.data.results[i].title}"><div class="imageCoversSize">
                                <img class="imageCovers" src="${imgSSLfront}/portrait_medium.${imgExtension}" 
                                alt="${comics.data.results[i].title}"></div></a></div>`;
                }
                output += `</td></tr><tr><td>${comicsPagination()}</td></tr><tr><td><a class="red-txt-colour Lato" 
                            href="http://marvel.com">${comics.copyright}</a></td></tr></table></div>`;
                $('#comicsList').html(`${output}`).removeClass('hide');
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
                $(`.comics-page-${activePage}`).addClass('active red-bg-colour');
            }
        });
}

function getSeries(rawURL, offset) {
    $("#welcomeMessage").addClass('hide');
    screenBlock('on');
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}&limit=10`;
    var nextOffset = parseInt(offset) + 10;
    var prevOffset = parseInt(offset) - 10;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function() {
                $('#seriesListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                $('#seriesList').addClass('hide');
                return;
            }
        })
        .done(function(series) {
            screenBlock('off');
            var respLen = series.data.results.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (respLen == 0) {
                $('#seriesListHeader').html(`<span>No Series Found</span>`).animate({ opacity: 0.85 }, 1000);
            }
            else {
                var activePage = (offset + 10) / 10;
                var seriesPagination = function() {
                    var firstOffset = 0,
                        paginationRoundUp = 0,
                        page,
                        pagesTotal;
                    var pageLinks = ``;
                    pageLinks += `<center><ul class="pagination"><li id="series-chevron-left" class="waves-effect"><a onclick="getComics('${rawURL}',${prevOffset})"><i class="material-icons">chevron_left</i></a></li>
                            <li id="page-1" class="series-page-1 waves-effect"><a onclick="getSeries('${rawURL}',${firstOffset})">1</a></li>`;
                    if (series.data.total % 10 != 0) {
                        paginationRoundUp = 10 - (series.data.total % 10);
                    }
                    pagesTotal = (series.data.total + paginationRoundUp) / 10;
                    if (pagesTotal > 1) {
                        if (activePage > 3) {
                            pageLinks += ` ... `;
                        }
                        for (page = activePage - 1; page < activePage + 2; page++) {
                            if (page > 1 && page < pagesTotal) {
                                pageLinks += `<li id="page-${page}" class="series-page-${page} waves-effect"><a onclick="getSeries('${rawURL}',${(page * 10) - 10})">${page}</a></li>`;
                            }
                        }
                        if (activePage < pagesTotal - 2) {
                            pageLinks += ` ... `;
                        }
                        pageLinks += `<li id="page-${pagesTotal}" class="series-page-${pagesTotal} waves-effect"><a onclick="getSeries('${rawURL}',${(pagesTotal * 10) - 10})">${pagesTotal}</a></li>`;
                    }
                    pageLinks += `<li id="series-chevron-right" class="waves-effect"><a onclick="getSeries('${rawURL}',${nextOffset})"><i class="material-icons">chevron_right</i></a></li>
                          </ul></center>`;
                    return pageLinks;
                };
                $('#seriesListHeader').html(`<span>Series List</span>`);

                output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td class="td-padding col s12">${seriesPagination()}</td></tr>`;
                for (var i = 0; i < respLen; i++) {
                    var seriesDescription = function() {
                        var result;
                        if (series.data.results[i].description == null) {
                            result = `No description available...`;
                        }
                        else {
                            result = series.data.results[i].description;
                        }
                        return result;
                    };
                    output += `<tr><td class="td-padding col s12"><div class="col s12 m9"><a class="red-txt-colour Lato" href="${series.data.results[i].urls[0].url}" target="_blank">
                        <i class="fas fa-external-link-square-alt"></i> ${series.data.results[i].title}</a><p><span class="col s12">${seriesDescription()}</span><p></div>`;
                    // Convert to https image links
                    imgSplitPath = series.data.results[i].thumbnail.path.split('//');
                    imgSSLfront = 'https://' + imgSplitPath[1];
                    imgExtension = series.data.results[i].thumbnail.extension;
                    if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                        output += `<div class="col m3 hide-on-small-only"><img class="imageMissing hide-on-small-only center" src="./assets/images/notfound/na-140x140.jpg"></a></div></td></tr>`;
                    }
                    else {
                        output += `<div class="col m3 hide-on-small-only"><a class="imageSeries-link center" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="SeriesImages" 
                            data-title="${series.data.results[i].title}"><img class="imageSeries hide-on-small-only" src="${imgSSLfront}/standard_large.${imgExtension}" 
                            alt="${series.data.results[i].title}"></a></div></td></tr>`;
                    }
                }
                $('#seriesList').html(`${output}<tr><td class="td-padding col s12">${seriesPagination()}</td></tr><tr><td class="td-padding col s12"><a class="red-txt-colour Fjalla" href="http://marvel.com">
                    ${series.copyright}</a></td></tr></table></div>`).removeClass('hide');

                if (prevOffset < 0 && series.data.total > nextOffset) {
                    $('#series-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
                }
                if (prevOffset >= 0 && series.data.total - nextOffset <= 0) {
                    $('#series-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
                }
                if (prevOffset < 0 && series.data.total < nextOffset) {
                    $('#series-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
                    $('#series-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
                }
                $(`.series-page-${activePage}`).addClass('active red-bg-colour');
            }
        });
}

function getEvents(rawURL, offset) {
    screenBlock('on');
    var splitURL = rawURL.split('//');
    var url = `https://${splitURL[1]}${APIKEY}&offset=${offset}&limit=5`;
    var nextOffset = parseInt(offset) + 5;
    var prevOffset = parseInt(offset) - 5;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function() {
                $('#eventsListHeader').html(`<span>Server Error. Please Search again.</span>`).animate({ opacity: 0.85 }, 1000);
                $('#eventsList').addClass('hide');
                return;
            }
        })
        .done(function(events) {
            screenBlock('off');
            var respLen = events.data.results.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (respLen == 0) {
                $('#eventsListHeader').html(`<span>No Events Found</span>`).animate({ opacity: 0.85 }, 1000);
            }
            else {
                var activePage = (offset + 5) / 5;
                var eventsPagination = function() {
                    var firstOffset = 0,
                        paginationRoundUp = 0,
                        page,
                        pagesTotal;
                    var pageLinks = ``;
                    pageLinks += `<center><ul class="pagination"><li id="events-chevron-left" class="waves-effect"><a onclick="getComics('${rawURL}',${prevOffset})"><i class="material-icons">chevron_left</i></a></li>
                            <li id="page-1" class="events-page-1 waves-effect"><a onclick="getEvents('${rawURL}',${firstOffset})">1</a></li>`;
                    if (events.data.total % 5 != 0) {
                        paginationRoundUp = 5 - (events.data.total % 5);
                    }
                    pagesTotal = (events.data.total + paginationRoundUp) / 5;
                    if (pagesTotal > 1) {
                        if (activePage > 3) {
                            pageLinks += ` ... `;
                        }
                        for (page = activePage - 1; page < activePage + 2; page++) {
                            if (page > 1 && page < pagesTotal) {
                                pageLinks += `<li id="page-${page}" class="events-page-${page} waves-effect"><a onclick="getEvents('${rawURL}',${(page * 5) - 5})">${page}</a></li>`;
                            }
                        }
                        if (activePage < pagesTotal - 2) {
                            pageLinks += ` ... `;
                        }
                        pageLinks += `<li id="page-${pagesTotal}" class="events-page-${pagesTotal} waves-effect"><a onclick="getEvents('${rawURL}',${(pagesTotal * 5) - 5})">${pagesTotal}</a></li>`;
                    }
                    pageLinks += `<li id="events-chevron-right" class="waves-effect"><a onclick="getEvents('${rawURL}',${nextOffset})"><i class="material-icons">chevron_right</i></a></li>
                          </ul></center>`;
                    return pageLinks;
                };
                $('#eventsListHeader').html(`<span>Events List</span>`);
                output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>${eventsPagination()}</td></tr>`;
                for (var i = 0; i < respLen; i++) {
                    output += `<tr><td><div class="col s12"><h6><a class="red-txt-colour Lato" href="${events.data.results[i].urls[0].url}" target="_blank">
                            <i class="fas fa-external-link-square-alt"></i> ${events.data.results[i].title}</a></h6><p class="grey-txt-colour">
                            ${events.data.results[i].description}</p></div></td></tr>`;
                }
                $('#eventsList').html(`${output}<tr><td>${eventsPagination()}</td></tr><tr><td><a class="red-txt-colour Fjalla" 
                                        href="http://marvel.com">${events.copyright}</a></td></tr></table></div>`).removeClass('hide');

                if (prevOffset < 0 && events.data.total > nextOffset) {
                    $('#events-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
                }
                if (prevOffset >= 0 && events.data.total - nextOffset <= 0) {
                    $('#events-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
                }
                if (prevOffset < 0 && events.data.total < nextOffset) {
                    $('#events-chevron-left').html(`<a><i class="material-icons">chevron_left</i></a>`);
                    $('#events-chevron-right').html(`<a><i class="material-icons">chevron_right</i></a>`);
                }
                $(`.events-page-${activePage}`).addClass('active red-bg-colour');
            }
        });
}
