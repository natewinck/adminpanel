<?php
    require "mysql_backend.php";
	
    //print_r($_POST);
    if(isset($_POST['data']) && isset($_POST['page']))
    {
        $originalData = unserialize(urldecode(stripslashes($_POST['data'])));
        $data = Array();
		//unset($data['timestamp']);
		if(isset($_POST['entry']) && isset($_POST['revert'])) // Revert an entry
		{
			$revertData['entry_id'] = $_POST['entry'];
			$revertData['page_id'] = $_POST['page'];
		}
		else if(!isset($_POST['entry']) && isset($_POST['revert'])) // Revert a page
		{
			$revertData['entry_id'] = -1;
			$revertData['page_id'] = $_POST['page'];
		}
		else if(isset($_POST['page']) && isset($_POST['add'])) // Add an entry
		{
			$data['page'] = $_POST['page'];
			$data['name'] = $originalData['name'];
			$data['type'] = "entries";
			$data['display'] = 0;
			$data['draft'] = 1;
		}
		else if(isset($_POST['entry']) && isset($_POST['delete'])) // Delete an entry
		{
			$deleteData['id'] = $_POST['entry'];
			$deleteData['page'] = $_POST['page'];
			$deleteData['type'] = "entries";
		}
        else if(isset($_POST['entry']) && isset($_POST['draft'])) // Draft an entry
		{
			//echo "first";
			$draftData = Array();
			$data['entry_id'] = $draftData['id'] = $_POST['entry'];
			$data['page_id'] = $draftData['page'] = $_POST['page'];
			$data['lockuid'] = $originalData['author'];
			//unset($data['author']);
			$data['type'] = "drafts";
			$draftData['type'] = "entries";
			$draftData['draft'] = 1;
			//unset($data['id']);
		}
        else if(isset($_POST['entry']) && !isset($_POST['draft']))  // Publish an entry
		{
			//echo "second";
			$data['id'] = $_POST['entry'];
			$data['page'] = $_POST['page'];
			$data['type'] = "entries";
			$data['draft'] = 0;
			$data['display'] = 1;
		}
		else if(!isset($_POST['entry']) && isset($_POST['draft'])) // Draft a page
		{
			//echo "third";
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
		else if(!isset($_POST['drafts']) && !isset($_POST['entry'])) // Publish a page
		{
			//echo "fourth";
			$data['id'] = $_POST['page'];
			$data['type'] = "pages";
			$data['draft'] = 0;
		}
		$data['name'] = strip_tags($originalData['name']);
		unset($originalData['name']);
		if ($originalData) $data['data'] = base64_encode(serialize($originalData));
        //print_r($data);
        $con = get_connection();
       	if ($revertData) {
        	revert_data($con, $revertData);
        } else if ($deleteData) {
        	delete_data($con, $deleteData);
        } else {
        	modify_data($con, $data);
        }
        if ($draftData) modify_data($con, $draftData); // Change the db to say there is a draft
    }
?>