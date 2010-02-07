NW.io = {
	getFilesArray: function() {
		// Code here for getting the array of all the files
		var filesArray = null;
		
		// Test Array
		// DELETE when using real array
		filesArray = new Array();
		filesArray[0] = new Array();
		filesArray[0]["name"] = "some name here";
		filesArray[0]["id"] = "id=0&cat=entries";
		filesArray[0]["draft"] = false;
		filesArray[0]["list"] = false;
		filesArray[1] = new Array();
		filesArray[1]["name"] = "some name here 2";
		filesArray[1]["id"] = "aUniqueId2";
		filesArray[1]["draft"] = false;
		filesArray[1]["list"] = true;
		filesArray[2] = new Array();
		filesArray[2]["name"] = "Home";
		filesArray[2]["id"] = "HomeId";
		filesArray[2]["draft"] = true;
		filesArray[2]["locked"] = true;
		filesArray[2]["list"] = false;
		
		
		return filesArray;
	},
	openLastOpenFile: function() {
		// Eventually put code in here that will detect which file was last open
		// This could open multiple pages and store them in the background (maybe)
		
		// For now, just open the malloc news file
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/malloc/news/");
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/marysutherland/Mary Sutherland/Welcome.html");
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/marysutherland/Mary%20Sutherland/Updates/77A1D142-8FD9-489B-BC1F-7048A0A3EB2D.html");
		
		NW.io.open(0, "entries");
	},
	open: function(id, cat) {
		// Not sure if this is the most efficient way of opening a file
		// Hopefully, I will have a system of caching the already open page
		//document.getElementById("NWEditPage").src = url;
		
		// Code here for parsing the objId
		// We can go back to the other way, by having the id and the cat as different arguments
		// However, the parsing has to occur at one point or another, it shouldn't really matter
		// If the parsing to needs to occur elsewhere, it can be parsed from the NW.filesystem.select function, the function that calls this function (NW.io.open())
		
		// DAVID: I'm assuming the id (the variable here) is always a number.  If it's not, I need to remove the parseInt() function from the parser in the NW.filesystem.select() function
		document.getElementById("NWEditPage").src = './php/loader.php?id=' + id + '&cat=' + cat;
		
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
	getListEntriesArray: function(id) {
		// Code here for getting the array of all the entries
		var listArray = null;
		
		// Test Array
		// DELETE when using real array
		listArray = new Array();
		listArray[0] = new Array();
		listArray[0]["name"] = "some name here";
		listArray[0]["id"] = "aUniqueId3";
		listArray[0]["draft"] = true;
		listArray[1] = new Array();
		listArray[1]["name"] = "some name here 2";
		listArray[1]["id"] = "aUniqueId4";
		listArray[2] = new Array();
		listArray[2]["name"] = "some name here";
		listArray[2]["id"] = "aUniqueId5";
		listArray[2]["draft"] = true;
		listArray[2]["locked"] = true;
		
		
		return listArray;
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
	save: function(obj, useLoadingWindow) {
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
            var elements = NWEditPage.document.getElementsByClassName("NWEditable");
            var data = new Array();
            for(var i = 0; i < elements.length; i++)
            {
                data[elements[i].id] = elements[i].innerHTML;
            }
            var dstring = escape(NW.io.serialize_data(data));
            console.log("./php/saver.php?data=" + dstring + "&id=" + file.id);
            ajax.open("GET", "./php/saver.php?data=" + dstring + "&id=" + file.id + "&cat=draft", false);
            ajax.send(null);
            ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                	// When done saving, close the loading window
                	NW.editor.functions.closeLoadingWindow();
                	$(selected).removeClass("NWUnsaved");
                    console.log(ajax.responseText);
                }
            }
        }
		
		// When done saving, close the loading window
		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
	},
	revert: function() {
		var selected = NW.filesystem.getSelected() || null;
		if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		
		NW.filesystem.restoreFileAppearance();
		
		// Code here for reverting the page to the public state
		
	},
	publishPage: function() {
		// Code for publishing
		// The difference between this and save is that save just saves the current state of the page...
		// Publish actually puts the page out onto the web to viewed
		var selected = NW.filesystem.getSelected() || null;
		if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
		
		NW.filesystem.restoreFileAppearance();
		
		NW.editor.functions.openLoadingWindow("Publishing Page...");
		
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
            var elements = NWEditPage.document.getElementsByClassName("NWEditable");
            var data = new Array();
            for(var i = 0; i < elements.length; i++)
            {
                data[elements[i].id] = elements[i].innerHTML;
            }
            var dstring = escape(NW.io.serialize_data(data));
            console.log("./php/saver.php?data=" + dstring + "&id=" + selected.id);
            // DAVID: I believe there is a mistake here: you have the cat=drafts. Shouldn't it be cat=public or whatever you're calling it?
            ajax.open("GET", "./php/saver.php?data=" + dstring + "&id=" + selected.id + "&cat=drafts"/* + $(".NWSelected").attr("cat")*/, false);
            ajax.send(null);
            ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                	// When done publishing, close the loading window
                	NW.editor.functions.closeLoadingWindow();
                    console.log(ajax.responseText);
                }
            }
        }
        
		//setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
	},
	publishSite: function() {
		// Code for publishing
		// The difference between this and save is that save just saves the current state of the page...
		// Publish actually puts the page out onto the web to viewed
		// Publishing only publishes the drafts, since that is the only thing that has changed
		
		// The drafts array gets all the files in the left sidebar that are drafts
		var draftsArray = NW.filesystem.getDrafts();
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
		for (var i = 0; i < entriesHeaders.length; i++) {
			for (var x = 0; x < entriesHeaders[i].listEntries.length; x++) {
				if (entriesHeaders[i].listEntries[x]["draft"] && !entriesHeaders[i].listEntries[x]["locked"]) {
					entryDraftsArray[i].listEntries[listEntryDraftNum] = entriesHeaders[i].listEntries[x];
					// DAVID: as you go through below publishing the drafts via ajax, you need to run this function
					// (NW.filesystem.restoreFileAppearance())
					// and get the current list object by doing getElementById() and put it in as the argument, as below
					NW.filesystem.restoreFileAppearance(
						document.getElementById(entryDraftsArray[i].listEntries[listEntryDraftNum]["id"])
					);
					
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
		
		NW.editor.functions.openLoadingWindow("Publishing Site...");
		
		// Code for publishing all the drafts
		
		// Use the function inside here when the readyState equals 4, like the others that I have done
		setTimeout("NW.editor.functions.closeLoadingWindow();", 3000);
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