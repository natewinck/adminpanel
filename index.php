<?php
	session_start();

	$storagemethod = 'sql';
	$get = $_GET;
	
	if(!isset($_GET['p'])){
		//header('Location: home');
		$get['p'] = 1;
	} 
	
	// A custom list of pages that match the corresponding number of its page
	switch ($get['p']) {
		case 'about':
			$get['p'] = 4;
			break;
		case 'media':
			$get['p'] = 8;
			break;
		case 'anime':
			$get['p'] = 9;
			break;
		case 'manga':
			$get['p'] = 10;
			break;
		case 'visualNovel':
			$get['p'] = 11;
			break;
		case 'ost':
			$get['p'] = 12;
			break;
		default:
			//$get['p'] = 1;
			break;
	}
	
	if (isset($get['e']) && ($get['e'] == "" || !is_numeric($get['e']))) {
		unset($get['e']);
	}
	
	$get['elimit'] = 3;
	$get['epage'] = (isset($get['epage'])) ? $get['epage'] : 1;
	
	require('eng/erro.php');
	require('eng/erro_' . $storagemethod . '.php');

	connect();
	$data = load($get);
	echopage($data, true);

?>
