<?php
    require "mysql_backend.php";
    
    //print_r($_GET);
    if(isset($_GET['data']) && isset($_GET['id']) && $_GET['cat'] != "drafts")
    {
        $data = unserialize(urldecode(stripslashes($_GET['data'])));
        $data['id'] = $_GET['id'];
        $data['cat'] = $_GET['cat'];
        print_r($data);
        $con = get_connection();
        update_entry($con, $data);
    }
    else if(isset($_GET['data']) && isset($_GET['id']))
    {
        
        $data = unserialize(urldecode(stripslashes($_GET['data'])));
        $data['id'] = $_GET['id'];
        $data['cat'] = $_GET['cat'];
        print_r($data);
        $con = get_connection();
        draft_entry($con, $data);
    }
?>