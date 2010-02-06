<?php
    require "mysql_backend.php";
    
    //print_r($_GET);
    if(isset($_GET['id']))
    {
        $con = get_connection();
        $data = get_entry($con, $_GET['cat'], 'id', $_GET['id']);
        include("entry_template.php");
    }
?>