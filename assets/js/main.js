var charName;

$(document).ready(function() {
    $.getScript('/assets/js/characters.js') // populate autocomplete with script in file characters.js
})

function getCharacter() {
    charName = document.getElementById('charName').value;
    var url = 'https://gateway.marvel.com:443/v1/public/characters?apikey=caed232232648c6736c78c39d5280237&name=' + charName;
    $.ajax(url, {
            type: 'GET',
            dataType: 'json'
        })
        .done(function(resp) {
            resp = resp.data.results[0]; // Response can be dialed back to relevant data as result is always single
            console.log(resp); // for reference, to be removed
            console.log(resp.id); // for reference, to be removed
            console.log(resp.name); // for reference, to be removed
            console.log(resp.description); // for reference, to be removed
        });
    // Reset search field to blank
    charName = "";
    document.getElementById("charForm").reset();
    return false;
}
