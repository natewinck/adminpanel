<?php header("content-type: text/xml"); ?>
<categories>
<?php
    foreach($data as $cat)
    {
?>
    <category>
<?php
    foreach($cat as $key => $value)
    {
        echo "        <$key>$value</$key>\n";
    }
?>
    </category>
<?php
    }
?>
</categories>