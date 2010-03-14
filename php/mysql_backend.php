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
    
    //** Function to get a list of entries **//
    function get_entries($con, $page, $start=NULL, $max=NULL)
    {
        if($start == NULL)
        {
            $query = "SELECT * FROM entries WHERE page='$page'"; //SQL Statement
        }
        else if($max == NULL)
        {
            $query = "SELECT * FROM entries WHERE page='$page' LIMIT $start"; //SQL Statement
        }
        else
        {
            $query = "SELECT * FROM entries WHERE page='$page' LIMIT $start, $max"; //SQL Statement
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
            $query = "SELECT * FROM entries WHERE $field = $value AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        else
        {
            $query = "SELECT * FROM entries WHERE $field = '$value' AND page = '$page' LIMIT 0,1"; //SQL Statement
        }
        $result = mysql_query($query, $con); //Run the Statement
        $entries = Array(); //Create an empty array
        while($row = mysql_fetch_assoc($result)) //Loop through the results
        {
            $entries[] = $row; //Append them
        }
        return $entries[0]; //Return it
    }
    
    //** Function to add an entry **//
    
    //** Function to update an entry **//
    function update_entry($con, $data)
    {
        $table = $data['page'];
        unset($data['page']);
        $id = $data['id'];
        unset($data['id']);
        foreach($data as $field => $value)
        {
            $query = "UPDATE $table SET $field = \"$value\" WHERE id = $id";
            print($query . "\n");
            $result = mysql_query($query, $con);
        }
    }
    
    //** Function to draft an entry **//
    function draft_entry($con, $data)
    {
        $table = $data['page'];
        unset($data['page']);
        $data['pageid'] = $data['id'];
        unset($data['id']);
        $pageid = $data['pageid'];
        
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
                $update = $update . $field . "=" . $value . ", ";
            }
            else
            {
                $values = $values . "\"" . $value . "\",";
                $update = $update . $field . "=\"" . $value . "\", ";
            }
        }
        $fields = substr_replace($fields, "", -1);
        $values = substr_replace($values, "", -1);
        $update = substr_replace($update, "", -2);
        $query = $query . "$fields) VALUES ($values) ON DUPLICATE KEY UPDATE $update";
        print($query . "\n");
        $result = mysql_query($query, $con);
        print(mysql_error());
    }
    
?>