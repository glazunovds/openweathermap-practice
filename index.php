<!DOCTYPE html>
<html>
<head>
	<title>Practice task</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	<link rel="stylesheet" href="view/css/style.css">
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
	<link rel="stylesheet" href="view/vendors/bootstrap-datetimepicker/bootstrap-datetimepicker.css">
	<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i" rel="stylesheet">
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
	<link rel="icon" type="image/png" href="view/images/favicon.png" />
	<link rel="apple-touch-icon-precomposed" href="view/images/favicon.png"/>
</head>
<body>
	<div class="container">
		<dir class="row" id='row'>
			<form id='main-form'>
				<div class="weather_form col-md-6 col-md-offset-3">
					<div class='form-group resp'>
						<input type="text" class="form-control city" id="city" placeholder="Введите город" autofocus>
					</div>
					<div class="form-group resp">
						<div class='input-group date' id='datetimepicker'>
							<input type='text' class="form-control" placeholder="Выберите дату" />
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-calendar"></span>
							</span>
						</div>
					</div>
					<div class="btn_wrapper row resp">
						<button type="submit" class="btn_send btn btn_default form-control">Отправить</button>
					</div>
				</div>
			</form>
		</dir>
		<div class="loader">
			<div class='uil-sunny-css' style='transform:scale(2);'><div class="uil-sunny-circle"></div><div class="uil-sunny-light"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
		</div>
		<div class="row">
			<div class="row from_db">Информация взята из базы данных</div>
			<div class="col-md-7 ">
				<div id="weather"></div>
				<div id="tab_data"></div>
			</div>
			<div class="col-md-5 ">
				<div id="map"></div>
			</div>
		</div>
	</div>
	<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<script type="text/javascript" src="view/vendors/moment.js"></script>
	<script type="text/javascript" src="view/vendors/jquery.sticky.js"></script>
	<script type="text/javascript" src="view/vendors/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js"></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCdQ6OyIOEEUdq76Hej1PO8AuF_4Ilsm8g"></script>
	<script type="text/javascript" src="view/js/main.js"></script>
</body>
</html>
