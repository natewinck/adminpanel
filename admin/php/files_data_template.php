<?php header("content-type: text/xml") ?>
<files>
<?php
    foreach($data as $cat)
    {
?>
    <file>
<?php
    foreach($cat as $key => $value)
    {
        $value = str_replace("<br>", "<br />", $value);
        echo "        <$key>$value</$key>\n";
    }
?>
    </file>
<?php
    }
?>
</files>