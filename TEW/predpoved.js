$(document).ready(function () {


    $("#btnPredpoved").click(getPredpoved);
    $("#btnFav").click(addToFav);
    $("#btnDel").click(removeFromFav);

    if (localStorage.length != 0) {
        for (var i = 0; i < localStorage.length; i++) {

            var o = new Option(localStorage.key(i), localStorage.getItem(localStorage.key(i)));

            $("#favouriteSelect").append(o);


        }
    }

});


function getPredpoved() {
    if ($('#citySelect').val() !== "") {
        fetchDataFromApi($('#citySelect').val());
    }
    else {

        if ($('#favouriteSelect').find(":selected").text() !== "Nevybrano") {
            fetchDataFromApi($('#favouriteSelect').find(":selected").text());
        }
    }
}

function fetchDataFromApi(city) {
    $("#forecastCards").children().remove();

    const positionUrl = `https://geocode.xyz/${city}?json=1`

    $.ajax({
        url: positionUrl, success: function (result) {

            //TODO cross origin acces not allowed, hack via CORS server
            const weatherUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/5a32783cab327da3665110a93ecf2117/${result['latt']},${result['longt']}?lang=sk&units=si`;

            $.ajax({
                url: weatherUrl, success: function (result) {


                    let list = result['hourly']['data'];

                    list.forEach(function (objekt) {
                        let temp = objekt['temperature']
                        let windSPeed = objekt['windSpeed'];
                        let date = new Date(objekt['time'] * 1000);
                        let description = objekt['summary'];
                        let currentHour = msToTime(objekt['time'] * 1000);


                        $("#forecastCards").append(`<div class=\"card\"><h3>${date.getUTCDate()}.${date.getUTCMonth() + 1} ${currentHour}</h3><div class=\"data\"><p id=\"temp\">${temp}°C</p><p id=\"windSpeed\">${windSPeed}</p></div><div class=\"weatherInfo\"><p id=\"weatherDescription\">${description}</p></div></div>`);
                    });


                }
            });


        }
    });

}


function addToFav() {
    if ($('#citySelect').val() !== "") {
        var o = new Option($('#citySelect').val(), $('#citySelect').val().toLowerCase());

        $("#favouriteSelect").append(o);

        localStorage.setItem($('#citySelect').val(), $('#citySelect').val().toLowerCase());
    }

}
function removeFromFav() {
    if ($('#favouriteSelect').find(":selected").text() !== "" && $('#favouriteSelect').find(":selected").text() !== "Nevybrano") {

        localStorage.removeItem($('#favouriteSelect').find(":selected").text());
        $("#favouriteSelect").find("option:selected").remove();
    }

}


function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes;
}