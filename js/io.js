NW.io = {
	getFilesArray: function() {
		// Code here for getting the array of all the files
		var filesXML = null;
        var filesArray = new Array();

        var ajax = null;
        if(window.XMLHttpRequest)
        {
            ajax = new XMLHttpRequest();
        }
        else
        {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if(ajax != null)
        {
        	ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                    //files = ajax.responseXML; //NOT WORKING
                    //console.log("test");
                }
            }
            ajax.open("GET", "./php/loader.php?xml=true", false);
            ajax.send(null);
            
            // For some reason, on my computer, it loads so fast in Firefox that the readyState never changes!
            // Strangely, though, it loads fine (normally) in Safari
            // So (hopefully just for now)....
            if(ajax.readyState==4){
				files = ajax.responseXML; //NOT WORKING
				//console.log(ajax.responseXML);
			}
			
            /*console.log(ajax.responseText);
            filesText = ajax.responseText;
            filesXML = ajax.responseXML;
            console.log(filesXML);
			//var parser = new DOMParser();
			var files = parser.parseFromString(filesText, "text/xml");*/
			/*console.log(filesXML);
			files = filesXML;
			for(var i = 0; i < files.getElementsByTagName("category").length; i++) {
				var file = new Array();
				file['cat'] = files.getElementsByTagName("category")[i].getElementsByTagName('cat')[0].childNodes[0].nodeValue;
				file['name'] = files.getElementsByTagName("category")[i].getElementsByTagName('name')[0].childNodes[0].nodeValue;
				file['list'] = true;
				filesArray.push(file);
			}
        	console.log(filesArray);*/
            //console.log("sending");
        }
        /*filesXML = ajax.responseText;
        var parser = new DOMParser();
        var files = parser.parseFromString(filesXML, "text/xml");*/
        //console.log(files);
        /*for(var i = 0; i < files.getElementsByTagName('name').length; i++)
        {
            var file = new Array();
            file['list'] = parseInt(files.getElementsByTagName('list')[i].childNodes[0].nodeValue);
            file['id'] = parseInt(files.getElementsByTagName('id')[i].childNodes[0].nodeValue);
            file['name'] = files.getElementsByTagName('name')[i].childNodes[0].nodeValue;
            file['draft'] = parseInt(files.getElementsByTagName('draft')[i].childNodes[0].nodeValue);
            file['locked'] = parseInt(files.getElementsByTagName('locked')[i].childNodes[0].nodeValue);
            filesArray.push(file);
        }*/
        
        for (var i = 0; i < files.getElementsByTagName("page").length; i++) {
        	var xmlFile = $(files.getElementsByTagName("page")[i]);
            var file = new Array();
            file["list"] = parseInt(xmlFile.children("list").text());
            file["id"] = parseInt(xmlFile.children("id").text());
            file["name"] = xmlFile.children("name").text();
            file["draft"] = parseInt(xmlFile.children("draft").text());
            file["locked"] = parseInt(xmlFile.children("locked").text());
            filesArray.push(file);
        }
		return filesArray;
	},
	openLastOpenFile: function() {
		// Eventually put code in here that will detect which file was last open
		// This could open multiple pages and store them in the background (maybe)
		
		// For now, just open the malloc news file
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/malloc/news/");
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/marysutherland/Mary Sutherland/Welcome.html");
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/marysutherland/Mary%20Sutherland/Updates/77A1D142-8FD9-489B-BC1F-7048A0A3EB2D.html");
		var lastOpenFile = {
			pageId: "1",
			entryId: "1",
			list: true,
			locked: false
		};
		
		if (lastOpenFile.locked) return false;
		
		if (lastOpenFile.list) var isEntry = true; // Variable for if the last opened file was inside the list editor
		
		if (isEntry) {
			// Code here for opening the list editor, filling it, then selecting the correct entry
			// Not sure what everything needs to be; these are all guesses and are temporary
			var entryButton = document.getElementById(
									NW.filesystem.createId(lastOpenFile.pageId, null, true)
							);
			NW.filesystem.select(null, entryButton);
			//NW.filesystem.showListEditor($(entryButton));
			
			var openedEntry = document.getElementById(NW.filesystem.createId(lastOpenFile.pageId, lastOpenFile.entryId));
			if (openedEntry) NW.filesystem.select(null, openedEntry);
		} else {
			var openedPage = document.getElementById(NW.filesystem.createId(lastOpenFile.pageId));
			if (openedPage) NW.filesystem.select(null, openedPage);
		}
	},
	open: function(pageId, entryId) {
		if (pageId == null) return false;
        //Gets an entry from the backend.
        //id is always an integer, cat is a string
        //IF id is left off then it gets multiple entries.
        //console.log(id);
		
		// Close the current page
		NW.io.close();
        
        if (entryId != null) {
        	// Load an entry
            document.getElementById("NWEditPage").src = './php/loader.php?pageId=' + pageId + '&entryId=' + entryId;
        } else {
        	// Load a page
            document.getElementById("NWEditPage").src = './php/loader.php?pageId=' + pageId;
        }
		
		
		// BRING BACK console.log("File Opened");
		// To prevent caching of the iframe, I found that setting the id to something else like "new Date().getTime()
		// will prevent this caching
	},
	openDialog: function() {
		var test = prompt("Enter a URL:");
		if (test != null && test != "") NW.io.open(test);
	},
	close: function() {
		// This may need to be more specific eventually
		document.getElementById("NWEditPage").src = "";
		NWEditPage = null;
	},
	getListEntriesArray: function(pageId) {
		// Code here for getting the array of all the entries
		// Code here for getting the array of all the files
		var filesXML = null;
        var filesArray = new Array();

        var ajax = null;
        if(window.XMLHttpRequest)
        {
            ajax = new XMLHttpRequest();
        }
        else
        {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if(ajax != null)
        {
            ajax.open("GET", "./php/loader.php?xml=true&pageId=" + pageId, false); //DAVID: &pageId could be anything; I just thought that was very self explanatory
            ajax.send(null);
            /* ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                    filesXML = ajax.responseText; //NOT WORKING
                    //console.log(ajax.responseText);
                }
            }*/
        }
        files = ajax.responseXML;
        //var parser = new DOMParser();
        //var files = parser.parseFromString(filesXML, "text/xml");
        //console.log(files.documentElement.children[0]); 
        /*for(var i = 0; i < files.getElementsByTagName('id').length; i++)
        {
            var file = new Array();
            file['id'] = files.getElementsByTagName('id')[i].childNodes[0].nodeValue;
            file['pageId'] = files.getElementsByTagName('page')[i].childNodes[0].nodeValue;
            file['name'] = (files.getElementsByTagName('name')[i].childNodes[0]) ? files.getElementsByTagName('name')[i].childNodes[0].nodeValue : "";
            file['author'] = files.getElementsByTagName('author')[i].childNodes[0].nodeValue;
            file['draft'] = parseInt(files.getElementsByTagName('draft')[i].childNodes[0].nodeValue);
            file['locked'] = parseInt(files.getElementsByTagName('locked')[i].childNodes[0].nodeValue);
            filesArray.push(file);
        }*/
        
        for (var i = 0; i < files.getElementsByTagName("entry").length; i++) {
        	var xmlFile = $(files.getElementsByTagName("entry")[i]);
            var file = new Array();
            file["id"] = parseInt(xmlFile.children("id").text());
            file["pageId"] = parseInt(xmlFile.children("page").text());
            file["name"] = xmlFile.children("name").text();
            file["author"] = xmlFile.children("author").text();
            file["draft"] = parseInt(xmlFile.children("draft").text());
            file["locked"] = parseInt(xmlFile.children("locked").text());
            filesArray.push(file);
        }
		return filesArray;
	},
	addListEntry: function(obj) {
		// Code here for getting the id for the list item via ajax
		// I'm not sure if this part needs to be done the instant you hit "Add Entry", which is what it's doing right now
		// It could probably be done when the user hits the save button
		// For now, though...
		var selectedEntriesRow = $("#NWSidebarLeft .NWSelected.listEditor");
		if (!selectedEntriesRow[0]) return null;
		
		var parsedId = NW.filesystem.parseId(selectedEntriesRow[0].id);
		var pageId = parsedId.pageId;
		if (pageId == null) return null;
		
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
            // Get the data
            //var data = NW.editor.functions.getFieldsDataArray();
            // Serialize it for php
            //var dstring = escape(NW.io.serialize_data(data));
            
            // Create the data
            var data = [];
            data["name"] = "Untitled Entry";
            // Serialize it for php
            var dstring = escape(NW.io.serialize_data(data));
            
            var postData = "data=" + dstring + "&page=" + pageId + "&add=true";
            ajax.open("POST", "./php/saver.php", false);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
		}
		if (ajax.readyState == 4) {
			var entryId = ajax.responseText;
		}
		if (entryId == null || entryId == "") return null;
		entryId = parseInt(entryId);
		if (isNaN(entryId)) return null;
		
		var id = NW.filesystem.createId(pageId, entryId);
		return id;
	},
	deleteListEntry: function(obj) {
		if (!obj) return false;
		var parsedId = NW.filesystem.parseId(obj.id);
		if (parsedId.pageId == null || parsedId.entryId == null) return false;
		
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
		if (ajax != null) {
			var postData = "data=0" + "&page=" + parsedId.pageId + "&entry=" + parsedId.entryId + "&delete=true";
			ajax.open("POST", "./php/saver.php", true);
			ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
		}
	},
	getChangedFiles: function(synchronous) {
		var synchronous = (synchronous == null) ? true : synchronous;
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
        	// Make a page string so that the script can check only the files that are visible
        	// Thus, if the list editor is not even open, then the php side doesn't have to check any of the entries
        	// But, if the list editor is open, the php side only has to check the specific page id
			var pageString = "";
			if ($("#NWListEditor").css("display") != "none") {
				var selectedEntriesRow = $("#NWSidebarLeft .NWSelected.listEditor");
				if (selectedEntriesRow[0]) {
					var parsedId = NW.filesystem.parseId(selectedEntriesRow[0].id);
					var pageId = parsedId.pageId;
					if (pageId != null) pageString = "&pageId=" + pageId;
				}
			}
			
			ajax.open("GET", "./php/loader.php?changed=true" + pageString, synchronous);
            ajax.send(null);
            var readyFunction = function(e, ajax) {
				var ajax = (e == null) ? ajax : e.target;
                if(ajax.readyState == 4) {
                	// Change the files to show that they are either now locked or unlocked
                	var files = ajax.responseXML;
                	var filesArray = [];
                	for (var i = 0; i < files.getElementsByTagName("file").length; i++) {
						var xmlFile = $(files.getElementsByTagName("file")[i]);
						var file = new Array();
						file["name"] = xmlFile.children("name").text();
						file["locked"] = parseInt(xmlFile.children("locked").text());
						if (xmlFile.children("page")[0]) { // If this file is an entry
							file["entryId"] = parseInt(xmlFile.children("id").text());
							file["pageId"] = parseInt(xmlFile.children("page").text());
							file["draft"] = parseInt(xmlFile.children("draft").text());
							file["type"] = "entries";
						} else if (xmlFile.children("entry_id")[0] || xmlFile.children("page_id")[0]) { // If this file is a draft
							file["entryId"] = (parseInt(xmlFile.children("entry_id").text()) == -1) ? null : parseInt(xmlFile.children("entry_id").text());
							file["pageId"] = parseInt(xmlFile.children("page_id").text());
							file["draft"] = true;
							file["type"] = (parseInt(xmlFile.children("entry_id").text()) == -1) ? "pages" : "entries";
						} else { // If this file is a page
							file["pageId"] = parseInt(xmlFile.children("id").text());
							file["draft"] = parseInt(xmlFile.children("draft").text());
							file["type"] = "pages";
						}
						
						filesArray.push(file);
					}
					
					for (var i = 0; i < filesArray.length; i++) {
						var file = filesArray[i];
						var objId = NW.filesystem.createId(file.pageId, file.entryId);
						var obj = document.getElementById(objId);
						if (!obj) continue;
						NW.filesystem.updateFileData(obj, file);
					}
                }
            }
            ajax.onreadystatechange = readyFunction;
            if (!synchronous) {
            	readyFunction(null, ajax);
            }
        }
	},
	lock: function(obj, synchronous) {
		var synchronous = (synchronous == null) ? true : synchronous;
		// Find the selected object
		if (obj && obj.target) obj = null;
		var selected = obj || null;
		if (!selected) {
			selected = NW.filesystem.getSelected();
		}
		if (!selected) return false;
		var file = NW.filesystem.parseId(selected.id);
		
		// Code for locking
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
			var entryString = "";
			if (file.entryId) entryString = "&entry=" + file.entryId;
			
			var postData = "data=0&page=" + file.pageId + entryString + "&lock=true";
            ajax.open("POST", "./php/saver.php", synchronous);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            ajax.onreadystatechange = function(e) {
				var ajax = e.target;
                if(ajax.readyState==4) {
                	// The lock worked
                	NW.io.getChangedFiles();
                }
            }
            
            if (!synchronous) {
            	NW.io.getChangedFiles();
            }
        }
	},
	unlock: function(obj, synchronous) {
		if (!obj) return false;
		var synchronous = (synchronous == null) ? true : synchronous;
		
		var file = NW.filesystem.parseId(obj.id);
		
		// Code for unlocking
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
			var entryString = "";
			if (file.entryId) entryString = "&entry=" + file.entryId;
			
			var postData = "data=0&page=" + file.pageId + entryString + "&unlock=true";
            ajax.open("POST", "./php/saver.php", synchronous);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            ajax.onreadystatechange = function(e) {
				var ajax = e.target;
                if(ajax.readyState==4) {
                	// The unlock worked
                	NW.io.getChangedFiles();
                }
            }
            
            if (!synchronous) {
            	NW.io.getChangedFiles();
            }
        }
	},
	save: function(obj, useLoadingWindow, synchronous) {
		// Find the selected object
		if (obj && obj.target) obj = null;
		var synchronous = (synchronous == null) ? true : synchronous;
		var selected = obj || null;
		if (!selected) {
			selected = NW.filesystem.getSelected();
		}
		
		//if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		if (!$(selected).hasClass("NWUnsaved")) selected = null;
		
		if (!selected) return false;
		
		var file = NW.filesystem.parseId(selected.id);
		
		if (useLoadingWindow == null) useLoadingWindow = true;
		if (useLoadingWindow) NW.editor.functions.openLoadingWindow("Saving Page as a Draft...");
		
		// Code for saving
		var ajax = null;
        if(window.XMLHttpRequest)
        {
            ajax = new XMLHttpRequest();
        }
        else
        {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if(ajax != null)
        {
            /*var elements = NWEditPage.document.getElementsByClassName("NWEditable");
            var data = new Array();
            for(var i = 0; i < elements.length; i++)
            {
                data[elements[i].id] = elements[i].innerHTML;
            }*/
            // Get the data
            var data = NW.editor.functions.getFieldsDataArray();
            // Serialize it for php
            var dstring = escape(NW.io.serialize_data(data));
            //console.log(file);
            //console.log("./php/saver.php?data=" + dstring + "&id=" + file.id);
			
			var entryString = "";
			if (file.entryId) entryString = "&entry=" + file.entryId;
			
			var postData = "data=" + dstring + "&page=" + file.pageId + entryString + "&draft=true";
            ajax.open("POST", "./php/saver.php", synchronous);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            var readyFunction = function(e, selected, data)
            {
				var ajax = (e.readyState) ? e : e.target;
                if(ajax.readyState==4) {
					// When done saving, close the loading window
					$(selected).removeClass("NWUnsaved");
					NW.filesystem.updateFileData(selected, {
						name: data.name
					});
					NW.io.getChangedFiles(synchronous);
					if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
					
                    //console.log(ajax.responseText);
                }
            };
            ajax.onreadystatechange = function(e) {readyFunction(e, selected, data);};
        }
        
        if (!synchronous && ajax.readyState == 4) {
        	readyFunction(ajax, selected, data);
        }
		
		// When done saving, close the loading window
		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
	},
	revert: function(useLoadingWindow) {
		if (useLoadingWindow) NW.editor.functions.openLoadingWindow("Reverting...");
		var selected = NW.filesystem.getSelected() || null;
		//if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		if ($(selected).children(".NWFile")[0]) selected = null;
		
		if (!selected) return false;
		
		var file = NW.filesystem.parseId(selected.id);
		
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
            var entryString = "";
			if (file.entryId) entryString = "&entry=" + file.entryId;
            
            var postData = "data=1&page=" + file.pageId + entryString + "&revert=true";
            ajax.open("POST", "./php/saver.php", true);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            ajax.onreadystatechange=function(e)
            {
				var ajax = e.target;
                if(ajax.readyState==4) {
					// When done saving, close the loading window
					NW.io.open(file.pageId, file.entryId);
					NW.io.unlock(selected, false);
					NW.io.getChangedFiles(false);
					NW.io.lock(false);
					if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
                    //console.log(ajax.responseText);
                }
            }
        } else {
        	if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
        }
		
		NW.filesystem.restoreFileAppearance();
		
		// Code here for reverting the page to the public state
		
	},
	publishPage: function(objId, useLoadingWindow) {
		// Code for publishing
		// The difference between this and save is that save just saves the current state of the page...
		// Publish actually puts the page out onto the web to viewed
		if (!objId) {
			var selected = NW.filesystem.getSelected() || null;
			//if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
			
			if (!selected) return false;
			
			var file = NW.filesystem.parseId(selected.id);
			var pageId = file.pageId;
			var entryId = file.entryId;
		} else {
			var file = NW.filesystem.parseId(objId);
			var pageId = file.pageId;
			var entryId = file.entryId;
		}
		
		var useLoadingWindow = (useLoadingWindow == false) ? useLoadingWindow : true;
		if (useLoadingWindow) NW.editor.functions.openLoadingWindow("Publishing Page...");
		
		var ajax = null;
        if(window.XMLHttpRequest)
        {
            ajax = new XMLHttpRequest();
        }
        else
        {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if(ajax != null)
        {
            /*var elements = NWEditPage.document.getElementsByClassName("NWEditable");
            var data = new Array();
            for(var i = 0; i < elements.length; i++)
            {
                data[elements[i].id] = elements[i].innerHTML;
            }
            var dstring = escape(NW.io.serialize_data(data));*/
            
            // Get the data
            var data = NW.editor.functions.getFieldsDataArray();
            // Serialize it for php
            var dstring = escape(NW.io.serialize_data(data));
            
            //console.log("./php/saver.php?data=" + dstring + "&id=" + id);
            // DAVID: I believe there is a mistake here: you have the cat=drafts. Shouldn't it be cat=public or whatever you're calling it?
           
			
			var entryString = "";
			if (file.entryId) entryString = "&entry=" + file.entryId;
			
            var postData = "data=" + dstring + "&page=" + pageId + entryString;
            ajax.open("POST", "./php/saver.php", true);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            ajax.onreadystatechange=function(e)
            {
				var ajax = e.target;
                if(ajax.readyState==4){
                	// Check to see if this is publishing all the drafts
                	// If so, close the loading window only after the last page
                	/*if (NW.filesystem.lastPage) {
                		if (NW.filesystem.lastPage.id == (objId || selected.id)) {
                			NW.editor.functions.closeLoadingWindow();
                			NW.filesystem.lastPage = null;
                		}
                	}*/
                	if (NW.filesystem.allDraftsForPublish) {
                		var draft;
                		for (var draftArrayIndex in NW.filesystem.allDraftsForPublish) {
                			draft = NW.filesystem.allDraftsForPublish[draftArrayIndex];
                			if (draft.id == objId) {
                				if (document.getElementById(draft.id)) {
                					// Use the if statement just in case this id is of a hidden (and thus unloaded) list editor draft
                					NW.filesystem.restoreFileAppearance(document.getElementById(draft.id));
                				}
                				NW.filesystem.allDraftsForPublish.splice(draftArrayIndex, 1);
                			}
                		}
                		
                		// When all of the drafts have been published, close the loading window
                		if (NW.filesystem.allDraftsForPublish.length == 0) {
                			NW.editor.functions.closeLoadingWindow();
                			NW.filesystem.allDraftsForPublish = null;
                		}
                	} else {
						// When done publishing, close the loading window and restore appearance
						NW.filesystem.restoreFileAppearance();
						if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
						NW.filesystem.updateFileData(null, {
							name: data.name
						});
                	}
                    //console.log(ajax.responseText);
                }
            }
        }
	},
	publishSite: function(useLoadingWindow) {
		// Code for publishing the site (just drafts)
		// Open the loading window
		var useLoadingWindow = (useLoadingWindow == false) ? useLoadingWindow : true;
		if (useLoadingWindow) NW.editor.functions.openLoadingWindow("Publishing Site...");
		
		NW.io.save(null, false, false);
		NW.io.getChangedFiles(false);
		
		var ajax = null;
        if (window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (ajax != null) {
        	// Publish the drafts
			var postData = "site=true&data=0&page=-1";
            ajax.open("POST", "./php/saver.php", true);
            ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(postData);
            ajax.onreadystatechange = function(e) {
				var ajax = e.target;
                if(ajax.readyState==4) {
                	// The publish worked
                	var rawDraftData = ajax.responseText;
                	if (rawDraftData) {
                		// Update the names of the files
                		rawDraftData = NW.io.unserialize_data(rawDraftData);
                		for (var i = 0; rawDraftData[i]; i++) {
                			var currentRawDraft = rawDraftData[i];
                			var data = {name: currentRawDraft["name"]};
                			if (currentRawDraft["type"] == "pages") {
                				var objId = NW.filesystem.createId(currentRawDraft["id"]);
                				var obj = document.getElementById(objId);
                			} else {
                				var objId = NW.filesystem.createId(currentRawDraft["page"], currentRawDraft["id"]);
                				var obj = document.getElementById(objId);
                			}
                			
                			if (obj) NW.filesystem.updateFileData(obj, data);
                		}
                	}
                	
                	var drafts = NW.filesystem.getDrafts();
                	var draft;
                	for (var i = 0; i < drafts.length; i++) {
                		NW.filesystem.restoreFileAppearance(drafts[i]);
                	}
                	
                	if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
                } else if (ajax.readyState == 0) {
                	// The publish didn't work
                	if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
                }
            }
        } else {
        	if (useLoadingWindow) NW.editor.functions.closeLoadingWindow();
        }
		
		// Old Code that used javascript rather than php:
		
		// DAVID: I believe I have completed this function, and you shouldn't even have to touch it,
// 		// Right now, this function loops through all the drafts and then publishes each draft by calling the NW.io.publishPage() function
// 		NW.editor.functions.openLoadingWindow("Publishing Site...");
// 		NW.io.save(null, false);
// 		NW.filesystem.lastPage = null;
// 		NW.filesystem.allDraftsForPublish = null;
// 		NW.filesystem.allDraftsForPublish = [];
// 		var publishArray = [];
// 		// Code for publishing
// 		// The difference between this and save is that save just saves the current state of the page...
// 		// Publish actually puts the page out onto the web to viewed
// 		// Publishing only publishes the drafts, since that is the only thing that has changed
// 		
// 		// The drafts array gets all the files in the left sidebar that are drafts
// 		var draftsArray = NW.filesystem.getDrafts();
// 		// Now loop throught the draftsArray and publish them
// 		var currentDraft;
// 		for (var i = 0; i < draftsArray.length; i++) {
// 			currentDraft = draftsArray[i];
// 			publishArray[currentDraft.id] = {name: currentDraft.textContent, id: currentDraft.id};
// 			
// 			/*NW.filesystem.lastPage = document.createElement("li");
// 			NW.filesystem.lastPage.id = currentDraft.id;
// 			
// 			NW.io.publishPage(currentDraft.id, false);
// 			NW.filesystem.restoreFileAppearance(document.getElementById(currentDraft["id"]));*/
// 		}
// 		// The entries headers array gets all the "Entries" buttons and loads them into an array
// 		// This does not actually contain the data inside (the actual entries), since they haven't been loaded into the list editor
// 		var entriesHeaders = NW.filesystem.getEntriesHeaders();
// 		var entryDraftsArray = entriesHeaders;
// 		for (var i = 0; i < entriesHeaders.length; i++) {
// 			//entriesHeaders[i].listEntries = [];
// 			entriesHeaders[i].listEntries = NW.io.getListEntriesArray(entriesHeaders[i].id);
// 		}
// 		/* entriesHeaders Structure
// 		 * entriesHeaders = array of DOM objects
// 		 * entriesHeaders[].listEntries = multi-dimensional array of entries for the given group (found by the id)
// 		 * entriesHeaders[].listEntries[] = name array to access different aspects of the list
// 		 *
// 		 * Example: entriesHeaders[1].listEntries[2]["name"]
// 		 * Example: entriesHeaders[3].id
// 		 */
// 		
// 		var listEntryDraftNum = 0;
// 		var currentEntry;
// 		for (var i = 0; i < entriesHeaders.length; i++) {
// 			for (var x = 0; x < entriesHeaders[i].listEntries.length; x++) {
// 				if (entriesHeaders[i].listEntries[x]["draft"] && !entriesHeaders[i].listEntries[x]["locked"]) {
// 					entryDraftsArray[i].listEntries[listEntryDraftNum] = entriesHeaders[i].listEntries[x];
// 					currentEntry = entryDraftsArray[i].listEntries[listEntryDraftNum];
// 					publishArray[currentEntry["id"]] = {name: currentEntry["name"], id: currentEntry["id"]};
// 					
// 					/*//entryArgs = NW.filesystem.parseId(currentEntry["id"]);
// 					NW.filesystem.lastPage = document.createElement("li");
// 					NW.filesystem.lastPage.id = currentEntry["id"];
// 					
// 					// Run this function
// 					// (NW.filesystem.restoreFileAppearance())
// 					// and get the current list object by doing getElementById() and put it in as the argument, as below
// 					NW.io.publishPage(currentEntry["id"], false);
// 					NW.filesystem.restoreFileAppearance(document.getElementById(currentEntry["id"]));*/
// 					
// 					listEntryDraftNum++;
// 				}
// 			}
// 		}
// 		/* entryDraftsArray Structure
// 		 * entryDraftsArray = array of DOM objects
// 		 * entryDraftsArray[].listEntries = multi-dimensional array of entries that are drafts and not locked for the given group
// 		 * entryDraftsArray[].listEntries[] = name array to access different aspects of the list
// 		 *
// 		 * Example: entryDraftsArray[1].listEntries[2]["name"]
// 		 * Example: entryDraftsArray[3].id
// 		 */
// 		 
// 		// Look for any unsaved drafts in the list editor that are not gotten by the NW.filesystem.getEntriesHeaders() function and the array under it
// 		$("#NWListEditor .NWRowsSelectable li.NWUnsaved").each(function() {
// 			publishArray[$(this).attr("id")] = {name: $(this).text(), id: $(this).attr("id")};
// 		});
// 		
// 		// Convert the dictionary array into a number array
// 		var draft = null;
// 		var tempArray = [];
// 		var i = 0;
// 		for (draft in publishArray) {
// 			tempArray[i] = publishArray[draft];
// 			i++;
// 		}
// 		
// 		publishArray = null;
// 		publishArray = tempArray;
// 		// Create a local array so it doesn't keep getting edited
// 		// Unfortunately, I can't use something = somethingElse, since the two variables are now attached
// 		// e.g. if I make a change to something, it changes on somethingElse as well
// 		for (var draft in publishArray) {
// 				NW.filesystem.allDraftsForPublish[draft] = publishArray[draft];
// 		}
// 		
// 		draft = null;
// 		for (draft in publishArray) {
// 			NW.io.publishPage(publishArray[draft].id, false);
// 		}
// 		
// 		// Code for publishing all the drafts
// 		
// 		// Use the function inside here when the readyState equals 4, like the others that I have done
// 		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
// 		//NW.editor.functions.closeLoadingWindow();
	},
	preview: function() {
		// Code for previewing current page
	},
	serialize_data: function(mixed_value) {
        // http://kevin.vanzonneveld.net
        // +   original by: Arpad Ray (mailto:arpad@php.net)
        // +   improved by: Dino
        // +   bugfixed by: Andrej Pavlovic
        // +   bugfixed by: Garagoth
        // +      input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
        // +   bugfixed by: Russell Walker (http://www.nbill.co.uk/)
        // +   bugfixed by: Jamie Beck (http://www.terabit.ca/)
        // +      input by: Martin (http://www.erlenwiese.de/)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // -    depends on: utf8_encode
        // %          note: We feel the main purpose of this function should be to ease the transport of data between php & js
        // %          note: Aiming for PHP-compatibility, we have to translate objects to arrays
        // *     example 1: serialize(['Kevin', 'van', 'Zonneveld']);
        // *     returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
        // *     example 2: serialize({firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'});
        // *     returns 2: 'a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}'

        var _getType = function (inp) {
            var type = typeof inp, match;
            var key;
            if (type == 'object' && !inp) {
                return 'null';
            }
            if (type == "object") {
                if (!inp.constructor) {
                    return 'object';
                }
                var cons = inp.constructor.toString();
                match = cons.match(/(\w+)\(/);
                if (match) {
                    cons = match[1].toLowerCase();
                }
                var types = ["boolean", "number", "string", "array"];
                for (key in types) {
                    if (cons == types[key]) {
                        type = types[key];
                        break;
                    }
                }
            }
            return type;
        };
        var type = _getType(mixed_value);
        var val, ktype = '';
        
        switch (type) {
            case "function": 
                val = ""; 
                break;
            case "boolean":
                val = "b:" + (mixed_value ? "1" : "0");
                break;
            case "number":
                val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
                break;
            case "string":
                mixed_value = this.utf8_encode(mixed_value);
                val = "s:" + encodeURIComponent(mixed_value).replace(/%../g, 'x').length + ":\"" + mixed_value + "\"";
                break;
            case "array":
            case "object":
                val = "a";
                /*
                if (type == "object") {
                    var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
                    if (objname == undefined) {
                        return;
                    }
                    objname[1] = this.serialize(objname[1]);
                    val = "O" + objname[1].substring(1, objname[1].length - 1);
                }
                */
                var count = 0;
                var vals = "";
                var okey;
                var key;
                for (key in mixed_value) {
                    ktype = _getType(mixed_value[key]);
                    if (ktype == "function") { 
                        continue; 
                    }
                    
                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                    vals += this.serialize_data(okey) +
                            this.serialize_data(mixed_value[key]);
                    count++;
                }
                val += ":" + count + ":{" + vals + "}";
                break;
            case "undefined": // Fall-through
            default: // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
                val = "N";
                break;
        }
        if (type != "object" && type != "array") {
            val += ";";
        }
        return val;
    },
    utf8_encode: function( argString ) {
        // http://kevin.vanzonneveld.net
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: sowberry
        // +    tweaked by: Jack
        // +   bugfixed by: Onno Marsman
        // +   improved by: Yves Sucaet
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Ulrich
        // *     example 1: utf8_encode('Kevin van Zonneveld');
        // *     returns 1: 'Kevin van Zonneveld'

        var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        var utftext = "";
        var start, end;
        var stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.substring(start, end);
                }
                utftext += enc;
                start = end = n+1;
            }
        }

        if (end > start) {
            utftext += string.substring(start, string.length);
        }

        return utftext;
    },
    unserialize_data: function(data) {
		// Takes a string representation of variable and recreates it  
		// 
		// version: 1004.2314
		// discuss at: http://phpjs.org/functions/unserialize
		// +     original by: Arpad Ray (mailto:arpad@php.net)
		// +     improved by: Pedro Tainha (http://www.pedrotainha.com)
		// +     bugfixed by: dptr1988
		// +      revised by: d3x
		// +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +        input by: Brett Zamir (http://brett-zamir.me)
		// +     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +     improved by: Chris
		// +     improved by: James
		// +        input by: Martin (http://www.erlenwiese.de/)
		// +     bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +     improved by: Le Torbi
		// +     input by: kilops
		// +     bugfixed by: Brett Zamir (http://brett-zamir.me)
		// -      depends on: NW.io.utf8_decode
		// %            note: We feel the main purpose of this function should be to ease the transport of data between php & js
		// %            note: Aiming for PHP-compatibility, we have to translate objects to arrays
		// *       example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}');
		// *       returns 1: ['Kevin', 'van', 'Zonneveld']
		// *       example 2: unserialize('a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}');
		// *       returns 2: {firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'}
		var that = this;
		var utf8Overhead = function(chr) {
			// http://phpjs.org/functions/unserialize:571#comment_95906
			var code = chr.charCodeAt(0);
			if (code < 0x0080) {
				return 0;
			}
			if (code < 0x0800) {
				 return 1;
			}
			return 2;
		};
	 
	 
		var error = function (type, msg, filename, line){throw new that.window[type](msg, filename, line);};
		var read_until = function (data, offset, stopchr){
			var buf = [];
			var chr = data.slice(offset, offset + 1);
			var i = 2;
			while (chr != stopchr) {
				if ((i+offset) > data.length) {
					error('Error', 'Invalid');
				}
				buf.push(chr);
				chr = data.slice(offset + (i - 1),offset + i);
				i += 1;
			}
			return [buf.length, buf.join('')];
		};
		var read_chrs = function (data, offset, length){
			var buf;
	 
			buf = [];
			for (var i = 0;i < length;i++){
				var chr = data.slice(offset + (i - 1),offset + i);
				buf.push(chr);
				length -= utf8Overhead(chr); 
			}
			return [buf.length, buf.join('')];
		};
		var _unserialize = function (data, offset){
			var readdata;
			var readData;
			var chrs = 0;
			var ccount;
			var stringlength;
			var keyandchrs;
			var keys;
	 
			if (!offset) {offset = 0;}
			var dtype = (data.slice(offset, offset + 1)).toLowerCase();
	 
			var dataoffset = offset + 2;
			var typeconvert = function(x) {return x;};
	 
			switch (dtype){
				case 'i':
					typeconvert = function (x) {return parseInt(x, 10);};
					readData = read_until(data, dataoffset, ';');
					chrs = readData[0];
					readdata = readData[1];
					dataoffset += chrs + 1;
				break;
				case 'b':
					typeconvert = function (x) {return parseInt(x, 10) !== 0;};
					readData = read_until(data, dataoffset, ';');
					chrs = readData[0];
					readdata = readData[1];
					dataoffset += chrs + 1;
				break;
				case 'd':
					typeconvert = function (x) {return parseFloat(x);};
					readData = read_until(data, dataoffset, ';');
					chrs = readData[0];
					readdata = readData[1];
					dataoffset += chrs + 1;
				break;
				case 'n':
					readdata = null;
				break;
				case 's':
					ccount = read_until(data, dataoffset, ':');
					chrs = ccount[0];
					stringlength = ccount[1];
					dataoffset += chrs + 2;
	 
					readData = read_chrs(data, dataoffset+1, parseInt(stringlength, 10));
					chrs = readData[0];
					readdata = readData[1];
					dataoffset += chrs + 2;
					if (chrs != parseInt(stringlength, 10) && chrs != readdata.length){
						error('SyntaxError', 'String length mismatch');
					}
	 
					// Length was calculated on an utf-8 encoded string
					// so wait with decoding
					readdata = that.utf8_decode(readdata);
				break;
				case 'a':
					readdata = {};
	 
					keyandchrs = read_until(data, dataoffset, ':');
					chrs = keyandchrs[0];
					keys = keyandchrs[1];
					dataoffset += chrs + 2;
	 
					for (var i = 0; i < parseInt(keys, 10); i++){
						var kprops = _unserialize(data, dataoffset);
						var kchrs = kprops[1];
						var key = kprops[2];
						dataoffset += kchrs;
	 
						var vprops = _unserialize(data, dataoffset);
						var vchrs = vprops[1];
						var value = vprops[2];
						dataoffset += vchrs;
	 
						readdata[key] = value;
					}
	 
					dataoffset += 1;
				break;
				default:
					error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
				break;
			}
			return [dtype, dataoffset - offset, typeconvert(readdata)];
		};
		
		return _unserialize((data+''), 0)[2];
	},
	utf8_decode: function(str_data) {
		// Converts a UTF-8 encoded string to ISO-8859-1  
		// 
		// version: 1004.2314
		// discuss at: http://phpjs.org/functions/NW.io.utf8_decode
		// +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// +      input by: Aman Gupta
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: Norman "zEh" Fuchs
		// +   bugfixed by: hitwork
		// +   bugfixed by: Onno Marsman
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: NW.io.utf8_decode('Kevin van Zonneveld');
		// *     returns 1: 'Kevin van Zonneveld'
		var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
		
		str_data += '';
		
		while ( i < str_data.length ) {
			c1 = str_data.charCodeAt(i);
			if (c1 < 128) {
				tmp_arr[ac++] = String.fromCharCode(c1);
				i++;
			} else if ((c1 > 191) && (c1 < 224)) {
				c2 = str_data.charCodeAt(i+1);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = str_data.charCodeAt(i+1);
				c3 = str_data.charCodeAt(i+2);
				tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
	 
		return tmp_arr.join('');
	}
};