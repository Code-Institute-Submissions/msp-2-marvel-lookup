var charName, output;

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with script in file characters.js
    $('.collapsible').collapsible();
    $('.fixed-action-btn').floatingActionButton();
});

function screenBlock(type) {
    if (type == 'open') {
        $('#screen-block-spinner, #screen-block-fade').css('display', 'block');
    }
    if ((type == 'close')) {
        $('#screen-block-spinner, #screen-block-fade').css('display', 'none');
    }
}

function getCharacter() {
    // charName = document.getElementById('charName').value;
    charName = $("#charName").val();
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
                var splitNameParenthesis = resp[0].name.split(' (');
                var splitNameForwardSlash = splitNameParenthesis[0].split('/');
                var shortName = splitNameForwardSlash[0];
                $('#characterName').html(`${shortName}`);
                var descriptionLen = resp[0].description.length;
                if (descriptionLen == 0) {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-action red-bg-colour">
                                                    <a class="red-bg-colour Fjalla" href="${resp[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="width-offset-10"><div class="card drop-card-margin"><div class="card-content"><p>${resp[0].description}</p></div>
                                            <div class="card-action red-bg-colour"><a class="red-bg-colour Fjalla" href="${resp[0].urls[1].url}" target="_blank">Bio@Marvel.com</a></div></div></div>`);
                }
                $('#comicsList, #seriesList, #eventsList').html('').addClass('hide');
                $('#comicsListHeader, #seriesListHeader, #eventsListHeader').html(`<span><img src="./assets/images/pre-loaders/result-bar.gif" alt="Loading..." height="16px"></span>`).animate({ opacity: 1 }, 100).removeClass('hide');

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
    $("#welcomeMessage").addClass('hide');
    var charID = $("#charID").text();
    var url;
    if (type == 'comics') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/comics?apikey=caed232232648c6736c78c39d5280237&format=comic&formatType=comic&dateRange=2018-01-01%2C%202018-12-31&orderBy=focDate&limit=100';
        screenBlock('open');
    }
    if (type == 'series') {
        url = 'https://gateway.marvel.com:443/v1/public/characters/' + charID + '/series?apikey=caed232232648c6736c78c39d5280237&limit=100&startYear=2018&contains=comic&orderBy=startYear';
        screenBlock('open');
    }
    if (type == 'events') {
        url = 'https://gateway.marvel.com:443/v1/public/events?apikey=caed232232648c6736c78c39d5280237&orderBy=startDate&limit=100&characters=' + charID;
    }
    $.ajax(url, {
            type: 'GET',
            dataType: 'json',
            error: function(xhr) {
                if (xhr.status == 500) {
                    console.log('error 500 retrieving: ' + type);
                    $.ajax(this);
                    return;
                }
            }
        })
        .done(function(resp) {
            screenBlock('close');
            resp = resp.data.results;
            var respLen = resp.length,
                imgSplitPath, imgSSLfront, imgExtension;
            output = '';
            if (type == 'comics') {
                if (respLen == 0) {
                    $('#comicsListHeader').html(`<span>No Comics Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#comicsListHeader').html(`<span>Comics List</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider"><tr><td>`;
                    for (var i = 0; i < respLen; i++) {
                        imgSplitPath = resp[i].images[0].path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].images[0].extension;
                        output += `<div class="col s6 m3 l2"><center>
                                    <a class="imageCovers-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="ComicImages">
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
                    $('#seriesListHeader').html(`<span>Series List</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank"><i class="fas fa-external-link-square-alt"></i> ${resp[i].title}</a></td>`;
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        if (imgSSLfront == 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
                            output += `<td><center><img class="imageMissing" src="./assets/images/notfound/na-140x140.jpg"></a></center></td></tr>`;
                        }
                        else {
                            output += `<td><center><a class="imageSeries-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="SeriesImages">
                                        <img class="imageSeries" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].title}"></center></a></td></tr>`;
                        }
                    }
                    $('#seriesList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">© 2018 MARVEL</a></td></tr></table></div>`).removeClass('hide');
                }
            }
            if (type == 'events') {
                if (respLen == 0) {
                    $('#eventsListHeader').html(`<span>No Events Found</span>`).animate({ opacity: 0.85 }, 1000);
                }
                else {
                    $('#eventsListHeader').html(`<span>Events List</span>`);
                    output += `<div class="row format-list silver-light-bg-colour"><table class="row-divider">`;
                    for (var i = 0; i < respLen; i++) {
                        output += `<tr><td><h6><a class="red-txt-colour Lato" href="${resp[i].urls[0].url}" target="_blank"><i class="fas fa-external-link-square-alt"></i> ${resp[i].title}</a></h6><p class="grey-txt-colour">${resp[i].description}</p></td>`;
                        imgSplitPath = resp[i].thumbnail.path.split('//');
                        imgSSLfront = 'https://' + imgSplitPath[1];
                        imgExtension = resp[i].thumbnail.extension;
                        output += `<td><a class="imageEvents-link" href="${imgSSLfront}/detail.${imgExtension}" data-lightbox="EventsImages">
                                    <img class="imageEvents hide-on-small-only" src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[i].title}"></a></td></tr>`;
                    }
                    $('#eventsList').html(`${output}<tr><td><a class="red-txt-colour Fjalla" href="http://marvel.com">© 2018 MARVEL</a></td></tr></table></div>`).removeClass('hide');
                }
            }
        });
    return false;
}
