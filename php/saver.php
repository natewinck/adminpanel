<?php
    require "mysql_backend.php";
	
    //print_r($_POST);
    if(isset($_POST['data']) && isset($_POST['page']))
    {
        $originalData = unserialize(urldecode(stripslashes($_POST['data'])));
        $data = Array();
		//unset($data['timestamp']);
		if(isset($_POST['entry']) && isset($_POST['revert']))
		{
			$revertData['entry_id'] = $_POST['entry'];
			$revertData['page_id'] = $_POST['page'];
		}
		else if(!isset($_POST['entry']) && isset($_POST['revert']))
		{
			$revertData['entry_id'] = -1;
			$revertData['page_id'] = $_POST['page'];
		}
        else if(isset($_POST['entry']) && isset($_POST['draft']))
		{
			echo "first";
			$draftData = Array();
			$data['entry_id'] = $draftData['id'] = $_POST['entry'];
			$data['page_id'] = $draftData['page'] = $_POST['page'];
			$data['name'] = $originalData['name'];
			$data['lockuid'] = $originalData['author'];
			//unset($data['author']);
			$data['type'] = "drafts";
			$draftData['type'] = "entries";
			$draftData['draft'] = 1;
			//unset($data['id']);
		}
        else if(isset($_POST['entry']) && !isset($_POST['draft']))
		{
			echo "second";
			$data['id'] = $_POST['entry'];
			$data['page'] = $_POST['page'];
			$data['type'] = "entries";
			$data['draft'] = 0;
		}
		else if(!isset($_POST['entry']) && isset($_POST['draft']))
		{
			echo "third";
			$draftData = Array();
			$data['page_id'] = $draftData['id'] = $_POST['page'];
			$data['lockuid'] = $originalData['author'];
			$data['name'] = $originalData['name'];
			/*unset($data['author']);
			unset($data['rank']);
			unset($data['draft']);
			unset($data['list']);
			unset($data['locked']);*/
			$data['type'] = "drafts";
			$draftData['type'] = "pages";
			$draftData['draft'] = 1;
			//unset($data['id']);
		}
		else if(!isset($_POST['drafts']) && !isset($_POST['entry']))
		{
			echo "fourth";
			$data['id'] = $_POST['page'];
			$data['type'] = "pages";
			$data['draft'] = 0;
		}
		$data['name'] = strip_tags($originalData['name']);
		unset($originalData['name']);
		$data['data'] = base64_encode(serialize($originalData));
        print_r($data);
        $con = get_connection();
        if (!$revertData) {
        	modify_data($con, $data);
        } else {
        	revert_data($con, $revertData);
        }
        if ($draftData) modify_data($con, $draftData); // Change the db to say there is a draft
    }
?>