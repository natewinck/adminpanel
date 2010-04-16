<?php
    require "mysql_backend.php";
	
    //print_r($_GET);
    if(isset($_GET['data']) && isset($_GET['page']))
    {
        $data = unserialize(urldecode(stripslashes($_GET['data'])));
		unset($data['timestamp']);
        if(isset($_GET['entry']) && isset($_GET['draft']))
		{
			$data['entry_id'] = $_GET['entry'];
			$data['page_id'] = $_GET['page'];
			$data['lockuid'] = $data['author'];
			unset($data['author']);
			$data['type'] = "drafts";
			unset($data['id']);
		}
        else if(isset($_GET['entry']) && !isset($_GET['draft']))
		{
			$data['id'] = $_GET['entry'];
			$data['page'] = $_GET['page'];
			$data['type'] = "entries";
		}
		else if(!isset($_GET['entry']) && isset($_GET['draft']))
		{
			$data['page_id'] = $_GET['page'];
			$data['lockuid'] = $data['author'];
			unset($data['author']);
			$data['type'] = "drafts";
			unset($data['id']);
		}
		else if(!isset($_GET['drafts']) && !isset($_GET['entry']))
		{
			$data['id'] = $_GET['page'];
			$data['type'] = "pages";
		}
		$data['name'] = strip_tags($data['name']);
        print_r($data);
        $con = get_connection();
        modify_data($con, $data);
    }
?>