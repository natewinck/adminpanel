<?php
    require "mysql_backend.php";
    
    //print_r($_GET);
    if(isset($_GET['id']) && is_numeric($_GET['id']) && isset($_GET['cat']))
    {
        $con = get_connection();
        $data = get_entry($con, $_GET['cat'], 'id', $_GET['id']);
        include("entry_template.php");
    }
    else if(isset($_GET['cat']) && isset($_GET['xml']))
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
        include("entries_data_template.php");
    }
    else if(isset($_GET['cat']))
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
    else if(isset($_GET['xml']))
    {
        $con = get_connection();
        $data = get_categories($con);
        include("categories_data_template.php");
    }
    else
    {
        $con = get_connection();
        $data = get_categories($con);
        include("categories_template.php");
    }
?>