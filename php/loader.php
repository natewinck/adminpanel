<?php
    require "mysql_backend.php";
    
    //print_r($_GET);
    if(isset($_GET['pageId']) && is_numeric($_GET['pageId']) && isset($_GET['entryId'])) //Get a single Entry
    {
        $con = get_connection(); 
        
        //// Check to see if the entry is locked - no more, checked by the get_entry function
        $lockData['id'] = $_GET['entryId'];
        $lockData['page'] = $_GET['pageId'];
        $lockData['type'] = "entries";
        //check_lock($con, $lockData);
        
        // Lock the entry
        $lockData['locked'] = 1;
        $lockData['timestamp'] = true;
        $lockData['author'] = 0; // CHANGE TO USER ID!!
        modify_data($con, $lockData);
        
        // Lock the draft of the entry if it exists
        if (draft_exists($con, $lockData['page'], $lockData['id'])) {
        	$lockData['page_id'] = $lockData['page'];
        	unset($lockData['page']);
        	$lockData['entry_id'] = $lockData['id'];
        	unset($lockData['id']);
        	$lockData['lockuid'] = $lockData['author'];
        	unset($lockData['author']);
        	unset($lockData['locked']);
        	$lockData['type'] = "drafts";
        	
        	modify_data($con, $lockData);
        }
        
        
        
        $data = get_entry($con, $_GET['pageId'], 'id', $_GET['entryId']);
		if($data['data'] != NULL)
		{
			$data_col = unserialize(base64_decode($data['data'])); //Data array in the DB is serialized and B64d, so we need to undo it.
			unset($data['data']); //Remove the B64 version
			$data = array_merge($data, $data_col); //Merge the new arrays
		}
		else
		{
			unset($data['data']);
		}
		unset($data['rank']);
		unset($data['draft']);
		unset($data['page']);
		unset($data['locked']);
        include("templates/" . $data["template"] . "_entry.php");
        unset($data['template']);
    }
    else if(isset($_GET['pageId']) && isset($_GET['xml'])) //Get list of entries in XML form
    {
        $con = get_connection();
        if(isset($_GET['start']) && isset($_GET['max']))
        {
            $data = get_entries($con, $_GET['pageId'], $_GET['start'], $_GET['max']);
        }
        else if(isset($_GET['start']))
        {
            $data = get_entries($con, $_GET['pageId'], $_GET['start']);
        }
        else
        {
            $data = get_entries($con, $_GET['pageId']);
        }
        foreach($data as &$row)
        {
        	// No need for the data field when loading to fill in the entries
       		unset($row['data']);
       		$row['name'] = str_replace("&nbsp;", " ", $row['name']);
			/*if($row['data'] != NULL)
			{
				$data_col = unserialize(base64_decode($row['data'])); //Data array in the DB is serialized and B64d, so we need to undo it.
				unset($row['data']); //Remove the B64 version
				$row = array_merge($row, $data_col); //Merge the new arrays
			}
			else
			{
				unset($row['data']);
			}*/
        }
        
        include("entries_data_template.php");
    }
    else if(isset($_GET['changed'])) // Get a list of changed files in XML form
    {
    	// This script will always check the pages, but not necessarily all the entries
    	if(isset($_GET['pageId'])) // If there are entries to find too, add those to the array as well
    	{
    		$pageId = $_GET['pageId'];
    	} else {
    		$pageId = NULL;
    	}
    	$con = get_connection();
        $data = get_changed($con, $pageId);
    	include("files_data_template.php");
    }
    else if(isset($_GET['pageId'])) //Get a single page
    {
        $con = get_connection();
        
        // Lock the page
        $lockData['id'] = $_GET['pageId'];
        $lockData['type'] = "pages";
        $lockData['locked'] = 1;
        $lockData['timestamp'] = true;
        $lockData['author'] = 0; // CHANGE TO USER ID!!
        modify_data($con, $lockData);
        
        // Lock the draft of the page if it exists
        if (draft_exists($con, $lockData['id'])) {
        	$lockData['page_id'] = $lockData['id'];
        	unset($lockData['id']);
        	$lockData['entry_id'] = -1;
        	$lockData['lockuid'] = $lockData['author'];
        	unset($lockData['author']);
        	unset($lockData['locked']);
        	$lockData['type'] = "drafts";
        	
        	modify_data($con, $lockData);
        }
        
        /*if(isset($_GET['start']) && isset($_GET['max']))
        {
            $data = get_entries($con, $_GET['pageId'], $_GET['start'], $_GET['max']);
        }
        else if(isset($_GET['start']))
        {
            $data = get_entries($con, $_GET['pageId'], $_GET['start']);
        }
        else
        {
            $data = get_entries($con, $_GET['pageId']);
        }*/
        $data = get_page($con, $_GET['pageId']);
        if($data['data'] != NULL)
		{
			$data_col = unserialize(base64_decode($data['data'])); //Data array in the DB is serialized and B64d, so we need to undo it.
			unset($data['data']); //Remove the B64 version
			$data = array_merge($data, $data_col); //Merge the new arrays
		}
		else
		{
			unset($data['data']);
		}
		unset($data['rank']);
		unset($data['draft']);
		unset($data['page']);
		unset($data['locked']);
        include("templates/" . $data["template"] . "_page.php");
        unset($data['template']);
    }
    else if(isset($_GET['xml'])) //Get a list of pages in XML form
    {
        $con = get_connection();
        $data = get_pages($con);
        foreach($data as &$row)
        {
        	// No need for the data field when loading to fill in the entries
       		unset($row['data']);
       		$row['name'] = str_replace("&nbsp;", " ", $row['name']);
        }
        include("pages_data_template.php");
    }
    else //Get a list of pages
    {
        $con = get_connection();
        $data = get_pages($con);
        include("pages_data_template.php");
    }
?>