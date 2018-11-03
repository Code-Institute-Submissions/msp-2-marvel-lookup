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
                var splitName = resp[0].name.split(' (');
                var shortName = splitName[0];
                $('#characterName').html(`<div class="sm hide-on-med-and-up">${shortName}</div>
                                        <div class="md hide-on-large-only hide-on-small-only">${shortName}</div>
                                        <div class="lg hide-on-med-and-down">${shortName}</div>`);
                var descriptionLen = resp[0].description.length;
                if (descriptionLen == 0) {
                    $('#characterDescription').html(`<div class="card"><div class="card-action white-text red-bg-colour">
                                                    <a class="fjalla-link" href="${resp[0].urls[1].url}" target="_blank">Bio at Marvel.com</a></div></div>`);
                }
                else {
                    $('#characterDescription').html(`<div class="card"><div class="card-content"><p>${resp[0].description}</p></div>
                                            <div class="card-action white-text red-bg-colour"><a class="fjalla-link" href="${resp[0].urls[1].url}" target="_blank">Bio at Marvel.com</a></div></div>`);
                }
            }
            console.log(resp[0]); // for reference, to be removed
            console.log(resp[0].name); // for reference, to be removed
        });
    // Reset search field to blank
    charName = "";
    document.getElementById("charForm").reset();
    return false;
}
