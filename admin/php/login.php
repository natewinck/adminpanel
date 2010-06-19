<?php
	//** Validate request to login to this site. **//
	if (!isset($_SESSION)) {
	  session_start();
	}
	
	require "mysql_backend.php";
	
	if (isset($_POST['username']) && isset($_POST['password'])) { // If there is a username and password
		$username = $_POST['username'];
		$password = $_POST['password'];
		$con = get_connection();
		$user = check_login($con, $username, $password);
		
		if ($user != false) {
			$_SESSION['username'] = $username;
			$_SESSION['id'] = $user['id'];
			
			header("Location: ../");
		} else { // Go back to the login page
			header("Location: ../login.html");
		}
	} else { // The user did not input both a username and password
		header("Location: ../login.html");
	}
	
	// If logging in, go to the AdminPanel
?>