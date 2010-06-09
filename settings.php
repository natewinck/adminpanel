<?php
	//** Start the session if it hasn't been started yet
	if (!isset($_SESSION)) {
	  session_start();
	}
	//** Check to see if the user is logged in **//
	if (!isset($_SESSION['username']) || !isset($_SESSION['id'])) {
		header("Location: login.html");
	}
?><!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Admin Panel | Settings</title>
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8rc3.custom.min.js"></script>
<script type="text/javascript" src="js/utils.js"></script>
<script type="text/javascript" src="js/inputlabel.js"></script>

<link href="css/settings.css" rel="stylesheet" type="text/css" />

<script type="text/javascript">
$(document).ready(function() {
	$(".placeholder").click(onInputFocus);
	$("input[type='text'], input[type='password']").focus(onInputFocus);
	$("a.button").click(function(){
		$(this).parents("form").submit();
	});
	$(".passwordForm").submit(function() {
		var passwordPreHash = $(this).children(".passwordPreHash");
		var i = 0;
		$(this).children(".password").each(function() {
			$(this).val(SHA256($(passwordPreHash[i]).val()));
			$(passwordPreHash[i]).val("");
			i++;
		});
	});
});
</script>
</head>

<body>
<div id="gradientBottom"></div>
<div id="adminPanel"></div>
<?php if (isset($_SESSION['confirmation'])) { ?> <div id="confirmation" class=<?php echo "\"" . $_SESSION['confirmationType'] . "\""; ?>><?php echo $_SESSION['confirmation']; ?></div><?php unset($_SESSION['confirmationType']); unset($_SESSION['confirmation']); } ?>
<a id="return" href="./">Return to Admin Panel</a>
<div id="settingsBox">
	<ul id="settingsList">
		<li>
			<form action="php/saver.php" method="post">
				<h2>Change Username</h2>
				<label class="placeholder"><span>Username</span></label>
				<input type="password" name="username" />
				<a class="button"><span>Change Username</span></a>
				<input type="submit" />
			</form>
		</li>
		<li>
			<form action="php/saver.php" method="post" class="passwordForm">
				<h2>Change Password</h2>
				<label class="placeholder"><span>Old Password</span></label>
				<input type="password" name="oldPasswordPreHash" class="passwordPreHash" />
				<input type="hidden" name="oldPassword" class="password" />
				<label class="placeholder"><span>New Password</span></label>
				<input type="password" name="passwordPreHash" class="passwordPreHash" />
				<input type="hidden" name="password" class="password" />
				<label class="placeholder"><span>Confirm New Password</span></label>
				<input type="password" name="confirmPasswordPreHash" class="passwordPreHash" />
				<input type="hidden" name="confirmPassword" class="password" />
				<a class="button"><span>Change Password</span></a>
				<input type="submit" />
			</form>
		</li>
		<li>
			<form action="php/saver.php" method="post">
				<h2>Change Email Address</h2>
				<label class="placeholder"><span>New Email Address</span></label>
				<input type="text" name="email" />
				<a class="button"><span>Change Email Address</span></a>
				<input type="submit" />
			</form>
		</li>
	</ul>
	<!--<div id="loginFormBox">
    	<form id="loginForm">
        	<input type="checkbox" id="usernameInput" />
            <input type="checkbox" id="passwordInput" />
            <input type="button" id="loginButton" />
        </form>
    </div>-->
</div>
</body>
</html>
