<?php 
    $string = "<pages>\n";
    
    foreach($data as $cat)
    {

        $string = $string . "\t<page>\n";

        foreach($cat as $key => $value)
        {
            $string = $string . "\t\t<$key>$value</$key>\n";
        }


        $string = $string . "\t</page>\n";

    }
    $string = $string . "</pages>\n";
    $len = strlen($string);
    header("content-type: text/xml");
    header("content-length: $len");
    echo $string;
?>