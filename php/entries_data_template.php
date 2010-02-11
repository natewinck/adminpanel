<?xml version="1.0" ?>
<entries>
<?php
    foreach($data as $cat)
    {
?>
    <entry>
        <id><?php echo str_replace("<br>", "<br />", $cat['id']); ?></id>
        <title><?php echo str_replace("<br>", "<br />", $cat['title']); ?></title>
        <author><?php echo str_replace("<br>", "<br />", $cat['author']); ?></author>
        <cat><?php echo str_replace("<br>", "<br />", $_GET['cat']); ?></cat>
    </entry>
<?php
    }
?>
</entries>