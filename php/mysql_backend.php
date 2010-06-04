<?php
	//** Start the session if it hasn't been started yet **//
	if (!isset($_SESSION)) {
	  session_start();
	}

    include "mysql_backend_config.php";
	
    //** Connection Function **//
    function get_connection()
    {
        global $config;
        $con = mysql_connect($config['server'], $config['username'], $config['password']);
        mysql_select_db($config['database']);
        return $con;
    }
    
    //** Function to get an array of data from the users table **//
    function get_user_data($con, $data)
    {
    	//print_r($data);
    	$userId = get_user_id(); // Get the logged in user id here
    	//echo "userId: ";
    	if ($userId == NULL) return NULL;
    	//echo $userId;
    	
    	$query = "SELECT ";
        $fields = "";
        $values = "";
        $update = "";
        foreach($data as $field)
        {
            $fields = $fields . $field . ",";
        }
		//echo "FIELDS";
		$fields = substr_replace($fields, "", -1);
		// "WHERE userid =": userid may not be the actual field, since this function was built in advance
		$query = $query . $fields . " FROM users WHERE id = $userId";
		$result = mysql_query($query, $con); // Run the Statement
		$userDataArray = Array(); // Create an empty array
		while($userData = mysql_fetch_assoc($result)) // Loop through the results
		{
			$userDataArray[] = $userData; // Append them
		}
		//echo "\nGETTING DATA\n";
        //echo "\n User data Array: ";
        return $userDataArray[0]; // Return them
    }
    
    //** Function to get the current users user id **//
    function get_user_id()
    {
    	if(isset($_SESSION['id'])) {
    		return $_SESSION['id'];
    	} else {
    		return NULL;
    	}
    }
    
    //** Temporary function to check the username and password for logging in **//
    function check_login($con, $username, $password)
    {
    	if (!isset($username) || !isset($password)) return NULL;
    	
    	$query = "SELECT id FROM users WHERE username = \"$username\" AND password = \"$password\"";
    	$result = mysql_query($query, $con);
    	$users = Array();
        while ($row = mysql_fetch_assoc($result)) {
        	$users[] = $row;
        }
        if (isset($users[0])) { // If there is a match to the username and password, return true
        	return $users[0];
        } else { // If there isn't a match to the username and password, return false
        	return false;
        }
    }
    
    //** Function to get the lock status of a file **//
    function get_lock($con, $table, $pageId, $entryId=NULL)
    {
    	if (!isset($table)) return NULL;
    	$query = "SELECT ";
    	switch ($table) {
    		case "pages":
    			$query .= "author,";
    			$where = "id=$pageId";
    			$userIdField = "author";
    			break;
    		case "entries":
    			$query .= "author,";
    			$where = "id=$entryId AND page=$pageId";
    			$userIdField = "author";
    			break;
    		case "drafts":
    			$query .= "lockuid,";
    			$where = "page_id=$pageId AND entry_id ";
    			$where .= ($entryId == NULL) ? "IS NULL" : "= $entryId";
    			$userIdField = "lockuid";
    			break;
    	}
    	$query .= "UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM $table WHERE $where";
    	
    	$result = mysql_query($query, $con); //Run the Statement
        $files = Array(); //Create an empty array
        while($file = mysql_fetch_assoc($result)) //Loop through the results
        {
        	$file['locked'] = check_lock($file['unix_timestamp'], $file[$userIdField]);
            $files[] = $file; //Append them
        }
        if (!$files[0]) return NULL;
        return $files[0]['locked'];
    }
    
    //** Function to check the lock on a file **//
    function check_lock($timestamp, $userId=NULL, $interval=60)
    {
    	// Interval is in seconds
    	if ($timestamp == NULL) return NULL;
    	
    	if ($userId != NULL) {
			// Code here to get the and current user id
			$userData = Array("id");
			$con = get_connection();
			$userData = get_user_data($con, $userData);
			$currentUserId = $userData['id'];
			
			//echo "\nChecking Lock--------\n";
			//echo "Current User Id: " . $currentUserId . " ";
			//echo "User id: " . $userId;
			// For now, though...
			//$currentUserId = 0;
		}
		
		$isLocked = NULL;
		
		if ($userId != NULL) {
			if ($userId == $currentUserId
				|| $userId == -1 // -1 means unlocked
				|| ($userId != $currentUserId && time() - $timestamp > $interval)
			) {
				$isLocked = 0;
			} else {
				$isLocked = 1;
			}
		} else {
			if (time() - $timestamp > $interval) {
				$isLocked = 0;
			} else {
				$isLocked = 1;
			}
		}
		
    	return $isLocked;
    }
    
    //** Function to get a list of pages **//
    function get_pages($con)
    {
    	// Code here for getting the user id
        $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM pages";
        $result = mysql_query($query, $con); //Run the Statement
        $pages = Array(); //Create an empty array
        echo mysql_error();
        while($page = mysql_fetch_assoc($result)) //Loop through the results
        {
        	$page['locked'] = check_lock($page['unix_timestamp'], $page['author']);
        	if ($page['draft']) {
        		$draft = get_draft($con, $page['id']);
        		$page['name'] = $draft['name'];
        	}
            $pages[] = $page; //Append them
        }
        return $pages; //Return them
    }
    
    //** Function to get a single page **//
    function get_page($con, $page)
    {
    	$draftQuery = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts WHERE page_id = '$page' AND entry_id IS NULL"; // SQL Statement for drafts
    	$query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM pages WHERE id = '$page'"; // SQL Statement
    	$result = mysql_query($draftQuery, $con); // Run the Statement for drafts
    	$isDraft = true;
    	if (mysql_num_rows($result) == 0) {
    		$result = mysql_query($query, $con); // Run the Statement
    		$isDraft = false;
    	}
    	$pages = Array(); // Create an empty array
    	while ($currentPage = mysql_fetch_assoc($result))
    	{
    		$pages[] = $currentPage;  // Append them
    	}
    	
    	$userIdField = ($isDraft) ? "lockuid" : "author";
    	if (check_lock($pages[0]['unix_timestamp'], $pages[0][$userIdField])) return NULL;
    	
    	// Now get the template
    	if ($isDraft) {
			$query = "SELECT * FROM pages WHERE id = $page"; //SQL Statement for getting the template
			$result = mysql_query($query, $con);
			$nonDraftPages = Array();
			while ($row = mysql_fetch_assoc($result)) {
				$nonDraftPages[] = $row;
			}
			// Add the template data to the entries data
			$pages[0]["template"] = $nonDraftPages[0]["template"];
		}
		
    	return $pages[0]; // Return it
    }
    
    //** Function to get a list of entries **//
    function get_entries($con, $page, $start=NULL, $max=NULL)
    {
        if($start == NULL)
        {
            $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE page='$page' ORDER BY id DESC"; //SQL Statement
        }
        else if($max == NULL)
        {
            $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE page='$page' ORDER BY id DESC LIMIT $start"; //SQL Statement
        }
        else
        {
            $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE page='$page' ORDER BY id DESC LIMIT $start, $max"; //SQL Statement
        }
        //echo $query;
        $result = mysql_query($query, $con); //Run the Statement
        $entries = Array(); //Create an empty array
        echo mysql_error();
        while($row = mysql_fetch_assoc($result)) //Loop through the results
        {
        	$row['locked'] = check_lock($row['unix_timestamp'], $row['author']);
        	if ($row['draft']) {
        		$draft = get_draft($con, $row['page'], $row['id']);
        		$row['name'] = $draft['name'];
        	}
            $entries[] = $row; //Append them
        }
        return $entries; //Return them
    }
    
    //** Function to get a single entry **//
    function get_entry($con, $page, $field, $value)
    {
        if(is_numeric($value))
        {
        	$draftQuery = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts WHERE entry_id = $value AND page_id = '$page' LIMIT 0,1"; //SQL Statement for drafts
            $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE $field = $value AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        else
        {
        	$draftQuery = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts WHERE entry_id = '$value' AND page_id = '$page' LIMIT 0,1"; //SQL Statement for drafts
            $query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries WHERE $field = '$value' AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        $result = mysql_query($draftQuery, $con); // Run the Statement for drafts
        $isDraft = true;
        if (mysql_num_rows($result) == 0) {
        	$result = mysql_query($query, $con); //Run the Statement
        	$isDraft = false;
        }
        $entries = Array(); //Create an empty array
        while($row = mysql_fetch_assoc($result)) //Loop through the results
        {
            $entries[] = $row; //Append them
        }
        
        $userIdField = ($isDraft) ? "lockuid" : "author";
    	if (check_lock($entries[0]['unix_timestamp'], $entries[0][$userIdField])) return NULL;
        
        // Now get the template
        $query = "SELECT * FROM pages WHERE id = $page"; //SQL Statement for getting the template
        $result = mysql_query($query, $con);
        $page = Array();
        while ($row = mysql_fetch_assoc($result)) {
        	$page[] = $row;
        }
        // Add the template data to the entries data
        $entries[0]["template"] = $page[0]["template"];
        
        return $entries[0]; //Return it
    }
    
    //** Function to get a single draft **//
    function get_draft($con, $pageId, $entryId=NULL) {
    	if (!isset($pageId)) return NULL;
    	
    	$query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts WHERE page_id = $pageId AND entry_id ";
    	$query .= ($entryId == NULL) ? "IS NULL" : "= $entryId"; // SQL Statement for getting a draft
    	$result = mysql_query($query, $con);
        $draft = Array();
        while ($row = mysql_fetch_assoc($result)) {
        	$row['locked'] = check_lock($row['unix_timestamp'], $row['author']);
        	$draft[] = $row;
        }
        
        return $draft[0];
    }
    
    //** Function to get all drafts **//
    function get_drafts($con)
    {
    	$query = "SELECT *, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts"; // SQL Statement for getting the drafts
        $result = mysql_query($query, $con);
        $drafts = Array();
        while ($row = mysql_fetch_assoc($result)) {
        	$row['locked'] = check_lock($row['unix_timestamp'], $row['author']);
        	$drafts[] = $row;
        }
        
        return $drafts; // Return them
    }
    
    //** Function to check to see if a draft exists **//
    function draft_exists($con, $pageId, $entryId=NULL)
    {
    	$query = "SELECT 1 AS 'exists' FROM drafts WHERE page_id = $pageId AND entry_id";
    	$query .= ($entryId == NULL) ? " IS NULL" : " = $entryId";
    	$result = mysql_query($query, $con);
    	$drafts = Array();
        while ($row = mysql_fetch_assoc($result)) {
        	$drafts[] = $row;
        }
        if (isset($drafts[0])) { // If there is a draft, return true
        	return true;
        } else { // If there isn't a draft, return false
        	return false;
        }
    }
    
    //**Function to get the changed files **//
    function get_changed($con, $pageId=NULL)
    {
    	// If pageId is NULL, then this function will only get all changed pages (both in the pages table and in the drafts table)
    	// If pageId is not NULL, this function will add those entries into the array as well
    	
    	// Code here to get the last-checked timestamp and current user id
    	$userData = Array("timestamp", "id");
    	$userData = get_user_data($con, $userData);
    	$timestamp = $userData['timestamp'];
    	$currentUserId = $userData['id'];
    	
    	// For now, though...
    	//$timestamp = 0;
    	//$currentUserId = 0;
    	
    	$interval = 60; // Interval for how long a file stays locked even if the author is still not -1
    	
    	// Now find the changed files
    	$query = "SELECT *, id AS pageId, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM pages ";
    	$query .= "HAVING (timestamp > \"$timestamp\" AND author != $currentUserId) ";
    	$query .= "OR (" . time() . " - unix_timestamp > $interval AND author != $currentUserId AND author != -1) ";
    	$query .= "ORDER BY id ASC";
    	$result = mysql_query($query, $con);
    	//print(mysql_error());
    	//echo $query;
    	$files = Array();
    	while ($row = mysql_fetch_assoc($result)) {
    		$row['type'] = "pages";
    		$files[] = $row;
    	}
    	$pagesLength = count($files);
    	if ($pageId != NULL) {
    		// Get the changed entries
			$query = "SELECT *, id AS entryId, page AS pageId, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM entries ";
			$query .= "HAVING page = $pageId AND (timestamp > \"$timestamp\" AND author != $currentUserId) ";
			$query .= "OR (" . time() . " - unix_timestamp > $interval AND author != $currentUserId AND author != -1) ";
			$query .= "ORDER BY page ASC, id ASC";
			$result = NULL;
			$result = mysql_query($query, $con);
			//print(mysql_error());
			while ($row = mysql_fetch_assoc($result)) {
				$row['type'] = "entries";
				$files[] = $row;
			}
			$entriesLength = count($files) - $pagesLength;
			
			// Get the changed entries in the drafts table
			$query = "(SELECT *, page_id AS pageId, entry_id AS entryId, UNIX_TIMESTAMP(timestamp) AS unix_timestamp, 3 AS file_type FROM drafts ";
			$query .= "HAVING page_id = $pageId AND entry_id IS NOT NULL AND (timestamp > \"$timestamp\" AND lockuid != $currentUserId) ";
			$query .= "OR (" . time() . " - unix_timestamp > $interval AND lockuid != $currentUserId AND lockuid != -1) ";
			$query .= "ORDER BY page_id ASC, entry_id ASC)";
			
			$query .= " UNION ";
			// Get the changed pages in the drafts table
			$query .= "(SELECT *, page_id AS pageId, entry_id AS entryId, UNIX_TIMESTAMP(timestamp) AS unix_timestamp, 2 AS file_type FROM drafts ";
			$query .= "HAVING entry_id IS NULL AND (timestamp > \"$timestamp\" AND lockuid != $currentUserId) ";
			$query .= "OR (" . time() . " - unix_timestamp > $interval AND lockuid != $currentUserId AND lockuid != -1) ";
			$query .= "ORDER BY page_id ASC)";
			$query .= " ORDER BY file_type ASC";
			$result = NULL;
			$testFiles = Array();
			$pages = $files;
			$result = mysql_query($query, $con);
			//print(mysql_error());
			while ($row = mysql_fetch_assoc($result)) {
				$row['type'] = "drafts";
				$files[] = $row;
				$testFiles[] = $row;
			}
			//print(mysql_error());
			//array_intersect_uassoc($pages[0], $testFiles[0], "compare_drafts_array");
			//print_r($pages);
			//echo "\n";
			//print_r($testFiles);
		} else {
			// Get the changed draft pages
    		$query = "SELECT *, page_id AS pageId, entry_id AS entryId, UNIX_TIMESTAMP(timestamp) AS unix_timestamp FROM drafts ";
    		$query .= "HAVING entry_id IS NULL AND (timestamp > \"$timestamp\" AND lockuid != $currentUserId) ";
    		$query .= "OR (" . time() . " - unix_timestamp > $interval AND lockuid != $currentUserId AND lockuid != -1) ";
    		$query .= "ORDER BY page_id ASC";
    		$result = NULL;
			$result = mysql_query($query, $con);
			//print(mysql_error());
			while ($row = mysql_fetch_assoc($result)) {
				$row['type'] = "drafts";
				$files[] = $row;
			}
    	}
    	/*$result = mysql_query($query, $con);
    	$files = Array();
    	while ($row = mysql_fetch_assoc($result)) {
    		print_r($row);
    		$userIdField = (isset($row['page_id']) || isset($row['entry_id'])) ? "lockuid" : "author";
    		$row['locked'] = check_lock($row['unix_timestamp'], $row[$userIdField]);
    		unset($row['data']);
    		$files[] = $row;
    	}*/
    	
    	
    	// Sort the whole array by pageId, entryId, and then by if it's a draft, putting the draft version in front of the non-draft version
    	foreach ($files as $key => $row) {
    		$arrayPageId[$key] = $row['pageId'];
    		$arrayEntryId[$key] = $row['entryId'];
    		$arrayDraft[$key] = ($row['type'] == "drafts") ? 0 : 1;
    	}
    	array_multisort($arrayPageId, SORT_ASC, $arrayEntryId, SORT_ASC, $arrayDraft, SORT_ASC, $files);
    	//print_r($files);
    	foreach ($files as $key => &$file) {
    		$userIdField = "";
    		$userIdField = ($file['type'] == "drafts") ? "lockuid" : "author";
    		$file['locked'] = check_lock($file['unix_timestamp'], $file[$userIdField]);
    		unset($file['data']);
    		
    		// Check to see if this file is the draft of the next file; if it is, delete the next file
    		// "current()" actually points to the next file
    		$nextFile = current($files);
    		if (isset($nextFile)
    			&& $nextFile['type'] != "drafts"
    			&& $file['pageId'] == $nextFile['pageId']
    			&& (($nextFile['type'] == "entries" && $file['entryId'] == $nextFile['entryId'])
    				|| $nextFile['type'] == "pages")
    		) {
    			unset($files[$key + 1]);
    		}
    	}
    	//print_r($files);
    	
    	// Reassign the keys
    	$files = array_values($files);
    	
    	// Modify the users table so that the timestamp is updated
    	$userUpdateData = Array();
    	$userUpdateData['id'] = $currentUserId;
    	$userUpdateData['timestamp'] = true;
    	$userUpdateData['type'] = "users";
    	modify_data($con, $userUpdateData);
    	
    	return $files;  // Return them
    }
    
    //** Function to draft an entry **//
    function modify_data($con, $data)
    {
        $table = $data['type'];
        unset($data['type']);
        
        // This checks to see if the page has been locked since the page was opened; it's almost redundant and can probably be deleted
        if ($table == "entries") { // If it's an entry
        	$pageId = $data['page'];
        	$entryId = $data['id'];
        } else if ($table == "pages") { // If it's a page
        	$pageId = $data['id'];
        	$entryId = NULL;
        } else if ($table == "drafts") { // If it's a draft
        	$pageId = $data['page_id'];
        	$entryId = $data['entry_id'];
        } else {
        	$passLockTest = true;
        }
        
		if ($passLockTest && get_lock($con, $table, $pageId, $entryId)) return false; // It's locked so don't modify
        if ($table == "drafts") { // Check the original page or entry
        	$lockTable = ($data['entry_id'] == NULL) ? "pages" : "entries";
        	if (get_lock($con, $lockTable, $pageId, $entryId)) return false; // It's locked so don't modify
        }
        
        if ($table == "drafts" && (!isset($data['entry_id']) || (isset($data['entry_id']) && $data['entry_id'] == -1)) && draft_exists($con, $data['page_id'])) $isUpdateDraft = true;
        
        if (!$isUpdateDraft) {
        	$query = "INSERT INTO $table (";
        } else {
        	$query = "UPDATE $table SET ";
        }
        
        if (!$isUpdateDraft) {
        	$fields = "";
        	$values = "";
			$update = "";
			foreach($data as $field => $value)
			{
				$fields = $fields . $field . ",";
				if(is_numeric($value))
				{
					$values = $values . $value . ",";
					//$update = $update . $field . "=" . $value . ", ";
					if($field != 'id') $update = "$update $field=VALUES($field),";
				}
				else
				{
					if($field != "timestamp") {
						$values = $values . "\"" . $value . "\",";
					} else {
						$values = $values . "CURRENT_TIMESTAMP,";
					}
					//$update = $update . $field . "=\"" . $value . "\", ";
					if($field != 'id') $update = "$update $field=VALUES($field),";
				}
			}
			$fields = substr_replace($fields, "", -1);
			$values = substr_replace($values, "", -1);
			$update = substr_replace($update, "", -1);
			$query = $query . "$fields) VALUES ($values) ON DUPLICATE KEY UPDATE $update;";
		} else {
			$set = "";
			foreach($data as $field => $value)
			{
				if ($field == 'page_id' || $field == 'entry_id') continue;
				
				$set = $set . $field . "=";
				if(is_numeric($value))
				{
					$set = $set . $value . ",";
				}
				else
				{
					if($field != "timestamp") {
						$set = $set . "\"" . $value . "\",";
					} else {
						$set = $set . "CURRENT_TIMESTAMP,";
					}
				}
			}
			$set = substr_replace($set, "", -1);
			$where = "";
			switch ($table) {
				case "pages":
					$where .= "id=" . $data['id'];
					break;
				case "entries":
					$where .= "id=" . $data['id'] . " AND page=" . $data['page'];
					break;
				case "drafts":
					$where .= "page_id=" . $data['page_id'] . " AND entry_id";
					$where .= (!isset($data['entry_id']) || (isset($data['entry_id']) && $data['entry_id'] == NULL)) ? " IS NULL" : "=" . $data['entry_id'];
					break;
			}
			// Make page_id and entry_id more independent (id, page, etc.)
			$query = $query . "$set WHERE $where;";
		}
        //print($query . "\n");
        $result = mysql_query($query, $con);
        $autoIncrementId = mysql_insert_id();
        print(mysql_error());
        
        
         // If you are adding an entry...
        if (isset($data['page']) && !isset($data['id']) && !isset($data['entry'])) {
        	echo $autoIncrementId;
        	// Save the new entry as a draft
        	$data['type'] = "drafts";
        	unset($data['draft']);
        	$data['page_id'] = $data['page'];
        	unset($data['page']);
        	$data['entry_id'] = $autoIncrementId;
        	unset($data['display']);
        	modify_data($con, $data);
        } else if ($table != "drafts" && isset($data['draft']) && $data['draft'] == 0) {
        	// If you are publishing, delete the draft of the page or entry
        	$deleteData['type'] = "drafts";
        	if ($table == "entries") {
        		$deleteData['page_id'] = $data["page"];
        		$deleteData['entry_id'] = $data["id"];
        	} else {
        		$deleteData['page_id'] = $data["id"];
        		$deleteData['entry_id'] = NULL;
        	}
        	delete_data($con, $deleteData);
        }
    }
    
    //** Function to delete an entry or page **//
    function delete_data($con, $data) {
    	$table = $data['type'];
    	unset($data['type']);
    	unset($data['data']);
    	unset($data['name']);
    	
    	// This checks to see if the page has been locked since the page was opened; it's almost redundant and can probably be deleted
    	if ($table == "entries") { // If it's an entry
        	$pageId = $data['page'];
        	$entryId = $data['id'];
        } else if ($table == "pages") { // If it's a page
        	$pageId = $data['id'];
        	$entryId = NULL;
        } else { // If it's a draft
        	$pageId = $data['page_id'];
        	$entryId = $data['entry_id'];
        }
    	if (get_lock($con, $table, $pageId, $entryId)) return false; // It's locked so don't modify
    	
    	$query = "DELETE FROM $table WHERE ";
        $where = "";
        foreach($data as $field => $value) {
            if(is_numeric($value)) {
				if ($value == NULL) {
					$where = $where . "$field IS NULL AND ";
				} else {
					$where = $where . "$field=$value AND ";
				}
            } else {
            	if ($value == NULL) {
            		$where = $where . "$field IS NULL AND ";
            	} else {
					$where = $where . "$field=\"$value\" AND ";
				}
            }
        }
        $where = substr_replace($where, "", -5);
        $query = $query . $where . ";";
        print($query);
		//echo $query . "\n";
        $result = mysql_query($query, $con);
		print(mysql_error());
		
		if ($table == "entries") {
			$data['type'] = "drafts";
			$data['entry_id'] = $data['id'];
			unset($data['id']);
			$data['page_id'] = $data['page'];
			unset($data['page']);
			delete_data($con, $data);
		} else if ($table == "pages") {
			$data['type'] = "drafts";
			$data['entry_id'] = NULL;
			$data['page_id'] = $data['id'];
			unset($data['page']);
			delete_data($con, $data);
		}
    }
    
    //** Function to revert a draft to its published state **//
    function revert_data($con, $data) {
    	$deleteData['type'] = "drafts";
    	$pageId = $deleteData['page_id'] = $data['page_id'];
    	$entryId = $deleteData['entry_id'] = $data['entry_id'];
    	
    	delete_data($con, $deleteData);
		
		// Now change draft to equal 0
		$dataToModify = Array();
		$dataToModify['draft'] = 0;
		if ($entryId == NULL) {
			$dataToModify['type'] = "pages";
			$dataToModify['id'] = $pageId;
		} else {
			$dataToModify['type'] = "entries";
			$dataToModify['id'] = $entryId;
			$dataToModify['page'] = $pageId;
		}
		
		modify_data($con, $dataToModify);
    }
    
?>