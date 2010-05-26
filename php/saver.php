<?php
    require "mysql_backend.php";
	
    //print_r($_POST);
    if(isset($_POST['data']) && isset($_POST['page']))
    {
        $originalData = unserialize(urldecode(stripslashes($_POST['data'])));
        $data = Array();
		//unset($data['timestamp']);
		if(isset($_POST['unlock']) || isset($_POST['lock'])) // Lock a page
		{
			$data['timestamp'] = $draftData['timestamp'] = true;
			$data['author'] = $draftData['lockuid'] = (isset($_POST['unlock'])) ? -1 : 0; // 0 NEEDS TO BE THE USER ID!!
			$draftData['type'] = "drafts";
			if (isset($_POST['entry'])) { // If the file is an entry
				$data['type'] = "entries";
				$data['page'] = $draftData['page_id'] = $_POST['page'];
				$data['id'] = $draftData['entry_id'] = $_POST['entry'];
			} else { // If the file is a page
				$data['type'] = "pages";
				$data['id'] = $draftData['page_id'] = $_POST['page'];
				$draftData['entry_id'] = -1;
			}
			$con = get_connection();
			if (!draft_exists($con, $_POST['page'], $_POST['entry'])) $draftData = NULL;
		}
		else if(isset($_POST['entry']) && isset($_POST['revert'])) // Revert an entry
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
			$data['lockuid'] = $draftData['author'] = $originalData['author']; // The user id needs to be put here!!
			//unset($data['author']);
			$data['type'] = "drafts";
			$draftData['type'] = "entries";
			$draftData['draft'] = 1;
			$draftData['locked'] = 1;
			$draftData['timestamp'] = true; // Force the timestamp update
			//unset($data['id']);
		}
		else if(isset($_POST['site'])) // Publish the site
		{
			$publishSite = true;
			$draftsOrig = get_drafts(get_connection());
			$drafts = Array();
			foreach($draftsOrig as $draft) {
				if ($draft['locked']) continue;
				$tempDraft['data'] = $draft['data'];
				$tempDraft['name'] = $draft['name'];
				$tempDraft['draft'] = 0;
				if ($draft['entry_id'] == -1) { // If the draft is a page
					$tempDraft['id'] = $draft['page_id'];
					$tempDraft['type'] = "pages";
				} else { // If the draft is an entry
					$tempDraft['id'] = $draft['entry_id'];
					$tempDraft['page'] = $draft['page_id'];
					$tempDraft['display'] = 1;
					$tempDraft['type'] = "entries";
				}
				
				array_push($drafts, $tempDraft);
			}
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
			$data['lockuid'] = $draftData['author'] = $originalData['author']; // The user id needs to be put here!!
			$data['name'] = $originalData['name'];
			/*unset($data['author']);
			unset($data['rank']);
			unset($data['draft']);
			unset($data['list']);
			unset($data['locked']);*/
			$data['type'] = "drafts";
			$draftData['type'] = "pages";
			$draftData['draft'] = 1;
			$draftData['locked'] = 1;
			$draftData['timestamp'] = true; // Force the timestamp update
			//unset($data['id']);
		}
		else if(!isset($_POST['drafts']) && !isset($_POST['entry'])) // Publish a page
		{
			//echo "fourth";
			$data['id'] = $_POST['page'];
			$data['type'] = "pages";
			$data['draft'] = 0;
		}
		if (isset($originalData['name'])) $data['name'] = strip_tags($originalData['name']);
		unset($originalData['name']);
		if ($originalData) $data['data'] = base64_encode(serialize($originalData));
        //print_r($data);
        $con = get_connection();
       	if ($revertData) {
        	revert_data($con, $revertData);
        } else if ($deleteData) {
        	delete_data($con, $deleteData);
        } else if ($publishSite) {
        	foreach($drafts as &$draft) {
        		modify_data($con, $draft);
        		unset($draft['data']);
        	}
        	// Return the array to the javascript side
        	print(serialize($drafts));
        } else {
        	modify_data($con, $data);
        }
        if ($draftData) modify_data($con, $draftData); // Change the db to say there is a draft
    }
?>