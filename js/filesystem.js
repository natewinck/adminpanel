NW.filesystem = {
	/**
	 *	Function for selecting a list item
	 *	When selected		adds .NWSelected to item
	 */
	select: function() {
		if (NW.filesystem.triangleClick == null) NW.filesystem.triangleClick = false;
		
		var obj = $(this);
		// Rule out the possiblity of other options
		if (
			   obj.hasClass("NWNonSelectable")
			|| obj.hasClass("NWRowCategory")
			|| NW.filesystem.triangleClick
			//|| obj.hasClass("NWOpen")
			//|| obj.hasClass("NWClosed")
		) {
			// Make sure that the current triangle click doesn't keep its hold
			// If I kept this true, I can never click on a row
			NW.filesystem.triangleClick = false;
			return false;
		}
		
		$(".NWSites .NWSelected").removeClass("NWSelected");
		obj.addClass("NWSelected");
		
		NW.io.open(obj.attr("id"), obj.attr("cat"));
	},
	
	//NW.filesystem.triangleClick = false;
	
	//function NWRefreshSidebarLeft() {
	/*$(".NWSelectable > li > .NWOpen").livequery("click",function() {
		$(".NWSelectable li").unbind();
		$(this).toggleClass("NWOpen").parent().next().toggle();
		$(this).toggleClass("NWClosed");*/
		//alert("Hello1");
		/*$(".NWSelectable > li").livequery("click", function() {NW.filesystem.select($(this));*/ /*alert("Hello");*///});
	//});
	
	//$(".NWSelectable li").livequery("click", function() {
	/*
		if(!NW.filesystem.triangleClick)
			NW.filesystem.select($(this));
		//alert(NW.filesystem.triangleClick);
		NW.filesystem.triangleClick = false;
	};*/
	
	// Not sure if to use this one (double click edit)
	// Re-enable once I've re-structured the list for selecting
	/*$(".NWSites .NWSelectable li").livequery("dblclick",function() {
		if( $(this).hasClass("NWNonSelectable") || $(this).hasClass("NWRowCategory") )
			{}
		else {
			$(this).attr("contenteditable", "true");
			$(this).blur(function() {$(this).attr("contenteditable", "false");});
		}
	});
	*/
	
	/*$(".NWRowCategoryHeader div").toggle(function() {
		$(this).removeClass("NWClosed");
		$(this).addClass("NWOpen");
	}, function() {
		$(this).removeClass("NWOpen");
		$(this).addClass("NWClosed");
	});*/
	
	init: function() {
		/* Closes closed triangles and opens opened triangles on load */
		$(".NWRowCategoryHeader div.NWClosed").each(function() {
			$(this).parent().next().hide();
		});
		
		$(".NWRowCategoryHeader div.NWOpen").each(function() {
			$(this).parent().next().show();
		});
	},
	
	/* Everything as before except now on click */
	//$(".NWRowCategoryHeader div.NWClosed").livequery("click",function() {
	expandTriangle: function(obj) {
		/*$(this).removeClass("NWClosed");
		$(this).addClass("NWOpen");*/
		//$(this).toggleClass("NWClosed").parent().next().toggle();
		//$(this).toggleClass("NWOpen");
		obj.removeClass("NWClosed");
		obj.addClass("NWOpen");
		obj.parent().next().show();
		// Make sure to keep this or else the row will be selected
		NW.filesystem.triangleClick = true;
	},
	
	//$(".NWRowCategoryHeader div.NWOpen").livequery("click",function() {
	collapseTriangle: function(obj) {
		obj.removeClass("NWOpen");
		obj.addClass("NWClosed");
		obj.parent().next().hide();
		// Make sure to keep this or else the row will be selected
		NW.filesystem.triangleClick = true;
	},
	
	triangleSwitch: function() {
		if ($(this).hasClass("NWOpen")) {
			NW.filesystem.collapseTriangle($(this));
			return true;
		}
		if ($(this).hasClass("NWClosed")) {
			NW.filesystem.expandTriangle($(this));
			return true;
		}
	}
	
	/* Not sure about this one (sortable files) */
	/*$("#NWSidebarLeft .NWSites .NWRows").sortable({
		helper: 'clone',
		distance: 5
	});
	$("#NWSidebarLeft .NWSites .NWRows").disableSelection(); */
};