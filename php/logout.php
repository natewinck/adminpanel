<?php
	//** Validate request to login to this site. **//
	if (!isset($_SESSION)) {
	  session_start();
	}
	
	if (isset($_SESSION['username']) || isset($_SESSION['id'])) {
		unset($_SESSION['username']);
		unset($_SESSION['id']);
		unset($_SESSION);
	}
	
	header("Location: ../login.html");
?>