<?php
	ignore_user_abort(true);
	
	//** Start the session if it hasn't been started yet
	if (!isset($_SESSION)) {
	  session_start();
	}
	//** Check to see if the user is logged in **//
	if (!isset($_SESSION['username']) || !isset($_SESSION['id'])) exit;
	
    require "mysql_backend.php";
	
    //print_r($_POST);
    if(isset($_POST['data']) && isset($_POST['page']))
    {
    	$postData = stripslashes(rawurldecode($_POST['data']));
        $originalData = ($postData != "0" && $postData != "1") ? json_decode($postData, true) : NULL;
        unset($postData);
        
        $data = Array();
		//unset($data['timestamp']);
		if(isset($_POST['unlock']) || isset($_POST['lock'])) // Lock or Unlock a page
		{
			$data['timestamp'] = $draftData['timestamp'] = true;
			$data['author'] = $draftData['lockuid'] = (isset($_POST['unlock'])) ? -1 : get_user_id(); // 0 NEEDS TO BE THE USER ID!!
			$draftData['type'] = "drafts";
			if (isset($_POST['entry'])) { // If the file is an entry
				$data['type'] = "entries";
				$data['page'] = $draftData['page_id'] = $_POST['page'];
				$data['id'] = $draftData['entry_id'] = $_POST['entry'];
			} else { // If the file is a page
				$data['type'] = "pages";
				$data['id'] = $draftData['page_id'] = $_POST['page'];
				$draftData['entry_id'] = NULL;
			}
			
			$con = get_connection();
			if (!draft_exists($con, $draftData['page_id'], $draftData['entry_id'])) $draftData = NULL;
		}
		else if(isset($_POST['entry']) && isset($_POST['revert'])) // Revert an entry
		{
			$revertData['entry_id'] = $_POST['entry'];
			$revertData['page_id'] = $_POST['page'];
		}
		else if(!isset($_POST['entry']) && isset($_POST['revert'])) // Revert a page
		{
			$revertData['entry_id'] = NULL;
			$revertData['page_id'] = $_POST['page'];
		}
		else if(isset($_POST['page']) && isset($_POST['add'])) // Add an entry
		{
			$data['page'] = $_POST['page'];
			$data['name'] = $originalData['name'];
			$data['type'] = "entries";
			$data['display'] = 0;
			$data['draft'] = 1;
			$data['date_created'] = "CURRENT_TIMESTAMP";
			$data['date_modified'] = "CURRENT_TIMESTAMP";
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
			$data['lockuid'] = $draftData['author'] = get_user_id(); // The user id needs to be put here!!
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
				if ($draft['entry_id'] == NULL) { // If the draft is a page
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
			$data['date_modified'] = "CURRENT_TIMESTAMP";
		}
		else if(!isset($_POST['entry']) && isset($_POST['draft'])) // Draft a page
		{
			//echo "third";
			$draftData = Array();
			$data['page_id'] = $draftData['id'] = $_POST['page'];
			$data['lockuid'] = $draftData['author'] = get_user_id(); // The user id needs to be put here!!
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
		if (isset($originalData)) $data['data'] = base64_encode(json_encode($originalData));
        //print_r($data);
        $con = get_connection();
       	if (isset($revertData) && $revertData) {
        	revert_data($con, $revertData);
        } else if (isset($deleteData) && $deleteData) {
        	delete_data($con, $deleteData);
        } else if (isset($publishSite) && $publishSite) {
        	foreach($drafts as &$draft) {
        		modify_data($con, $draft);
        		unset($draft['data']);
        	}
        	// Return the array to the javascript side
        	print(json_encode($drafts));
        } else {
        	modify_data($con, $data);
        }
        if (isset($draftData) && $draftData) modify_data($con, $draftData); // Change the db to say there is a draft
    } else { // Settings saver
    	$con = get_connection();
    	
    	if (isset($_POST['password']) && isset($_POST['oldPassword']))
    	{
    		$userData = get_user_data($con, Array("password"));
    		if ($userData['password'] == js_hash($_POST['oldPassword']) && $_POST['password'] == $_POST['confirmPassword']) {
    			$data['password'] = js_hash($_POST['password']);
    			$data['id'] = get_user_id();
    			$data['type'] = "users";
    			
    			$confirmation = "Your password has been changed.";
    		} else {
    			$confirmation = "There was an error changing your password.";
    			$confirmationType = "fail";
    		}
    	}
    	else if (isset($_POST['email']))
    	{
    		if ($_POST['email'] != "") {
				// Assuming that the email is valid...
				$data['email'] = $_POST['email'];
				$data['id'] = get_user_id();
				$data['type'] = "users";
				$confirmation = "The email address has been changed.";
			} else {
				$confirmationType = "fail";
				$confirmation = "No email address was entered.";
			}
    	}
    	else if (isset($_POST['username']))
    	{
    		if ($_POST['username'] != "") {
				$data['username'] = $_POST['username'];
				$data['id'] = get_user_id();
				$data['type'] = "users";
				
				$_SESSION['username'] = $data['username'];
				
				$confirmation = "Your username has been changed.";
			} else {
				$confirmationType = "fail";
				$confirmation = "No username was entered.";
			}
    	}
    	else
    	{
    		$confirmationType = "fail";
    		$confirmation = "No information was entered.";
    	}
    	
    	if (isset($data)) modify_data($con, $data);
    	
    	$_SESSION['confirmationType'] = (isset($confirmationType)) ? $confirmationType : "success";
    	$_SESSION['confirmation'] = $confirmation;
    	header("Location: ../settings.php");
    }
?>