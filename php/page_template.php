<?php
	$string = "<html>\n\t<head>\n\t\t<title>";
	$string = $string . $data['name'] . "</title>\n\t</head>\n\t<body>\n";

	foreach($data as $key => $value)
	{
		$string = $string . "\t\t<div class=\"NWEditable NWField". $key . "NWZ\">$value</div>\n";
	}
	$string = $string . "</body>\n</html>";
	$len = strlen($string);
	header("content-type: text/html");
	header("content-length: $len");
	echo $string;
?>