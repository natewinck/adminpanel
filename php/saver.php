<?php
    require "mysql_backend.php";
	
    //print_r($_GET);
    if(isset($_GET['data']) && isset($_GET['page']))
    {
        $data = unserialize(urldecode(stripslashes($_GET['data'])));
		unset($data['timestamp']);
        if(isset($_GET['entry']) && isset($_GET['draft']))
		{
			echo "first";
			$draftData = Array();
			$data['entry_id'] = $draftData['id'] = $_GET['entry'];
			$data['page_id'] = $draftData['page'] = $_GET['page'];
			$data['lockuid'] = $data['author'];
			unset($data['author']);
			$data['type'] = "drafts";
			$draftData['type'] = "entries";
			$draftData['draft'] = 1;
			unset($data['id']);
		}
        else if(isset($_GET['entry']) && !isset($_GET['draft']))
		{
			echo "second";
			$data['id'] = $_GET['entry'];
			$data['page'] = $_GET['page'];
			$data['type'] = "entries";
			$data['draft'] = 0;
		}
		else if(!isset($_GET['entry']) && isset($_GET['draft']))
		{
			echo "third";
			$draftData = Array();
			$data['page_id'] = $draftData['id'] = $_GET['page'];
			$data['lockuid'] = $data['author'];
			unset($data['author']);
			unset($data['rank']);
			unset($data['draft']);
			unset($data['list']);
			unset($data['locked']);
			$data['type'] = "drafts";
			$draftData['type'] = "pages";
			$draftData['draft'] = 1;
			unset($data['id']);
		}
		else if(!isset($_GET['drafts']) && !isset($_GET['entry']))
		{
			echo "fourth";
			$data['id'] = $_GET['page'];
			$data['type'] = "pages";
			$data['draft'] = 0;
		}
		$data['name'] = strip_tags($data['name']);
        print_r($data);
        $con = get_connection();
        modify_data($con, $data);
        if ($draftData) modify_data($con, $draftData); // Change the db to say there is a draft
    }
?>