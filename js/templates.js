NW.templates = {
	// Add Page
	openTemplatesWindow: function() {
	//$(".NWAddPage").click(function() {
		var isSelected = false;
		$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul").children().each(function() {
			if($(this).hasClass("NWSelected"))
				isSelected = true;
		});
		if(!isSelected)
			$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul li:first").addClass("NWSelected");
		$("div.NWChooseTemplate").animate({
			"top": "0px",
			height: "100%"
		});
		$("div.NWChooseTemplate .NWTemplatesWindow").addClass("NWTemplatesWindowOpen");
	},
	/*
	$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplatesWindowCancel").click(function() {
		NW.templates.closeTemplatesWindow(false);
	});
	
	$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplatesWindowChoose").click(function() {
		NW.templates.closeTemplatesWindow();
	});
	*/
	/*$(window).keydown(function(e) {
		//if(e.which == 13) {
		if ($("div.NWChooseTemplate .NWTemplatesWindow").hasClass("NWTemplatesWindowOpen")) {
			if (e.which == Key.ENTER) {
				NW.templates.closeTemplatesWindow();
				return false;
			} else if (e.which >= Key.LEFT_ARROW && e.which <= Key.DOWN_ARROW) {
				switch (e.which) {
					case Key.LEFT_ARROW:
						var diff = -1;
						break;
					case Key.UP_ARROW:
						var diff = -4;
						break;
					case Key.RIGHT_ARROW:
						var diff = 1;
						break;
					case Key.DOWN_ARROW:
						var diff = 4;
						break;
				}
				
			}
		}
	});*/
	
	// These are pretty self explaining
	moveSelectorLeft: function() {
		NW.templates.moveSelector(-1);
		// I need to pass the keys to the browser too
		return true;
	},
	
	moveSelectorRight: function() {
		NW.templates.moveSelector(1);
		// I need to pass the keys to the browser too
		return true;
	},
	
	moveSelectorUp: function() {
		NW.templates.moveSelector(-4);
		// I need to pass the keys to the browser too
		return true;
	},
	
	moveSelectorDown: function() {
		NW.templates.moveSelector(4);
		// I need to pass the keys to the browser too
		return true;
	},
	
	// Move the yellow selector
	moveSelector: function(diff) {
		var length = $("div.NWChooseTemplate .NWTemplates li").length;
		var i = 1;
		var current = 0;
		$("div.NWChooseTemplate .NWTemplates li").each(function() {
			if($(this).hasClass("NWSelected"))
				current = i;
			i++;
		});
		i = 1;
		$("div.NWChooseTemplate .NWTemplates li").each(function() {
			if(i == current + diff && current + diff >= 1 && current + diff <= length) {
				$("div.NWChooseTemplate .NWTemplates .NWSelected").removeClass("NWSelected");
				$(this).addClass("NWSelected");
			}
			i++;
		});
		
		// This might be needed to avoid some weird artifacts
		//return false;
	},
	
	// Check to make sure the templates window is open
	checkIfOpen: function() {
		if ($("div.NWChooseTemplate .NWTemplatesWindow").hasClass("NWTemplatesWindowOpen")) {
			return true;
		} else {
			return false;
		}
	},
	
	// Click and Get Page
	getSelectedTemplate: function() {
		var selected = "";
		$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul").children().each(function() {
			if($(this).hasClass("NWSelected")) {
				selected = $(this).children(".NWTemplateName").text();
			}
		});
		return selected;
	},
	
	//$("div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul").children().click(function() {
	selectTemplate: function(selected) {
		$(this).parent().children().each(function() {
			if($(this).hasClass("NWSelected"))
				$(this).removeClass("NWSelected");
		});
		$(this).addClass("NWSelected");
	},
	
	// Close Templates Window
	closeTemplatesWindow: function(addFile) {
		// Check to make sure the window is actually open
		if (!NW.templates.checkIfOpen()) return false;
		
		if (addFile != true) (addFile == null) ? addFile = true : addFile = false;
		var selected = NW.templates.getSelectedTemplate();
		$("div.NWChooseTemplate").animate({
			"top": "-460px",
			height: "0%"
		},function() {
			$("div.NWChooseTemplate .NWTemplatesWindow").removeClass("NWTemplatesWindowOpen");
			if (addFile) NW.templates.addFile(selected);
		});
		
		// Let the browser (and other functions) use the key command
		return true;
	},
	
	// Add File to Sidebar
	addFile: function(name) {
		alert(name);
		if ($("div#NWSidebarLeft .NWSites .NWSelected").length > 0) {
			//$("div#NWSidebarLeft .NWSites .NWSelected").each(function() {
			var selected = $("div#NWSidebarLeft .NWSites .NWSelected");
				selected.parent().append("<li title=\"" + name + "\"><div class=\"NWFile\"></div>" + name + "</li>");
				
				// Set up the onclick event
				var row = selected.parent().children(":last")[0];
				row.addEventListener("click", NW.filesystem.select, false);
			//});
			
			
		} else {
			$("div#NWSidebarLeft .NWSites .NWRowCategory:first > ul.NWRows").append("<li title=\"" + name + "\"><div class=\"NWFile\"></div>" + name + "</li>");
			
			// Set up the onclick event
			var row = $("div#NWSidebarLeft .NWSites .NWRowCategory:first > ul.NWRows").children(":last")[0];
			row.addEventListener("click", NW.filesystem.select, false);
		}
	}
};