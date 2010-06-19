<?php
	function echopage($data, $useid){
		$templatePath = "templates/";
		if($useid == false){
			include($templatePath . 'main.php');
		}
		else{
			$templateType = (isset($data['page'])) ? "_entry" : "_page";
			include($templatePath . $data['template'] . $templateType . '.php');
		}
	};
?>
