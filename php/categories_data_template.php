<?php 
    $string = "<categories>\n";
    
    foreach($data as $cat)
    {

        $string = $string . "\t<category>\n";

        foreach($cat as $key => $value)
        {
            $string = $string . "\t\t<$key>$value</$key>\n";
        }


        $string = $string . "\t</category>\n";

    }
    $string = $string . "</categories>\n";
    $len = strlen($string);
    header("content-type: text/xml");
    header("content-length: $len");
    echo $string;
?>