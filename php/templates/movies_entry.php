<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $data["name"]; ?></title>
<style>
canvas { border: 1px solid black; }
.rounded {
	-moz-border-radius: 20px;
	-webkit-border-radius: 20px;
	border: solid 1px #999999;
	padding: 10px;
	margin: 5px;
	background-color: #eeeeee;
	-webkit-box-shadow: 3px 3px 2px #888888;
}

.newspaper {
	-moz-column-width: 13em;
	-moz-column-gap: 1em;
	-webkit-column-width: 13em;
	-webkit-column-gap: 1em;
	min-height: 60px;
	min-width: 60px;
	background: #dddddd;
}

@font-face { 
	font-family: 3HourTour;
	src: url('3HourTour.dfont');
}

.threeHourTour {
	font-family: '3HourTour';
}

@font-face {
	font-family: 'Vizier Heavy';
	src: url('Vizier Heavy.dfont');
}
h3 {
	font-family: 'Vizier Heavy';
	font-size: 24pt;
	margin: 10px;
	cursor: ew-resize;
}
h2 {
	min-height: 30px;
	min-width: 30px;
	background: #999999;
}
</style>
</head>

<body>
<h3>The movies entry template</h3>
<div class="newspaper NWEditable NWFieldnewspaperNWZ" <?php if ($data["newspaperStyle"]) echo "style=\"" . $data["newspaperStyle"] . "\""; ?>><?php if ($data["newspaper"]) echo $data["newspaper"]; ?></div>
<h2 class="NWEditable NWFieldheaderNWZ" <?php if ($data["newspaperStyle"]) echo "style=\"" . $data["newspaperStyle"] . "\""; ?>><?php if ($data["header"]) echo $data["header"]; ?></h2>
<p class="NWEditable NWFieldnameNWZ" <?php if ($data["newspaperStyle"]) echo "style=\"" . $data["newspaperStyle"] . "\""; ?>><?php if($data["name"]) echo $data["name"]; ?></p>
</body>
</html>
