NW.io = {
	getFilesArray: function() {
		// Code here for getting the array of all the files
		var filesXML = null;
        var filesArray = new Array();

        ajax = null;
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
        for(var i = 0; i < files.getElementsByTagName('name').length; i++)
        {
            var file = new Array();
            file['list'] = files.getElementsByTagName('list')[i].childNodes[0].nodeValue;
            // This is completely temporary: using the cat to distinguish if it uses the listEditor (the page in the left sidebar doesn't need the id, since it's not loading a page, only a category of entries.  The reason why is on wave
            // Ideally, this would actually check file["list"] to detect if it needs the listEditor
            file['id'] = files.getElementsByTagName('id')[i].childNodes[0].nodeValue;
            file['name'] = files.getElementsByTagName('name')[i].childNodes[0].nodeValue;
            // Again, this is completely temporary: using the cat to distinguish if it uses the listEditor.  The reason why is on wave
            // This should actually check file["list"] to detect if it needs the listEditor
            //file['list'] = (file['cat'] == "entries");
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
			console.log(NW.filesystem.createId(lastOpenFile.pageId, lastOpenFile.entryId, true));
			NW.filesystem.select(null, entryButton);
			NW.filesystem.showListEditor($(entryButton));
			
			var openedEntry = document.getElementById(NW.filesystem.createId(lastOpenFile.pageId, lastOpenFile.entryId));
			if (openedEntry) NW.filesystem.select(null, openedEntry);
		} else {
			var openedPage = document.getElementById(NW.filesystem.createId(lastOpenFile.pageId));
			if (openedPage) NW.filesystem.select(null, openedPage);
		}
		
		NW.io.open(lastOpenFile.cat, lastOpenFile.id);
	},
	open: function(pageId, entryId) {
		if (pageId == null) return false;
        //Gets an entry from the backend.
        //id is always an integer, cat is a string
        //IF id is left off then it gets multiple entries.
        //console.log(id);
        
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
	},
	getListEntriesArray: function(pageId) {
		// Code here for getting the array of all the entries
		// Code here for getting the array of all the files
		var filesXML = null;
        var filesArray = new Array();

        ajax = null;
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
        for(var i = 0; i < files.getElementsByTagName('id').length; i++)
        {
            var file = new Array();
            file['id'] = files.getElementsByTagName('id')[i].childNodes[0].nodeValue;
            file['pageId'] = files.getElementsByTagName('page')[i].childNodes[0].nodeValue;
            file['name'] = files.getElementsByTagName('name')[i].childNodes[0].nodeValue;
            file['author'] = files.getElementsByTagName('author')[i].childNodes[0].nodeValue;
            file['draft'] = parseInt(files.getElementsByTagName('draft')[i].childNodes[0].nodeValue);
            file['locked'] = parseInt(files.getElementsByTagName('locked')[i].childNodes[0].nodeValue);
            filesArray.push(file);
        }
		return filesArray;
	},
	addListEntry: function(obj) {
		// Code here for getting the id for the list item via ajax
		// I'm not sure if this part needs to be done the instant you hit "Add Entry", which is what it's doing right now
		// It could probably be done when the user hits the save button
		// For now, though...
		
		var name = obj.textContent;
		var id = 5;
		
		return id;
	},
	save: function(obj, useLoadingWindow, not_draft) {
		// Find the selected object
		if (obj && obj.target) obj = null;
		var selected = obj || null;
		if (!selected) {
			selected = NW.filesystem.getSelected();
		}
		if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		if (!$(selected).hasClass("NWUnsaved")) selected = null;
		
		if (!selected) return false;
		
		var file = NW.filesystem.parseId(selected.id);
		
		if (useLoadingWindow == null) useLoadingWindow = true;
		if (useLoadingWindow) NW.editor.functions.openLoadingWindow("Saving Page as a Draft...");
		
		// Code for saving
		ajax = null;
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
            
			var draftString = "";
			if(!not_draft) draftString = "&draft=true";
			
            // DAVID: I put entryId in this as well; not sure if this is how it should be
            // Also, I have a feeling "cat=drafts" is outdated, but I'm not sure
            ajax.open("GET", "./php/saver.php?data=" + dstring + "&page=" + file.pageId + "&entry=" + file.entryId + draftString, true); // DAVID: Not sure if you wanted cat to equal draft (which it was) or drafts (what I changed it to).  It can now save a draft, but it can't load it.
            ajax.send(null);
            ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
					if(not_draft)
					{
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
						}
					}
					else
					{
						// When done saving, close the loading window
						NW.editor.functions.closeLoadingWindow();
						$(selected).removeClass("NWUnsaved");
					}
                    //console.log(ajax.responseText);
                }
            }
        }
		
		// When done saving, close the loading window
		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
	},
	revert: function() {
		var selected = NW.filesystem.getSelected() || null;
		if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		if ($(selected).children(".NWFile")[0]) selected = null;
		
		if (!selected) return false;
		
		NW.io.save(null, false);
		
		NW.filesystem.restoreFileAppearance();
		
		// Code here for reverting the page to the public state
		
	},
	publishPage: function(objId, useLoadingWindow) {
		NW.io.save(objId, useLoadingWindow, true);
	},
	publishSite: function() {
		// DAVID: I believe I have completed this function, and you shouldn't even have to touch it,
		// Right now, this function loops through all the drafts and then publishes each draft by calling the NW.io.publishPage() function
		NW.editor.functions.openLoadingWindow("Publishing Site...");
		NW.io.save(null, false);
		NW.filesystem.lastPage = null;
		NW.filesystem.allDraftsForPublish = null;
		NW.filesystem.allDraftsForPublish = [];
		var publishArray = [];
		// Code for publishing
		// The difference between this and save is that save just saves the current state of the page...
		// Publish actually puts the page out onto the web to viewed
		// Publishing only publishes the drafts, since that is the only thing that has changed
		
		// The drafts array gets all the files in the left sidebar that are drafts
		var draftsArray = NW.filesystem.getDrafts();
		// Now loop throught the draftsArray and publish them
		var currentDraft;
		for (var i = 0; i < draftsArray.length; i++) {
			currentDraft = draftsArray[i];
			publishArray[currentDraft.id] = {name: currentDraft.textContent, id: currentDraft.id};
			
			/*NW.filesystem.lastPage = document.createElement("li");
			NW.filesystem.lastPage.id = currentDraft.id;
			
			NW.io.publishPage(currentDraft.id, false);
			NW.filesystem.restoreFileAppearance(document.getElementById(currentDraft["id"]));*/
		}
		// The entries headers array gets all the "Entries" buttons and loads them into an array
		// This does not actually contain the data inside (the actual entries), since they haven't been loaded into the list editor
		var entriesHeaders = NW.filesystem.getEntriesHeaders();
		var entryDraftsArray = entriesHeaders;
		for (var i = 0; i < entriesHeaders.length; i++) {
			//entriesHeaders[i].listEntries = [];
			entriesHeaders[i].listEntries = NW.io.getListEntriesArray(entriesHeaders[i].id);
		}
		/* entriesHeaders Structure
		 * entriesHeaders = array of DOM objects
		 * entriesHeaders[].listEntries = multi-dimensional array of entries for the given group (found by the id)
		 * entriesHeaders[].listEntries[] = name array to access different aspects of the list
		 *
		 * Example: entriesHeaders[1].listEntries[2]["name"]
		 * Example: entriesHeaders[3].id
		 */
		
		var listEntryDraftNum = 0;
		var currentEntry;
		for (var i = 0; i < entriesHeaders.length; i++) {
			for (var x = 0; x < entriesHeaders[i].listEntries.length; x++) {
				if (entriesHeaders[i].listEntries[x]["draft"] && !entriesHeaders[i].listEntries[x]["locked"]) {
					entryDraftsArray[i].listEntries[listEntryDraftNum] = entriesHeaders[i].listEntries[x];
					currentEntry = entryDraftsArray[i].listEntries[listEntryDraftNum];
					publishArray[currentEntry["id"]] = {name: currentEntry["name"], id: currentEntry["id"]};
					
					/*//entryArgs = NW.filesystem.parseId(currentEntry["id"]);
					NW.filesystem.lastPage = document.createElement("li");
					NW.filesystem.lastPage.id = currentEntry["id"];
					
					// Run this function
					// (NW.filesystem.restoreFileAppearance())
					// and get the current list object by doing getElementById() and put it in as the argument, as below
					NW.io.publishPage(currentEntry["id"], false);
					NW.filesystem.restoreFileAppearance(document.getElementById(currentEntry["id"]));*/
					
					listEntryDraftNum++;
				}
			}
		}
		/* entryDraftsArray Structure
		 * entryDraftsArray = array of DOM objects
		 * entryDraftsArray[].listEntries = multi-dimensional array of entries that are drafts and not locked for the given group
		 * entryDraftsArray[].listEntries[] = name array to access different aspects of the list
		 *
		 * Example: entryDraftsArray[1].listEntries[2]["name"]
		 * Example: entryDraftsArray[3].id
		 */
		 
		// Look for any unsaved drafts in the list editor that are not gotten by the NW.filesystem.getEntriesHeaders() function and the array under it
		$("#NWListEditor .NWRowsSelectable li.NWUnsaved").each(function() {
			publishArray[$(this).attr("id")] = {name: $(this).text(), id: $(this).attr("id")};
		});
		
		// Convert the dictionary array into a number array
		var draft = null;
		var tempArray = [];
		var i = 0;
		for (draft in publishArray) {
			tempArray[i] = publishArray[draft];
			i++;
		}
		
		publishArray = null;
		publishArray = tempArray;
		// Create a local array so it doesn't keep getting edited
		// Unfortunately, I can't use something = somethingElse, since the two variables are now attached
		// e.g. if I make a change to something, it changes on somethingElse as well
		for (var draft in publishArray) {
				NW.filesystem.allDraftsForPublish[draft] = publishArray[draft];
		}
		
		draft = null;
		for (draft in publishArray) {
			NW.io.publishPage(publishArray[draft].id, false);
		}
		
		// Code for publishing all the drafts
		
		// Use the function inside here when the readyState equals 4, like the others that I have done
		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
		//NW.editor.functions.closeLoadingWindow();
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
    }
};