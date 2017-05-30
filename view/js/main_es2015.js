
$(document).ready(function() {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var last_day = today
    $('#datetimepicker').datetimepicker({
        locale: 'ru',
        format: 'DD.MM.YY',
        useCurrent: true,
        defaultDate: moment(),
        minDate: today,
        maxDate: moment().add(4, 'd').toDate()
    });

    $('.btn_send').click(function() {
        renderAll()
    });
    $('.city').keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            renderAll();
        }
    });
    

    //AIzaSyCdQ6OyIOEEUdq76Hej1PO8AuF_4Ilsm8g
})

function renderAll() {
    var city = encodeURI($('.city').val());
    var date = encodeURI($('#datetimepicker input').val());
    renderMap(city);
}
var test = {};
function getWeather(city) {
    $.ajax({
        //url: `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&APPID=6a54db1dae6a628ba8278f1a4d4674ec&cnt=5&units=metric`
        url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=6a54db1dae6a628ba8278f1a4d4674ec&units=metric`
    })
        .done(function(response) {
            renderWeather(response);
            console.log(response);
            

        })
}

var test;
function degreeToDirection(deg) {
    var temp = parseInt((deg/22.5)+ 0.5);
    var directions = ["С","ССВ","СВ","ВСВ","В","ВЮВ", "ЮВ", "ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ"];
    return directions[temp % 16];
}

function renderWeather(obj) {
    var groups = _.groupBy(obj.list, function(elem){
        return elem.dt_txt.substr(0,10)
    });
    Object.keys(groups).forEach(function(item,i){if (i >= 5) delete groups[item]});
    test = groups;
    //console.log(groups);

    var weatherBlock = $('#weather');
    var tabsBlock = $('#tab_data');
    var weatherHtml = '<div class="tabs"><div class="row"><div class="col-md-1"></div>';
    var tabs_html = '';
    var months = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
    Object.keys(groups).forEach(function(item, i) {
        var elem = groups[item];

        var dayOfWeek = moment().add(i, 'day').locale("ru").format('dddd');
        var dayMonth = moment().add(i, 'day').locale("ru").format('DD') + ' ' + months[moment().add(i, 'day').locale("ru").format('M')];
        var day_weather_icon = typeof elem[4] !== "undefined" ? elem[4].weather[0].icon : elem[0].weather[0].icon;
        var day_weather_temp = typeof elem[4] !== "undefined" ? Math.floor(elem[4].main.temp) : Math.floor(elem[0].main.temp);
        weatherHtml += 
        `
            <div class="tab col-md-2">
                <div class="weather_image"><img src="http://openweathermap.org/img/w/${day_weather_icon}.png"></div>
                <div class="temp_day">${day_weather_temp} &#8451;</div>
                <div class="dayOfWeek">${dayOfWeek}</div>
            </div>
            
        `;
        tabs_html += 
        `
            <div class="tab_data">
        `;
        elem.forEach(function(item, i) {
            tabs_html += 
            `
                <div class="row">    
                    <div class="col-md-1 col-md-offset-1">
                        <img src="http://openweathermap.org/img/w/${item.weather[0].icon}.png">
                    </div>
                    <div class="col-md-2 col-md-offset-1">
                        <div class="temp_day">${Math.floor(item.main.temp)} &#8451;</div>
                        <div>${item.dt_txt.substr(11,5)}</div>
                    </div>
                    <div class="col-md-4"> 
                        <div class="pressure">Давление: ${item.main.pressure}</div>
                        <div class="wind_speed">Скорость ветра: ${item.wind.speed} м/с,</div>
                        <div class="wind_direction">${degreeToDirection(item.wind.deg)}</div>
                    </div>
                    <div class="col-md-3">
                        <div class="humidity">${item.main.humidity} %</div>
                        <div>Влажность</div>
                    </div>
                </div>
                
            `;
        });
        tabs_html += 
        `
            </div>
        `;

    });
    weatherHtml += '</div></div>';
    weatherBlock.html(weatherHtml);
    tabsBlock.html(tabs_html);
    $('.tab').each(function(i) {
        $(this).click(function() {
            $('.tab').removeClass('hover');
            $(this).addClass('hover');
            $('.tab_data').hide();
            $($('.tab_data')[i]).show();
        })
        
    })
}

function renderMap(city) {
    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCdQ6OyIOEEUdq76Hej1PO8AuF_4Ilsm8g`
    })
        .done(function(response) {
            if (response.status !== 'ZERO_RESULTS') {
                var location = response.results[0].geometry.location;
                var formatted_city = '';
                if (typeof response.results[0].address_components[3] !== "undefined")
                    formatted_city = city + ',' + response.results[0].address_components[3].short_name;
                else
                    formatted_city = city;
                
                getWeather(formatted_city);
                setUpMap(location.lat, location.lng);
            } else {
                alert('error')
            }
            
        })
}

function setUpMap(lat, lng) {
    var coords = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: coords
    });
    var marker = new google.maps.Marker({
        position: coords,
        map: map
    });
}