var charName;

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with script in file characters.js
    $('.collapsible').collapsible();
    $('#charName').change(function() {
        var parentForm = $(this).closest("form");
        if (parentForm)
            parentForm.submit();
    });
})

function getCharacter() {
    charName = document.getElementById('charName').value;
    var url = 'https://gateway.marvel.com:443/v1/public/characters?apikey=caed232232648c6736c78c39d5280237&name=' + charName;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results;
            $('#charID').text(resp[0].id.toString());
            var imgSplitPath = resp[0].thumbnail.path.split('//');
            var imgSSLfront = 'https://' + imgSplitPath[1];
            var imgExtension = resp[0].thumbnail.extension;
            $('#characterImage').html(`<div class="hide-on-med-and-up"><img src="${imgSSLfront}/standard_large.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="hide-on-large-only hide-on-small-only"><img src="${imgSSLfront}/standard_xlarge.${imgExtension}" alt="${resp[0].name}"></div>
                                    <div class="hide-on-med-and-down"><img src="${imgSSLfront}/standard_fantastic.${imgExtension}" alt="${resp[0].name}"></div>`);
            var splitName = resp[0].name.split(' (');
                var shortName = splitName[0];
                $('#characterName').html(`${shortName}`);
            console.log(resp[0]); // for reference, to be removed
            console.log(resp[0].name); // for reference, to be removed
            console.log(resp[0].description); // for reference, to be removed
        });
    // Reset search field to blank
    charName = "";
    document.getElementById("charForm").reset();
    return false;
}
