<?php
	//** Start the session if it hasn't been started yet
	if (!isset($_SESSION)) {
	  session_start();
	}
	//** Check to see if the user is logged in **//
	if (!isset($_SESSION['username']) || !isset($_SESSION['id'])) exit;
	
    require "mysql_backend.php";
    
    $templatePath = "../../templates/";
    $edit = true;
    
    //print_r($_GET);
    if(isset($_GET['pageId']) && is_numeric($_GET['pageId']) && isset($_GET['entryId'])) //Get a single Entry
    {
        $con = get_connection(); 
        
        //// Check to see if the entry is locked - no more, checked by the get_entry function
        $lockData['id'] = $_GET['entryId'];
        $lockData['page'] = $_GET['pageId'];
        $lockData['type'] = "entries";
        if (get_lock($con, $lockData['type'], $lockData['page'], $lockData['id'])) exit;
        
        // Lock the entry
        $lockData['locked'] = 1;
        $lockData['timestamp'] = true;
        $lockData['author'] = get_user_id(); // CHANGE TO USER ID!!
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
			$data_col = json_decode(base64_decode($data['data']), true); //Data array in the DB is serialized and B64d, so we need to undo it.
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
        include($templatePath . $data["template"] . "_entry.php");
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
				$data_col = json_decode(base64_decode($row['data']), true); //Data array in the DB is serialized and B64d, so we need to undo it.
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
        
        // Check the lock on the page
        $lockData['id'] = $_GET['pageId'];
        $lockData['type'] = "pages";
        if (get_lock($con, $lockData['type'], $lockData['id'])) exit;
        
        // Lock the page
        $lockData['locked'] = 1;
        $lockData['timestamp'] = true;
        $lockData['author'] = get_user_id(); // CHANGE TO USER ID!!
        modify_data($con, $lockData);
        
        // Lock the draft of the page if it exists
        if (draft_exists($con, $lockData['id'])) {
        	$lockData['page_id'] = $lockData['id'];
        	unset($lockData['id']);
        	$lockData['entry_id'] = NULL;
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
			$data_col = json_decode(base64_decode($data['data']), true); //Data array in the DB is serialized and B64d, so we need to undo it.
			unset($data['data']); //Remove the B64 version
			$data = array_merge($data, $data_col); //Merge the new arrays
		}
		else
		{
			unset($data['data']);
		}
		// Now get the entries for this page if it has entries
		if ($data['list']) {
			/*$sort = (isset($get['sort'])) ? $get['sort'] : "date_createddesc";
			$pagedata['entriesSort'] = $sort;
			$descSortLength = strlen($sort) - 1 - 4;
			$ascSortLength = strlen($sort) - 1 - 3;
			if ($descSortLength > 0 && stristr(substr($sort, $descSortLength), "desc")) {
				$sort = substr_replace($sort, "", $descSortLength + 1);
				$sortDirection = "DESC";
			} else if ($ascSortLength > 0 && stristr(substr($sort, $ascSortLength), "asc")) {
				$sort = substr_replace($sort, "", $ascSortLength + 1);
				$sortDirection = "ASC";
			} else {
				$sortDirection = "ASC";
			}
			$sql = 'SELECT * FROM entries WHERE page=\'' . $get['p'] . '\' AND display=\'1\' ORDER BY ' . $sort . ' ' . $sortDirection . ', name ASC';*/
			
			//$query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE page=\"" . $pages[0]['id'] . "\" ORDER BY date_modified DESC";
			$entries = get_entries($con, $data['id']);
			$limit = 3;
			$page = 1;
			$data['entriesNum'] = count($entries);
			$data['entriesPages'] = ceil($data['entriesNum']/$limit);
			$data['entriesStartNum'] = ($page - 1) * $limit;
			$data['entriesLimit'] = $limit;
			if($data['entriesStartNum'] >= $data['entriesNum']) {
				$limit = $data['entriesPages'];
				$data['entriesStartNum'] = ($page - 1) * $limit;
			}
			$data['entriesPage'] = $page;
			
			// Set the limit based on the page and limit amount
			//$sql .= ' LIMIT ' . $pagedata['entriesStartNum'] . ',' . $get['elimit'];
			
			//$result = mysql_query($sql, $con);
			
			foreach($entries as &$entry) {
				if ($entry['data'] != NULL) {
					$entry_col = json_decode(base64_decode($entry['data']), true); //Data array in the DB is serialized and B64d, so we need to undo it.
					unset($entry['data']); //Remove the B64 version
					$entry = array_merge($entry, $entry_col); //Merge the new arrays
				} else {
					unset($entries['data']);
				}
			}
			$data['entries'] = $entries;
			unset($entry);
			unset($entries);
		}
		unset($data['rank']);
		unset($data['draft']);
		unset($data['page']);
		unset($data['locked']);
        include($templatePath . $data["template"] . "_page.php");
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
    else if(isset($_GET['checkLogin']))
    {
    	$userId = get_user_id();
    	if ($userId != NULL) { // If the user is logged in
    		echo 1;
    	} else { // If the user is not logged in
    		echo 0;
    	}
    }
    else //Get a list of pages
    {
        $con = get_connection();
        $data = get_pages($con);
        include("pages_data_template.php");
    }
?>