<?php
	require_once "connect.php";
	if (isset($_POST['getWeatherJson'])) {
		$query = $mysqli->real_escape_string($_POST['query']);
		$date = $mysqli->real_escape_string($_POST['date']);
		$q = $mysqli->query("SELECT * FROM weather WHERE query='$query' AND '$date' BETWEEN date_added AND date_add(date_added, INTERVAL 5 DAY)");
		$weather = mysqli_fetch_assoc($q);
		if (!$weather)
			echo "fail";
		else
			print json_encode($weather);
	}
?>