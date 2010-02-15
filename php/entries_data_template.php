<?php header("content-type: text/xml") ?>
<entries>
<?php
    foreach($data as $cat)
    {
?>
    <entry>
<?php
    foreach($cat as $key => $value)
    {
        $value = str_replace("<br>", "<br />", $value);
        echo "        <$key>$value</$key>\n";
    }
?>
    </entry>
<?php
    }
?>
</entries>