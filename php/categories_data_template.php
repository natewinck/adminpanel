<?xml version="1.0" ?>
<categories>
<?php
    foreach($data as $cat)
    {
?>
    <category>
        <id><?php echo $cat['id']; ?></id>
        <cat><?php echo $cat['table']; ?></cat>
        <title><?php echo $cat['name']; ?></title>
    </category>
<?php
    }
?>
</categories>