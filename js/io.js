NW.io = {
	openLastOpenFile: function() {
		// Eventually put code in here that will detect which file was last open
		// This could open multiple pages and store them in the background (maybe)
		
		// For now, just open the malloc news file
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/malloc/news/");
		//NW.io.open("http://76.177.45.11/~nathanielwinckler/marysutherland/Mary Sutherland/Welcome.html");
		NW.io.open(0, "entries");
	},
	open: function(id, cat) {
		// Not sure if this is the most efficient way of opening a file
		// Hopefully, I will have a system of caching the already open page
		document.getElementById("NWEditPage").src = './php/loader.php?id=' + id + '&cat=' + cat;
		// BRING BACK console.log("File Opened");
		// To prevent caching of the iframe, I found that setting the id to something else like "new Date().getTime()
		// will prevent this caching
	},
	openDialog: function() {
		var test = prompt("Enter a URL:");
		if (test != null && test != "") NW.io.open(test);
	},
	save: function() {
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
            console.log("./php/saver.php?data=" + dstring + "&id=" + $(".NWSelected")[0].id);
            ajax.open("GET", "./php/saver.php?data=" + dstring + "&id=" + $(".NWSelected").attr("id") + "&cat=draft", false);
            ajax.send(null);
            ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                    console.log(ajax.responseText);
                }
            }
        }
	},
	publish: function() {
		// Code for publishing
		// The difference between this and save is that save just saves the current state of the page...
		// Publish actually puts the page out onto the web to viewed
		
		// The animation, right now, just animates a progress; there is nothing attached to it, though
		$(".NWLoading").animate({
			top: 0,
			height: "100%"
		});
		$(".NWLoadingWindow .NWLoadingBar").animate({
			width: 240
		}, 2000, "linear", function() {
			$(".NWLoading").animate({
				top: -135,
				height: 0
			}, function() {
				$(".NWLoadingWindow .NWLoadingBar").css("width", "0px");
			});
		});
        
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
            console.log("./php/saver.php?data=" + dstring + "&id=" + $(".NWSelected")[0].id);
            ajax.open("GET", "./php/saver.php?data=" + dstring + "&id=" + $(".NWSelected").attr("id") + "&cat=drafts"/* + $(".NWSelected").attr("cat")*/, false);
            ajax.send(null);
            ajax.onreadystatechange=function()
            {
                if(ajax.readyState==4){
                    console.log(ajax.responseText);
                }
            }
        }
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
