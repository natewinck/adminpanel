<?php
	include('mysql_backend.php');
	
	$con = get_connection();
	
	$username = mysql_real_escape_string($_GET['username']);
	$password = mysql_real_escape_string($_GET['password']);
	$email = mysql_real_escape_string($_GET['email']);
	$rank = mysql_real_escape_string($_GET['rank']);
	
	$password = hash('sha256', hash('sha512', hash('sha256', $password) . "boom-deyada boom-deyada"));
	
	echo insert_user_data($con, $username, $password, $email, $rank);
?>