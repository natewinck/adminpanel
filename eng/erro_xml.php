<?php

	function load($get){
		if(!file_exists('pages/' . $get . '.xml')){
			header('Location: 404');
		}
		else{
			$xml = simplexml_load_file('pages/' . $get . '.xml', 'SimpleXMLElement', LIBXML_NOCDATA);
		}
		return $xml;
	};

?>
