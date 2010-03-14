<?php
    require "mysql_backend.php";
    
    //print_r($_GET);
    if(isset($_GET['id']) && is_numeric($_GET['id']) && isset($_GET['cat'])) //Get a single Entry
    {
        $con = get_connection(); 
        $data = get_entry($con, $_GET['cat'], 'id', $_GET['id']);
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
        include("entry_template.php");
    }
    else if(isset($_GET['cat']) && isset($_GET['xml'])) //Get list of entries in XML form
    {
        $con = get_connection();
        if(isset($_GET['start']) && isset($_GET['max']))
        {
            $data = get_entries($con, $_GET['cat'], $_GET['start'], $_GET['max']);
        }
        else if(isset($_GET['start']))
        {
            $data = get_entries($con, $_GET['cat'], $_GET['start']);
        }
        else
        {
            $data = get_entries($con, $_GET['cat']);
        }
        foreach($data as $row)
        {
			if($row['data'] != NULL)
			{
				$data_col = unserialize(base64_decode($row['data'])); //Data array in the DB is serialized and B64d, so we need to undo it.
				unset($row['data']); //Remove the B64 version
				$data = array_merge($row, $data_col); //Merge the new arrays
			}
			else
			{
				unset($row['data']);
			}
        }
        include("entries_data_template.php");
    }
    else if(isset($_GET['cat'])) //Get a list of entries
    {
        $con = get_connection();
        if(isset($_GET['start']) && isset($_GET['max']))
        {
            $data = get_entries($con, $_GET['cat'], $_GET['start'], $_GET['max']);
        }
        else if(isset($_GET['start']))
        {
            $data = get_entries($con, $_GET['cat'], $_GET['start']);
        }
        else
        {
            $data = get_entries($con, $_GET['cat']);
        }
        //include("entries_template.php");
    }
    else if(isset($_GET['xml'])) //Get a list of pages in XML form
    {
        $con = get_connection();
        $data = get_pages($con);
        include("pages_data_template.php");
    }
    else //Get a list of pages
    {
        $con = get_connection();
        $data = get_pages($con);
        include("pages_template.php");
    }
?>