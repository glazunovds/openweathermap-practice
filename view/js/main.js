import Weather from '../Weather/Weather';
import TabData from '../Weather/TabData';
import * as ReactDOM from 'react-dom';
import React from 'react';

$(document).ready(function(){
	jQuery.fn.scrollTo = function(elem, speed) { 
	    $(this).animate({
	        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
	    }, speed == undefined ? 1000 : speed); 
	    return this; 
	};
	init();
	let loader = $('.loader');
	let weather_form = $('.weather_form');
	let datetimepicker = $('#datetimepicker');
	let datetimepicker_input = datetimepicker.find('input');
	let city = $('#city');
	google.maps.event.addDomListener(window, 'load', init);
	let date = new Date();
	let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	let last_day = today;

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
			let scroll = $(this).scrollTop();
			let weather = $('#weather');
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
	    let input = document.getElementById('city');
	    let autocomplete = new google.maps.places.Autocomplete(input);
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
				if (response != 'fail') {
					let json = JSON.parse(JSON.parse(response).json);
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
					let location = response.results[0].geometry.location;
					let formatted_city;
					if (typeof response.results[0].address_components[3] !== 'undefined')
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
		let coords = {lat: lat, lng: lng};
		let map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: coords
		});
		let marker = new google.maps.Marker({
			position: coords,
			map: map
		});
	}

	//преобразуем градусы в направление
	function degreeToDirection(deg) {
		let temp = parseInt((deg/22.5)+ 0.5);
		let directions = ['С','ССВ','СВ','ВСВ','В','ВЮВ', 'ЮВ', 'ЮЮВ','Ю','ЮЮЗ','ЮЗ','ЗЮЗ','З','ЗСЗ','СЗ','ССЗ'];
		return directions[temp % 16];
	}

	//рендерим погодный блок
	function renderWeather(obj, input_date) {
		input_date = input_date.replace('.', '_').replace('.', '_');
		//группируем ответ по дням
		let groups = _.groupBy(obj.list, function(elem){
			return elem.dt_txt.substr(0,10);
		});
		Object.keys(groups).forEach(function(item,i){if (i >= 5) delete groups[item]});
		let tabsBlock = $('#tab_data');
		let tabs_html = '';
		let months = [ 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря' ];

        let tabs = [];
        let tabData = [];
        Object.keys(groups).forEach(function (item, i) {
            let elem = groups[item];
            let dayOfWeek = moment().add(i, 'day').locale('ru').format('dddd');
            let dayMonth = moment().add(i, 'day').locale("ru").format('DD') + ' ' + months[moment().add(i, 'day').locale("ru").format('M')-1];
            let date = moment().add(i, 'day').locale('ru').format('DD_MM_YY');
            let dayWeatherIcon = elem[0].weather[0].icon;
            let dayWeatherTemp = Math.floor(elem[0].main.temp);
            elem.forEach(function (item, i) {
                if (item.dt_txt.substr(11, 9) === '12:00:00') {
                    dayWeatherIcon = item.weather[0].icon;
                    dayWeatherTemp = Math.floor(item.main.temp);
                }
            });
            tabData.push({
                dayOfWeek,
                dayMonth,
				elem
			});
            tabs.push({
                date,
                dayWeatherIcon,
                dayWeatherTemp,
                dayOfWeek
			});
        });
        ReactDOM.render(
			<Weather tabs={tabs} groups={groups}/>,
            document.getElementById('weather')
        );
        ReactDOM.render(
			<TabData tabData={tabData} groups={groups}/>,
            document.getElementById('tab_data')
        );

		tabsBlock.show();

		let tab_data = $('.tab_data');
		let tab = $('.tab');
		//устанавливаем фокус на вкладку по дате
		tab.removeClass('hover');
		$('#' + input_date).addClass('hover');
		tabsBlock.scrollTop(tab[0]);
		/*$('#datetimepicker').off();
		$('#datetimepicker').on('dp.change', function() {
			$('#' + $(this).find('input').val().replace('.', '_').replace('.', '_')).click();
		})*/
		//
		let canScroll = true;
		//перемещение по вкладкам при скролле
		tabsBlock.off();
		tabsBlock.scroll(function(){
			if (canScroll) {
				//устанавливаем фокус на вкладку по индексу ближайшего к верху дня
				let scroll = $(this).scrollTop();
				let top_max = 5000;
				let index = 0;
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
				tabsBlock.scrollTo(tab_data[i],200);
				tab.removeClass('hover');
				$(this).addClass('hover');
				setTimeout(function() {
					canScroll = true;
				}, 200)
			})
		})
		setTimeout(function() {
			loader.hide();
			$('body').css('overflow-y', 'auto');
			$('#' + input_date).click();
			city.val('');
			datetimepicker_input.val('');
			responsive();
		}, 300)
		
		
	}
	function responsive() {
		if ($(window).width() <= 768 ) {
			let max = 0;
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
		let myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}
});

