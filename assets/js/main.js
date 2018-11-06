const apikey = '?apikey=caed232232648c6736c78c39d5280237';

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with external script
    $('.collapsible').collapsible();
    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal();
});

function screenBlock(type, target) {
    if (type == 'open') {
        $(`#${target}-block-spinner, #${target}-block-fade`).css('display', 'block');
    }
    if ((type == 'close')) {
        $(`#${target}-block-spinner, #${target}-block-fade`).css('display', 'none');
    }
}

function getCharacter() {
    var url = 'https://gateway.marvel.com:443/v1/public/characters' + apikey + '&name=' + $("#charName").val();
    screenBlock('open', 'screen');
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results;
            console.log(resp);
            var respLen = resp.length;
            if (respLen == 0) {
                screenBlock('close', 'screen');
                alert('Invalid Name, please try again');
            }
            else {
                var imgSplitPath = resp[0].thumbnail.path.split('//'),
                    imgSSLfront = 'https://' + imgSplitPath[1],
                    imgExtension = resp[0].thumbnail.extension;
                if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                    $('#characterImage').html(`<div class="hide-on-med-and-up"><img src="./assets/images/notfound/na-140x140.jpg" alt="Image N/A"></div>
                                    <div class="hide-on-large-only hide-on-small-only"><img src="./assets/images/notfound/na-200x200.jpg" alt="Image N/A"></div>
                                    <div class="hide-on-med-and-down"><img src="/assets/images/notfound/na-250x250.jpg" alt="Image N/A"></div>`);
                }
                else {
                    $('#characterImage').html(`<a class="char-image-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="characterImage">
                                    <div class="char-image hide-on-med-and-up"><img src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="char-image hide-on-large-only hide-on-small-only"><img src="${imgSSLfront}/standard_xlarge.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="char-image hide-on-med-and-down"><img src="${imgSSLfront}/standard_fantastic.${imgExtension}" alt="${resp[0].name}"></div>`);
                }
                var splitNameParenthesis = resp[0].name.split(' ('),
                    splitNameForwardSlash = splitNameParenthesis[0].split('/'),
                    shortName = splitNameForwardSlash[0],
                    descriptionLen = resp[0].description.length;
                $('#characterName').html(`${shortName}`);

                if (descriptionLen == 0) {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-action red-bg-colour">
                                                    <a class="red-bg-colour Fjalla" href="${resp[0].urls[0].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-content"><p>${resp[0].description}</p></div>
                                            <div class="card-action red-bg-colour"><a class="red-bg-colour Fjalla" href="${resp[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                $('#comicsList, #seriesList, #eventsList').html('').addClass('hide');
                $('#comicsListHeader, #seriesListHeader, #eventsListHeader').html(`<span><img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..." height="16px"></span>`).animate({ opacity: 1 }, 100).removeClass('hide');
                getComicsSeriesEvents('comics', resp[0].id);
                getComicsSeriesEvents('series', resp[0].id);
                getComicsSeriesEvents('events', resp[0].id);
            }
        });
    $('#charForm')[0].reset();
    return false;
}

