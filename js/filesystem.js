NW.filesystem = {
	/**
	 *	Function for selecting a list item
	 *	When selected		adds .NWSelected to item
	 */
	select: function(e, selectedElement) {
		if (NW.filesystem.triangleClick == null) NW.filesystem.triangleClick = false;
		
		(!selectedElement) ? selectedElement = null : selectedElement = $(selectedElement);
		var obj = selectedElement || $(this);
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
		var topParent = obj.parents(".NWSelectable:last");
		var prevSelected = topParent.find(".NWSelected");
		
		// Save the previously selected page then remove the selected class
		if (prevSelected[0]) {
			if (!prevSelected.hasClass("NWRowCategoryHeader") && !prevSelected.hasClass("listEditor")) {
				NW.io.save(prevSelected[0]);
			}
		}
		prevSelected.removeClass("NWSelected");
		
		//$(".NWSites .NWSelected").removeClass("NWSelected");
		obj.addClass("NWSelected");
		
		
		
		if (obj.hasClass("listEditor")) {
			NW.filesystem.showListEditor(obj);
		} else if (!obj.parents("#NWListEditor")[0]) {
			NW.filesystem.hideListEditor();
		}
		
		if (!obj.hasClass("listEditor")) {
			NW.io.open(obj.attr("id"));
		}
	},
	fillListEditor: function(id) {
		// Get list array via ajax
		var listArray = NW.io.getListEntriesArray(id);
		
		if (!listArray) return;
		
		var listEditor = $("#NWListEditorBox > ul")[0];
		var entryElement, entry, divElement, textElement;
		
		// First, clear the list editor so that nothing conflicts
		listEditor.innerHTML = "";
		
		// Loop through the array of entries and append them to the list editor
		for (var i = 0; i < listArray.length; i++) {
			entry = listArray[i];
			entryElement = document.createElement("li");
			entryElement.id = entry["id"];
			entryElement.title = entry["name"];
			if (entry["locked"]) entryElement.className = "NWNonSelectable";
			
			listEditor.appendChild(entryElement);
			
			if (entry["locked"]) {
				divElement = document.createElement("div");
				divElement.className = "NWLocked";
				entryElement.appendChild(divElement);
			} else if (entry["draft"]) {
				divElement = document.createElement("div");
				divElement.className = "NWDraft";
				entryElement.appendChild(divElement);
			} else {
				divElement = document.createElement("div");
				divElement.className = "NWFile";
				entryElement.appendChild(divElement);
			}
			
			textElement = document.createTextNode(entry["name"]);
			entryElement.appendChild(textElement);
			
			// Assign an onclick event so they can be selected
			entryElement.addEventListener("click", NW.filesystem.select, false);
		}
		
		// Select the first element of this list
		var firstEntry = $(listEditor).children(":not(.NWNonSelectable):first")[0];
		NW.filesystem.select(null, firstEntry);
	},
	showListEditor: function(obj) {
		NW.filesystem.fillListEditor(obj[0].id);
		$("#NWListEditor").css("display", "block");
	},
	hideListEditor: function() {
		$("#NWListEditor").css("display", "none");
	},
	addEntry: function() {
		var newEntry = document.createElement("li");
		newEntry.textContent = "Untitled Entry";
		newEntry.id = NW.io.addListEntry(newEntry);
		$("#NWListEditorBox > ul").prepend(newEntry);
		
		var selected = $("#NWListEditorBox > ul > li:first-child")[0];
		selected.addEventListener("click", NW.filesystem.select, false);
		// Select the entry
		NW.filesystem.select(null, selected);
		
		// Code here for actually adding the entry to the database
		
	},
	deleteEntry: function() {
		var selected = $("#NWListEditorBox > ul > li.NWSelected")[0];
		var nextSelectedElement = null;
		if ($(selected).next()[0]) {
			nextSelectedElement = $(selected).next()[0];
		} else if ($(selected).prev()[0]) {
			nextSelectedElement = $(selected).prev()[0];
		};
		
		$(selected).remove();
		if (nextSelectedElement) NW.filesystem.select(null, nextSelectedElement);
		
		// Code here for deleting the entry from the database
		
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
		// Fill in the all the files
		var filesArray = NW.io.getFilesArray();
		if (!filesArray) return;
		
		var file, fileElement, siteElement, divElement, textElement, liElement, ulElement;
		//var site = $(".NWSites .NWRowCategory:first")[0];
		
		// Clear the files
		$(".NWSites")[0].innerHTML = "";
		
		// First put in the site name; this could call a function to figure out what the site name is
		// Code here for figuring out the site name;
		var siteName = "ADA";
		siteElement = document.createElement("li");
		siteElement.title = siteName + " Site";
		siteElement.className = "NWRowCategoryHeader NWSiteName NWNonSelectable";
		$(".NWSites")[0].appendChild(siteElement);
		
		divElement = document.createElement("div");
		divElement.className = "NWOpen";
		siteElement.appendChild(divElement);
		
		divElement = document.createElement("div");
		divElement.className = "NWSiteIcon"
		siteElement.appendChild(divElement);
		
		textElement = document.createTextNode(siteName);
		siteElement.appendChild(textElement);
		
		// Create some lists before starting the "real" list
		liElement = document.createElement("li");
		liElement.className = "NWRowCategory";
		$(".NWSites")[0].appendChild(liElement);
		
		ulElement = document.createElement("ul");
		ulElement.className = "NWRows NWRowsSelectable NWSelectable";
		liElement.appendChild(ulElement);
		
		// Change the site element for easier access for appending elements
		siteElement = ulElement;
		
		// Fill in the files
		for (var i = 0; i < filesArray.length; i++) {
			file = filesArray[i];
			if (file["list"] == false) {
				fileElement = document.createElement("li");
				fileElement.title = file["name"];
				fileElement.id = file["id"];
				if (file["locked"]) fileElement.className = "NWNonSelectable";
				siteElement.appendChild(fileElement);
				
				if (file["locked"]) {
					divElement = document.createElement("div");
					divElement.className = "NWLocked";
					fileElement.appendChild(divElement);
				} else if (file["draft"]) {
					divElement = document.createElement("div");
					divElement.className = "NWDraft";
					fileElement.appendChild(divElement);
				} else {
					divElement = document.createElement("div");
					divElement.className = "NWFile";
					fileElement.appendChild(divElement);
				}
				
				textElement = document.createTextNode(file["name"]);
				fileElement.appendChild(textElement);
			} else {
				// First create the first li element that includes the title and file icon
				fileElement = document.createElement("li");
				fileElement.title = file["name"];
				fileElement.className = "NWRowCategoryHeader NWSiteName";
				fileElement.id = file["id"];
				siteElement.appendChild(fileElement);
				
				divElement = document.createElement("div");
				divElement.className = "NWOpen";
				fileElement.appendChild(divElement);
				
				divElement = document.createElement("div");
				divElement.className = "NWFile";
				fileElement.appendChild(divElement);
				
				textElement = document.createTextNode(file["name"]);
				fileElement.appendChild(textElement);
				
				// Then, create the category li element and the "Entries" li element
				liElement = document.createElement("li");
				liElement.className = "NWRowCategory";
				siteElement.appendChild(liElement);
				
				ulElement = document.createElement("ul");
				ulElement.className = "NWRows NWRowsSelectable NWSelectable";
				liElement.appendChild(ulElement);
				
				fileElement = document.createElement("li");
				fileElement.title = "Entries for " + file["name"];
				fileElement.id = file["id"];
				fileElement.className = "listEditor";
				ulElement.appendChild(fileElement);
				
				divElement = document.createElement("div");
				divElement.className = "NWList";
				fileElement.appendChild(divElement);
				
				textElement = document.createTextNode("Entries");
				fileElement.appendChild(textElement);
			}
		}
		
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