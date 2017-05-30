$(document).ready(function(){
	jQuery.fn.scrollTo = function(elem, speed) { 
	    $(this).animate({
	        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
	    }, speed == undefined ? 1000 : speed); 
	    return this; 
	};
	init();
	var loader = $('.loader');
	var weather_form = $('.weather_form');
	var datetimepicker = $('#datetimepicker');
	var datetimepicker_input = datetimepicker.find('input');
	var city = $('#city');
	google.maps.event.addDomListener(window, 'load', init);
	var date = new Date();
	var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	var last_day = today;

	datetimepicker.datetimepicker({
		locale: 'ru',
		format: 'DD.MM.YY',
		allowInputToggle: true,
		minDate: today,
		maxDate: moment().add(4, 'd').toDate()
	});

	$(window).resize(_.debounce(function(){
		$('.hover').click();
		responsive();
	}, 150));

	$(window).scroll(_.debounce(function() {
		if ($(window).width() <= 768) {
			var scroll = $(this).scrollTop();
			var weather = $('#weather');
			if (scroll >= $('.from_db').outerHeight() + $('#row').outerHeight()) {
				weather.addClass('fixed');
				$('#tab_data').css('margin-top', weather.height());
				//weather.find('.tabs').css('padding-bottom', 0);
			} else {
				weather.removeClass('fixed');
				$('#tab_data').css('margin-top', 0);
				//weather.find('.tabs').css('padding-bottom', 40);
			}
		}
	}, 0))

	//по сабмиту перемещаем форму и рендерим погоду и карту
	$('#main-form').submit(function(e) {
		e.preventDefault();
		//валидация полей
		if (datetimepicker_input.val() == '' || city.val() == '') {
			if (datetimepicker_input.val() == '' && city.val() == '') {
				datetimepicker_input.addClass('red_border');
				city.addClass('red_border');
			} else  {
				if (datetimepicker_input.val() == '') {
					datetimepicker_input.addClass('red_border');
					city.removeClass('red_border');
				} else {
					datetimepicker_input.removeClass('red_border');
					city.addClass('red_border');
				}
			}
		} else {
			city.removeClass('red_border');
			datetimepicker_input.removeClass('red_border');
			weather_form
				.removeClass('col-md-6').removeClass('col-md-offset-3')
				.addClass('col-md-12');
			$('body').css('overflow', 'auto');
			$('#row').css('margin-top', 0);
			weather_form.find('.city').parent().addClass('col-md-7');
			weather_form.find('.date').parent().addClass('col-md-3');
			weather_form.find('.btn').parent().addClass('col-md-2');
			renderAll();
		}
	});

	//подключаем автокомплит к городу
	function init() {
	    var input = document.getElementById('city');
	    var autocomplete = new google.maps.places.Autocomplete(input);
	}

	function addWeatherToDb(json) {
		$.ajax({
			url : 'model/addWeatherJson.php',
			method: 'POST',
			data: {addWeatherJson: true, query: city.val(), json: json}
		})
			.done(function(response) {
				//console.log(response);
			})
	}

	function renderAll() {
		if (!isIE() || (isIE() && isIE() > 9)) {
			loader.show();	
		}
		
		$('body').css('overflow-y', 'hidden');
		$.ajax({
			url : 'model/getWeatherJson.php',
			method: 'POST',
			data: {getWeatherJson: true, query: city.val(), date: moment(datetimepicker_input.val(),'DD.MM.YY').format('YYYY-MM-DD')}
		})
			.done(function(response) {
				if (response != "fail") {
					var json = JSON.parse(JSON.parse(response).json);
					renderMap(city.val(), false);
					renderWeather(json, datetimepicker_input.val());
					$('.from_db').show();
					console.log('from_bd')
				} else {
					$('.from_db').hide();
					renderMap(encodeURI(city.val()), true);
					console.log('from_response')
				}
			})
	}

	//получаем код страны и формируем строку для корректного ответа от OpenWeatherMap
	function renderMap(city, needTogetWeather) {
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&key=AIzaSyCdQ6OyIOEEUdq76Hej1PO8AuF_4Ilsm8g'
		})
			.done(function(response) {
				if (response.status !== 'ZERO_RESULTS') {
					$('.city').removeClass('red_border');
					var location = response.results[0].geometry.location;
					var formatted_city;
					if (typeof response.results[0].address_components[3] !== "undefined")
						formatted_city = city + ',' + response.results[0].address_components[3].short_name;
					else
						formatted_city = city;
					if (needTogetWeather == true)
						getWeather(formatted_city);
					setUpMap(location.lat, location.lng);
				} else {
					$('.city').addClass('red_border');
					loader.hide();
					$('body').css('overflow-y', 'auto');
				}
			})
	}

	//получаем ответ от OpenWeatherMap
	function getWeather(city) {
		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&APPID=6a54db1dae6a628ba8278f1a4d4674ec&units=metric'
		})
			.done(function(response) {
				renderWeather(response, datetimepicker_input.val());
				addWeatherToDb(response);
			})
	}

	//настраиваем карту
	function setUpMap(lat, lng) {
		var coords = {lat: lat, lng: lng};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: coords
		});
		var marker = new google.maps.Marker({
			position: coords,
			map: map
		});
	}

	//преобразуем градусы в направление
	function degreeToDirection(deg) {
		var temp = parseInt((deg/22.5)+ 0.5);
		var directions = ["С","ССВ","СВ","ВСВ","В","ВЮВ", "ЮВ", "ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ"];
		return directions[temp % 16];
	}

	//рендерим погодный блок
	function renderWeather(obj, input_date) {
		input_date = input_date.replace('.', '_').replace('.', '_');
		//группируем ответ по дням
		var groups = _.groupBy(obj.list, function(elem){
			return elem.dt_txt.substr(0,10);
		});
		//удаляем лишний день, т.к. погода рассчитана на 5 дней
		Object.keys(groups).forEach(function(item,i){if (i >= 5) delete groups[item]});
		var weatherBlock = $('#weather');
		var tabsBlock = $('#tab_data');
		var weatherHtml = '<div class="tabs"><div class="row"><div class="col-md-1 col-sm-1 col-xs-1"></div>';
		var tabs_html = '';
		var months = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
		//для каждого дня
		Object.keys(groups).forEach(function(item, i) {
			var elem = groups[item];
			//console.log(elem);
			var dayOfWeek = moment().add(i, 'day').locale("ru").format('dddd');
			var dayMonth = moment().add(i, 'day').locale("ru").format('DD') + ' ' + months[moment().add(i, 'day').locale("ru").format('M')-1];
			var date = moment().add(i, 'day').locale("ru").format('DD_MM_YY');
			//погода в названии вкладки берется либо ближайшая, либо, если имеется, дневная(12:00) 
			var day_weather_icon = elem[0].weather[0].icon;
			var day_weather_temp = Math.floor(elem[0].main.temp);
			elem.forEach(function(item, i) {
				if (item.dt_txt.substr(11, 9) == "12:00:00") {
					day_weather_icon = item.weather[0].icon;
					day_weather_temp = Math.floor(item.main.temp);
				}
			})
			//название вкладки
			weatherHtml += 
				'<div class="tab col-md-2 col-sm-2 col-xs-2" id="' + date + '">' +
					'<div class="weather_image"><img src="view/images/' + day_weather_icon + '.png"></div>' +
					'<div class="temp_day">' + day_weather_temp + ' &deg;C</div>' +
					'<div class="dayOfWeek">' + dayOfWeek + '</div>' +
				'</div>';
			//вся погода за один день
			tabs_html += 
				'<div class="tab_data">' +
					'<div class="row">' +
						'<div class="day_of_week">' + dayOfWeek + ', ' + dayMonth + '</div>' +
					'</div>';
			//через каждые 3 часа
			elem.forEach(function(item, i) {
				tabs_html += 
					'<div class="row">' +
						'<div class="col-md-2 col-sm-2 col-xs-2 day_img">' +
							'<img src="view/images/' + item.weather[0].icon + '.png">' +
						'</div>' +
						'<div class="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-1 col-xs-2 day_temp">' +
							'<div class="temp_day">' + Math.floor(item.main.temp) + ' &deg;C</div>' +
							'<div>' + item.dt_txt.substr(11,5) + '</div>' +
						'</div>' +
						'<div class="col-md-4 col-sm-4 col-xs-5">'+
							'<div class="pressure">Давление: ' + Math.floor(item.main.pressure * 0.750064) + ' мм. рт. ст.</div>' +
							'<div class="wind_speed">Скорость ветра: ' + item.wind.speed + ' м/с,</div>' +
							'<div class="wind_direction">' + degreeToDirection(item.wind.deg) + '</div>' +
						'</div>' +
						'<div class="col-md-3 col-sm-3 col-xs-3">' +
							'<div class="humidity">' + item.main.humidity + ' %</div>' +
							'<div>Влажность</div>' +
						'</div>' +
					'</div>';
			});
			tabs_html += 
				'</div>';
		});
		weatherHtml += '</div></div>';
		weatherBlock.html(weatherHtml);
		tabsBlock.html(tabs_html);
		tabsBlock.show();

		var tab_data = $('.tab_data');
		var tab = $('.tab');
		//устанавливаем фокус на вкладку по дате
		tab.removeClass('hover');
		$('#' + input_date).addClass('hover');
		tabsBlock.scrollTop(tab[0]);
		/*$('#datetimepicker').off();
		$('#datetimepicker').on('dp.change', function() {
			$('#' + $(this).find('input').val().replace('.', '_').replace('.', '_')).click();
		})*/
		//
		var canScroll = true;
		//перемещение по вкладкам при скролле
		tabsBlock.off();
		tabsBlock.scroll(function(){
			if (canScroll) {
				//устанавливаем фокус на вкладку по индексу ближайшего к верху дня
				var scroll = $(this).scrollTop();
				var top_max = 5000;
				var index = 0;
				tab_data.each(function(i) {
					if (Math.abs($(this).position().top) < top_max) {
						top_max = Math.abs($(this).position().top);
						index = i;
					}
				});
				tab.removeClass('hover');
				$(tab[index]).addClass('hover');
			}
		})
		//скролл до нужного дня при клике на вкладку
		tab.each(function(i) {
			$(this).click(function() {
				canScroll = false;
				tabsBlock.scrollTo(tab_data[i],500);
				tab.removeClass('hover');
				$(this).addClass('hover');
				setTimeout(function() {
					canScroll = true;
				}, 500)
			})
			
		})
		setTimeout(function() {
			loader.hide();
			$('body').css('overflow-y', 'auto');
			$('#' + input_date).click();
			city.val('');
			datetimepicker_input.val('');
			responsive();
		}, 500)
		
		
	}
	function responsive() {
		if ($(window).width() <= 768 ) {
			var max = 0;
			$('.tab_data').each(function() {
				if ($(this).height() > max)
					max = $(this).height();
			})
			$('#tab_data').css('height', max);
			//$('.tab_data').css('height', max);
		} else {
			$('#tab_data').attr('style', '').show();
			$('.tab_data').attr('style', '');
			$('#weather').removeClass('fixed');
		}
	}
	function isIE () {
		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}
});

