<?php
	$mysqli = new mysqli("localhost", "root", "", "practice");
	$mysqli->set_charset("utf8");
	if ($mysqli->connect_errno) {
	    printf("Не удалось подключиться к базе данных: %s\n", $mysqli->connect_error);
	    exit();
	}

?>