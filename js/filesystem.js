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
			if (!prevSelected.hasClass("NWRowCategoryHeader")
				&& !prevSelected.hasClass("listEditor")
				&& !prevSelected.children(".NWFile")[0]
				&& prevSelected.hasClass("NWUnsaved")
			) {
				NW.io.save(prevSelected[0], false);
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
			// Parse the id into id and cat
			var file = NW.filesystem.parseId(obj.attr("id"));
			
			NW.io.open(file.cat, file.id);
		}
	},
	createId: function(cat, id) {
		if (id == null) id = "";
		if (cat == null) cat = "";
		var objId = "id=" + id + "&cat=" + cat;
		return objId;
	},
	parseId: function(objId) {
		if (!objId) return false;
		
		var idStartPos = objId.indexOf("id=") + 3;
		var idEndPos = (objId.indexOf("&") != -1) ? objId.indexOf("&") : objId.length;
		// Assuming the id is a number, use the parseInt() function
		var id = parseInt(objId.substring(idStartPos, idEndPos));
		objId = objId.replace(objId.substring(idStartPos - 3, idEndPos + 1), "");
		
		var catStartPos = objId.indexOf("cat=") + 4
		var catEndPos = (objId.indexOf("&") != -1) ? objId.indexOf("&") : objId.length;
		var cat = objId.substring(catStartPos, catEndPos);
		objId = objId.replace(objId.substring(catStartPos - 4, catEndPos + 1), "");
		
		return {id: id, cat: cat};
	},
	getSelected: function() {
		var selected;
		if ($("#NWListEditor").css("display") == "none") {
			// Get the selected file in the sidebar
			selected = $(".NWSites .NWSelected")[0];
		} else {
			// Get the selected entry in the list editor
			selected = $("#NWListEditor .NWSelected")[0];
		}
		
		return selected;
	},
	getDrafts: function() {
		var draftsArray = [];
		var i = 0;
		$(".NWSites > .NWRowCategory > .NWRows > li").each(function() {
			if ($(this).children(".NWDraft")[0]) {
				draftsArray[i] = $(this)[0];
				i++;
			}
		});
		
		return draftsArray;
	},
	getEntriesHeaders: function() {
		var entriesHeadersArray = [];
		var i = 0;
		$(".NWSites > .NWRowCategory > .NWRows li").each(function() {
			if ($(this).hasClass("listEditor")) {
				entriesHeadersArray[i] = $(this)[0];
				i++;
			}
		});
		
		return entriesHeadersArray;
	},
	restoreFileAppearance: function(obj) {
		var obj = obj || NW.filesystem.getSelected();
		if (!obj) return false;
		if ($(obj).hasClass("NWRowCategoryHeader")) return false;
		
		$(obj).removeClass("NWUnsaved").children("div").removeClass().addClass("NWFile");
	},
	lock: function(id) {
		$("#" + id).addClass("NWNonSelectable").children("div:first").removeClass().addClass("NWLocked");
		if ($("#" + id).hasClass("NWSelected")) {
			$("#" + id).removeClass("NWSelected");
			NW.io.close();
		}
	},
	unlock: function(id, isDraft) {
		var className = (isDraft) ? "NWDraft" : "NWFile";
		$("#" + id).removeClass("NWNonSelectable").children("div:first").removeClass().addClass(className);
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
			entryElement.id = NW.filesystem.createId(entry["cat"], entry["id"]);
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
		if (!obj) return false;
		var objId = NW.filesystem.parseId(obj[0].id);
		NW.filesystem.fillListEditor(objId.cat);
		$("#NWListEditor").css("display", "block");
	},
	hideListEditor: function() {
		$("#NWListEditor").css("display", "none");
	},
	addEntry: function() {
		var newEntry = document.createElement("li");
		newEntry.id = NW.io.addListEntry(newEntry);
		$("#NWListEditorBox > ul").prepend(newEntry);
		
		var divElement = document.createElement("div");
		divElement.className = "NWDraft";
		newEntry.appendChild(divElement);
		
		var textElement = document.createTextNode("Untitled Entry");
		newEntry.appendChild(textElement);
		
		var selected = $("#NWListEditorBox > ul > li:first-child")[0];
		selected.addEventListener("click", NW.filesystem.select, false);
		// Select the entry
		NW.filesystem.select(null, selected);
		
		// Code here for actually adding the entry to the database
		
	},
	confirmDeleteEntry: function() {
		if (!$("#NWListEditorBox > ul > li.NWSelected")[0]) return false;
		NW.editor.functions.openConfirmWindow("Are you sure you want to delete this entry?", "This action cannot be undone.", NW.filesystem.deleteEntry);
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
			if (!file["list"]) {
				fileElement = document.createElement("li");
				fileElement.title = file["name"];
				fileElement.id = NW.filesystem.createId(file["cat"], file["id"]);
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
				fileElement.className = "NWRowCategoryHeader";
				//fileElement.id = file["headerId"];		// Bring back if we want to load the overall entries page
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
				fileElement.id = NW.filesystem.createId(file["cat"], file["id"]);
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