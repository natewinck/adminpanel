<?php

    include "mysql_backend_config.php";

    //** Connection Function **//
    function get_connection()
    {
        global $config;
        $con = mysql_connect($config['server'], $config['username'], $config['password']);
        mysql_select_db($config['database']);
        return $con;
    }
    
    //** Function to get a list of pages **//
    function get_pages($con)
    {
        $query = "SELECT * FROM pages";
        $result = mysql_query($query, $con); //Run the Statement
        $pages = Array(); //Create an empty array
        echo mysql_error();
        while($page = mysql_fetch_assoc($result)) //Loop through the results
        {
            $pages[] = $page; //Append them
        }
        return $pages; //Return them
    }
    
    //** Function to get a single page **//
    function get_page($con, $page)
    {
    	$draftQuery = "SELECT * FROM drafts WHERE page_id = '$page' AND entry_id = -1"; // SQL Statement for drafts
    	$query = "SELECT * FROM pages WHERE id = '$page'"; // SQL Statement
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
            $query = "SELECT * FROM entries WHERE page='$page' ORDER BY id DESC"; //SQL Statement
        }
        else if($max == NULL)
        {
            $query = "SELECT * FROM entries WHERE page='$page' ORDER BY id DESC LIMIT $start"; //SQL Statement
        }
        else
        {
            $query = "SELECT * FROM entries WHERE page='$page' ORDER BY id DESC LIMIT $start, $max"; //SQL Statement
        }
        //echo $query;
        $result = mysql_query($query, $con); //Run the Statement
        $entries = Array(); //Create an empty array
        echo mysql_error();
        while($row = mysql_fetch_assoc($result)) //Loop through the results
        {
            $entries[] = $row; //Append them
        }
        return $entries; //Return them
    }
    
    //** Function to get a single entry **//
    function get_entry($con, $page, $field, $value)
    {
        if(is_numeric($value))
        {
        	$draftQuery = "SELECT * FROM drafts WHERE entry_id = $value AND page_id = '$page' LIMIT 0,1"; //SQL Statement for drafts
            $query = "SELECT * FROM entries WHERE $field = $value AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        else
        {
        	$draftQuery = "SELECT * FROM drafts WHERE entry_id = '$value' AND page_id = '$page' LIMIT 0,1"; //SQL Statement for drafts
            $query = "SELECT * FROM entries WHERE $field = '$value' AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        $result = mysql_query($draftQuery, $con); // Run the Statement for drafts
        if (mysql_num_rows($result) == 0) {
        	$result = mysql_query($query, $con); //Run the Statement
        }
        $entries = Array(); //Create an empty array
        while($row = mysql_fetch_assoc($result)) //Loop through the results
        {
            $entries[] = $row; //Append them
        }
        
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
    
    //** Function to draft an entry **//
    function modify_data($con, $data)
    {
        $table = $data['type'];
        unset($data['type']);
        
        $query = "INSERT INTO $table (";
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
                $values = $values . "\"" . $value . "\",";
                //$update = $update . $field . "=\"" . $value . "\", ";
				if($field != 'id') $update = "$update $field=VALUES($field),";
            }
        }
        $fields = substr_replace($fields, "", -1);
        $values = substr_replace($values, "", -1);
        $update = substr_replace($update, "", -1);
        $query = $query . "$fields) VALUES ($values) ON DUPLICATE KEY UPDATE $update;";
        //print($query . "\n");
        $result = mysql_query($query, $con);
        $autoIncrementId = mysql_insert_id();
        print(mysql_error());
        
        
         // If you are adding an entry...
        if (isset($data['page']) && !isset($data['id'])) {
        	echo $autoIncrementId;
        	// Save the new entry as a draft
        	$data['type'] = "drafts";
        	unset($data['draft']);
        	$data['page_id'] = $data['page'];
        	unset($data['page']);
        	$data['entry_id'] = $autoIncrementId;
        	unset($data['display']);
        	modify_data($con, $data);
        } else if ($table != "drafts" && $data['draft'] == 0) {
        	// If you are publishing, delete the draft of the page or entry
        	$deleteData['type'] = "drafts";
        	if ($table == "entries") {
        		$deleteData['page_id'] = $data["page"];
        		$deleteData['entry_id'] = $data["id"];
        	} else {
        		$deleteData['page_id'] = $data["id"];
        		$deleteData['entry_id'] = -1;
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
    	
    	$query = "DELETE FROM $table WHERE ";
        $where = "";
        foreach($data as $field => $value) {
            if(is_numeric($value)) {
				$where = $where . "$field=$value AND ";
            } else {
				$where = $where . "$field=\"$value\" AND ";
            }
        }
        $where = substr_replace($where, "", -5);
        $query = $query . $where . ";";
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
			$data['entry_id'] = -1;
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
		if ($entryId == -1) {
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