function getComicsSeriesEvents(type, charID) {
    $("#welcomeMessage").addClass('hide');
    var url;
    if (type == 'comics') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/comics' + apikey + '&format=comic&formatType=comic&dateRange=2018-01-01%2C%202018-12-31&orderBy=focDate&limit=100';
    }
    if (type == 'series') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/series' + apikey + '&limit=100&startYear=2018&contains=comic&orderBy=startYear';
    }
    if (type == 'events') {
        url = 'https://gateway.marvel.com:443/v1/public/events' + apikey + '&orderBy=startDate&limit=100&characters=' + charID;
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
                }
                console.log(xhr.status);
                // $.ajax(this);
                return;
            }
        })
        .done(function(resp) {
            screenBlock('close', 'screen');
            resp = resp.data.results;
            var respLen = resp.length,
                imgSplitPath, imgSSLfront, imgExtension, output;
            output = '';
            if (type == 'comics') {
                if (respLen == 0) {
                    $('#comicsListHeader').html(`<span>No Comics Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#comicsListHeader').html(`<span>Comics List 2018</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>`;
                    for (var i = 0; i < respLen; i++) {
                        imgSplitPath = resp[i].images[0].path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].images[0].extension;
                        output += `<div class="col s6 m3 l2"><center>
                                    <a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="ComicImages" data-title="${resp[i].title}">
                                    <img class="imageCovers" src="${imgSSLfront}/portrait_medium.${imgExtension}" alt="${resp[i].title}"></a></center></div>`;
                    }
                    output += `</td></tr><tr><td><a class="red-txt-colour Lato" href="http://marvel.com">© 2018 MARVEL</a></td></tr></table></div>`;
                    $('#comicsList').html(`<span>${output}<span>`).removeClass('hide');
                }
            }
            if (type == 'series') {
                if (respLen == 0) {
                    $('#seriesListHeader').html(`<span>No Series Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#seriesListHeader').html(`<span>Series List 2018</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><div class="row"><div class="col s12"><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank"><i class="fas fa-external-link-square-alt">
                                    </i> ${resp[i].title}</a></div></div><div class="row trim-bottom-margin"><span class="col s12">Series Characters:</span>`;
                        for (var j = 0; j < resp[i].characters.available; j++) {
                            var splitURI = resp[i].characters.items[j].resourceURI.split('/'),
                                seriesCharID = splitURI[6];
                            output += `<div id="char-${seriesCharID}-${resp[i].id}" class="col s3 seriesCharacterImage"></div>`;
                        }
                        getAdditionalData('seriesCharacters', resp[i].characters.collectionURI);
                        output += `</div></td>`;
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<td><center><img class="imageMissing hide-on-small-only" src="./assets/images/notfound/na-140x140.jpg"></a></center></td></tr>`;
                        }
                        else {
                            output += `<td><center><a class="imageSeries-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="SeriesImages" data-title="${resp[i].title}">
                                        <img class="imageSeries hide-on-small-only" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].title}"></center></a></td></tr>`;
                        }
                    }
                    $('#seriesList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">© 2018 MARVEL</a></td></tr></table></div>`).removeClass('hide');

                }
            }
            if (type == 'events') {
                console.log(resp);
                if (respLen == 0) {
                    $('#eventsListHeader').html(`<span>No Events Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#eventsListHeader').html(`<span>Events List</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><h6><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank"><i class="fas fa-external-link-square-alt">
                                    </i> ${resp[i].title}</a></h6><p class="grey-txt-colour">${resp[i].description}</p><p>
                                    <button data-target="modal1" class="btn modal-trigger red-bg-colour" onclick="getAdditionalData('eventCharacters', '${resp[i].characters.collectionURI}')">
                                    See all characters in this event</button></p></td>`;
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        output += `<td><a class="imageEvents-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="EventsImages" data-title="${resp[i].title}">
                                    <img class="imageEvents hide-on-small-only" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].title}"></a></td></tr>`;
                    }
                    $('#eventsList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">© 2018 MARVEL</a></td></tr></table></div>`).removeClass('hide');
                }
            }
        });
    return false;
}

function getAdditionalData(type, resourceURI) {
    var urlSplit = resourceURI.split('//'),
        urlSecure = `https://` + urlSplit[1],
        splitForID = urlSplit[1].split('/'),
        seriesID, eventsID, url;
    if (type == 'seriesCharacters') {
        seriesID = splitForID[4];
        url = urlSecure + apikey + '&orderBy=name&limit=100';
    }
    if (type == 'eventCharacters') {
        eventsID = splitForID[4];
        url = urlSecure + apikey + '&orderBy=name&limit=100';
        screenBlock('open', 'modal');
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
                if (respLen == 0) {
                    console.log('Somehow no returned data for series: ', seriesID);
                }
                else {
                    // console.log(resp);
                    for (var i = 0; i < respLen; i++) {
                        output = '';
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<center><a class="seriesCharacter-link" href="./assets/images/notfound/na-500x500.jpg" data-lightbox="SeriesCharacters-${seriesID}" data-title="${resp[i].name}">
                                        <img class="seriesCharacter" src="./assets/images/notfound/na-140x140.jpg" alt="${resp[i].title}" height="55px" width="55px"></a></center>`;
                            $(`#char-${resp[i].id}-${seriesID}`).html(`${output}`);
                        }
                        else {
                            output += `<center><a class="seriesCharacter-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="SeriesCharacters-${seriesID}" data-title="${resp[i].name}">
                                        <img class="seriesCharacter" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].title}" height="55px" width="55px"></a></center>`;
                            $(`#char-${resp[i].id}-${seriesID}`).html(`${output}`);
                        }
                    }
                }
            }
            if (type == 'eventCharacters') {
                screenBlock('close', 'modal');
                
                console.log('WIP for event characters');
                console.log(resp);
            }
        });
}
