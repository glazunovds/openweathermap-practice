<?php
	require_once "connect.php";
	if (isset($_POST['addWeatherJson'])) {
		$query = $mysqli->real_escape_string($_POST['query']);
		$json = $mysqli->real_escape_string(json_encode($_POST['json']));
		$date = date("Y-m-d");
		if ($mysqli->query("INSERT INTO weather(query, json, date_added) VALUES ('$query', '$json', '$date')"))
			echo "ok";
		else
			echo "fail";
	}
?>