<?php
	include('mysql_backend.php');
	
	$con = get_connection();
	
	$username = mysql_real_escape_string($_GET['username']);
	$password = mysql_real_escape_string($_GET['password']);
	$email = mysql_real_escape_string($_GET['email']);
	$rank = mysql_real_escape_string($_GET['rank']);
	
	$password = raw_hash($password);
	
	echo insert_user_data($con, $username, $password, $email, $rank);
?>