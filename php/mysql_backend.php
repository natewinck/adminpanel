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
    
    //** Function to get a list of categories **//
    function get_categories($con)
    {
        $query = "SELECT * FROM categories";
        $result = mysql_query($query, $con); //Run the Statement
        $cats = Array(); //Create an empty array
        echo mysql_error();
        while($cat = mysql_fetch_assoc($result)) //Loop through the results
        {
            $cats[] = $cat; //Append them
        }
        return $cats; //Return them
    }
    
    //** Function to get a list of entries **//
    function get_entries($con, $table, $start=NULL, $max=NULL)
    {
        if($start == NULL)
        {
            $query = "SELECT * FROM $table"; //SQL Statement
        }
        else if($max == NULL)
        {
            $query = "SELECT * FROM $table LIMIT $start"; //SQL Statement
        }
        else
        {
            $query = "SELECT * FROM $table LIMIT $start, $max"; //SQL Statement
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
    function get_entry($con, $table, $field, $value)
    {
        $query = "SELECT * FROM $table WHERE $field = $value LIMIT 0,1"; //SQL Statement
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
        $table = $data['cat'];
        unset($data['cat']);
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
        $table = $data['cat'];
        unset($data['cat']);
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