<?php
	//require_once("MDB2.php");
	function connect()
	{
		include("cfg/sql.php");
		//$con = MDB2::factory($cfg['driver'] . '://' . $cfg['user'] . ':' . $cfg['password'] . '@' . $cfg['host'] . '/' . $cfg['database']) or die($con->getMessage());
		//$con->loadModule('Extended') or die($con->getMessage());
		//global $cfg;
		//echo $cfg;
		//print_r($cfg);
        $con = mysql_connect($cfg['host'], $cfg['username'], $cfg['password']);
        echo mysql_error();
        //echo "<br />^1st<br />";
        //echo $cfg['database'];
        mysql_select_db($cfg['database']);
        echo mysql_error();
        //echo "<br />^2nd<br />";
		$_SESSION['con'] = $con;
		return $con;
	}

	function load($get)
	{
		if(isset($_SESSION['con']) && false)
		{
			$con = $_SESSION['con'];
		}
		else
		{
			$con = connect();
		}
		if(isset($get['e'])) // If an entry
		{
			$isEntry = true;
			$sql = 'SELECT * FROM entries WHERE id=\''. $get['e'] . '\' AND display=\'1\'';
		} else // If a page
		{
			$sql = 'SELECT * FROM pages WHERE id=\''. $get['p'] . '\'';
		}
		//$result = $con->getRow($sql) or die($con->getMessage());
		$result = mysql_query($sql, $con);
		echo mysql_error();
		//$pagedata = new data($result);
		while ($row = mysql_fetch_assoc($result)) {
			$pagedata[] = $row;
		}
		$pagedata = $pagedata[0];
		
		if ($pagedata['data'] != NULL) {
			$data_col = json_decode(base64_decode($pagedata['data']), true); //Data array in the DB is serialized and B64d, so we need to undo it.
			unset($pagedata['data']); //Remove the B64 version
			$pagedata = array_merge($pagedata, $data_col); //Merge the new arrays
		} else {
			unset($pagedata['data']);
		}
		
		// Now get the template if it's an entry
		if (isset($isEntry) && $isEntry) {
			$query = "SELECT template FROM pages WHERE id = " . $pagedata['page']; //SQL Statement for getting the template
			$result = mysql_query($query, $con);
			$page = Array();
			while ($row = mysql_fetch_assoc($result)) {
				$page[] = $row;
			}
			// Add the template data to the entries data
			$pagedata['template'] = $page[0]['template'];
		}
		
		if (isset($pagedata['list']) && $pagedata['list']) {
			// Find what to sort it by first
			$sort = (isset($get['sort'])) ? $get['sort'] : "date_createddesc";
			$pagedata['entriesSort'] = $sort;
			$descSortLength = strlen($sort) - 1 - 4;
			$ascSortLength = strlen($sort) - 1 - 3;
			if ($descSortLength > 0 && stristr(substr($sort, $descSortLength), "desc")) {
				$sort = substr_replace($sort, "", $descSortLength + 1);
				$sortDirection = "DESC";
			} else if ($ascSortLength > 0 && stristr(substr($sort, $ascSortLength), "asc")) {
				$sort = substr_replace($sort, "", $ascSortLength + 1);
				$sortDirection = "ASC";
			} else {
				$sortDirection = "ASC";
			}
			$sql = 'SELECT * FROM entries WHERE page=\'' . $get['p'] . '\' AND display=\'1\' ORDER BY ' . $sort . ' ' . $sortDirection . ', name ASC';
			
			$pagedata['entriesNum'] = mysql_num_rows(mysql_query($sql, $con));
			$pagedata['entriesPages'] = ceil($pagedata['entriesNum']/$get['elimit']);
			$pagedata['entriesStartNum'] = ($get['epage'] - 1) * $get['elimit'];
			$pagedata['entriesLimit'] = $get['elimit'];
			if($pagedata['entriesStartNum'] >= $pagedata['entriesNum']) {
				echo "is greater ";
				$get['epage'] = $pagedata['entriesPages'];
				$pagedata['entriesStartNum'] = ($get['epage'] - 1) * $get['elimit'];
				if ($pagedata['entriesStartNum'] < 0) $pagedata['entriesStartNum'] = 0;
			}
			$pagedata['entriesPage'] = $get['epage'];
			
			// Set the limit based on the page and limit amount
			$sql .= ' LIMIT ' . $pagedata['entriesStartNum'] . ',' . $get['elimit'];
			
			$result = mysql_query($sql, $con);
			echo mysql_error();
			
			while ($row = mysql_fetch_assoc($result)) {
				if ($row['data'] != NULL) {
					$row_col = json_decode(base64_decode($row['data']), true); //Data array in the DB is json encoded and B64d, so we need to undo it.
					unset($row['data']); //Remove the B64 version
					$row = array_merge($row, $row_col); //Merge the new arrays
				} else {
					unset($row['row']);
				}
				$entrydata[] = $row;
			}
			
			if (isset($entrydata)) $pagedata['entries'] = $entrydata;
		}
		
		return $pagedata;
	}

	function search($get)
	{
		//To be written
		return null;
	}

	function disconnect()
	{
		//$con = $_SESSION['con'];
		//$con->disconnect() or die($con->getMessage());
	}
	class data
	{
		public function __construct($data)
		{
			$this->id = $data[0];
			$this->title = $data[1];
			$this->body = $data[2];
			$this->author = $data[3];
		}
		public $id = "";
		public $title = "";
		public $body = "";
		public $author = "";
	};
?>
