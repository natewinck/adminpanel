// Color Picker
NW.colors = {
	colorChange: function(type) {
		var color = "";
		$("a.NWColorPicker").each(function() {
			if( $(this).attr("rel") == type )
				color = $(this).children().css("background-color");
		});
		NWEditPage.document.execCommand(type,false,color);
		$("#NWEditPage").focus();
	},
	RGB: function(rgbval){
		var s = rgbval.match(/rgb\s*\x28((?:25[0-5])|(?:2[0-4]\d)|(?:[01]?\d?\d))\s*,\s*((?:25[0-5])|(?:2[0-4]\d)|(?:[01]?\d?\d))\s*,\s*((?:25[0-5])|(?:2[0-4]\d)|(?:[01]?\d?\d))\s*\x29/);
		
		if (s)	{
			s = s.splice(1);
		}
		if (s && s.length == 3){
			d = '';
			for (i in s){
				e = parseInt(s[i], 10).toString(16);
				if (e == "0") {
					d += "00";
				} else if (
					e < 10 ||
					e == "a" ||
					e == "b" ||
					e == "c" ||
					e == "d" ||
					e == "e" ||
					e == "f" ||
					e == "A" ||
					e == "B" ||
					e == "C" ||
					e == "D" ||
					e == "E" ||
					e == "F") {
					d += "0" + e
				} else {
					d += e;
				}
			}
			return '#' + d;
		} else {
			return rgbval;
		}
	},
	HSL: function(hsl) {
		// Convert into individual values
		hsl = hsl.replace(/\x5B/, "");			// Deletes [
		hsl = hsl.replace(/\x5D/, "");			// Deletes ]
		hsl = hsl.replace(/^\s+|\s+$/g, '');	// Trims whitespace
		var hslArray = hsl.split(",");			// Creates array from commas
		if(!hslArray[1])
			hslArray = hsl.split(/\s+/);		// If no commas, create array from space
		var h	= hslArray[0];
		var s	= hslArray[1] / 100;
		var l	= hslArray[2] / 100;
		
		// Proceed with function
		/**
		 * Converts an HSL color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
		 * Assumes h, s, and l are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   {Number}    h       The hue
		 * @param   {Number}    s       The saturation
		 * @param   {Number}    l       The lightness
		 * @return  {Function}          The Hex representation
		 */
		var r, g, b;
	
		if(s == 0){
			r = g = b = l; // achromatic
		} else {
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + ((q - p) * (2/3 - t) * 6);
				return p;
			};
	
			var q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
			var p = 2 * l - q;
			h = h / 360;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);
		var rgbval = "rgb("+ r +","+ g +","+ b +")";
		return NW.colors.RGB(rgbval);
		//return {r: r, g: g, b: b};
	},
	
	/**
	 * Converts an HSV color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes h, s, and v are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   {Number}    h       The hue
	 * @param   {Number}    s       The saturation
	 * @param   {Number}    v       The value
	 * @return  {Function}          The Hex representation
	 */
	HSV: function(hsv) {
		// First parse the value
		hsv = hsv.replace(/^\s+|\s+$/g, '');	// Trims whitespace
		var hsvArray = hsv.split(",");			// Creates array from commas
		if(!hsvArray[1])
			hsvArray = hsv.split(/\s+/);		// If no commas, create array from space
		var h	= hsvArray[0];
		var s	= hsvArray[1] / 100;
		var v	= hsvArray[2] / 100;
		
		var r, g, b;
	
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
	
		switch(i % 6){
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		
		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);		
		var rgbval = "rgb("+ r +","+ g +","+ b +")";
		return NW.colors.RGB(rgbval);
	},
	
	
	// Function for when the user clicks on a manual color button; returns the color
	manualColor: function(type, title, theThis) {
		// Disable the window from popping up if another one is already up
		for (var i = 0; i < document.getElementsByClassName("NWInputWindow").length; i++) {
			if (document.getElementsByClassName("NWInputWindow")[i].style.display == "block") return;
		}
		var button = theThis;
		var color;
		
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var position = {x: 0, y: 0};
		
		//$(".NWInputWindow.NWHex").hide();
		// Reset the position of the windows
		position.y = (windowHeight / 2) - 95;
		position.x = (windowWidth / 2) - 205;
		
		switch (type) {
			case "hex":
				$(".NWInputWindow.NWHex").css("top", position.y);
				$(".NWInputWindow.NWHex").css("left", position.x);
				
				$(".NWInputWindow.NWHex")[0].getElementsByClassName("NWDone")[0].onclick = null;
				$(".NWInputWindow.NWHex")[0].getElementsByTagName("input")[0].onkeypress = null;
				$(".NWInputWindow.NWHex").show();
				$(".NWInputWindow.NWHex input").focus();
				$(".NWInputWindow.NWHex .NWDraggableTitle").text(title);
				function closeHex() {
					color = $(".NWInputWindow.NWHex input").val();
					if(!color.match("#"))
						color = "#" + color;
					$(".NWInputWindow.NWHex input").val("");
					
					$(".NWInputWindow.NWHex").hide();
					updateColorPicker(color, button);
				}
				$(".NWInputWindow.NWHex")[0].getElementsByClassName("NWDone")[0].onclick = closeHex;
				$(".NWInputWindow.NWHex")[0].getElementsByTagName("input")[0].onkeypress = function(e) {
					if (e.which == Key.ENTER) closeHex();
				}
				break;
				case "rgb":
					$(".NWInputWindow.NWRGB").css("top", position.y);
					$(".NWInputWindow.NWRGB").css("left", position.x);
				
					$(".NWInputWindow.NWRGB")[0].getElementsByClassName("NWDone")[0].onclick = null;
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[0].onkeypress = null;
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[1].onkeypress = null;
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[2].onkeypress = null;
					$(".NWInputWindow.NWRGB").show();
					$(".NWInputWindow.NWRGB input:first").focus();
					$(".NWInputWindow.NWRGB .NWDraggableTitle").text(title);
					function closeRGB() {
						var i = 0;
						var colorArray = [];
						$(".NWInputWindow.NWRGB input").each(function() {
							colorArray[i] = $(this).val();
							i++;
						});
						color = "rgb(";
						for (i = 0; i < colorArray.length; i++) {
							color += colorArray[i];
							if (i + 1 != colorArray.length) color += ",";
						}
						color += ")";
						
						// Convert from RGB to Hex
						color = NW.colors.RGB(color);
						
						$(".NWInputWindow.NWRGB input").each(function() {
							$(this).val("");
						});
						$(".NWInputWindow.NWRGB").hide();
						updateColorPicker(color, button);
						return false;
					}
					$(".NWInputWindow.NWRGB")[0].getElementsByClassName("NWDone")[0].onclick = closeRGB;
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[0].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeRGB();
					};
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[1].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeRGB();
					};
					$(".NWInputWindow.NWRGB")[0].getElementsByTagName("input")[2].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeRGB();
					};
					break;
				case "hsl":
					$(".NWInputWindow.NWHSL").css("top", position.y);
					$(".NWInputWindow.NWHSL").css("left", position.x);
					
					$(".NWInputWindow.NWHSL")[0].getElementsByClassName("NWDone")[0].onclick = null;
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[0].onkeypress = null;
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[1].onkeypress = null;
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[2].onkeypress = null;
					$(".NWInputWindow.NWHSL").show();
					$(".NWInputWindow.NWHSL input:first").focus();
					$(".NWInputWindow.NWHSL .NWDraggableTitle").text(title);
					function closeHSL() {
						var i = 0;
						var colorArray = [];
						$(".NWInputWindow.NWHSL input").each(function() {
							colorArray[i] = $(this).val();
							i++;
						});
						color = "";
						for (i = 0; i < colorArray.length; i++) {
							color += colorArray[i];
							if (i + 1 != colorArray.length) color += " ";
						}
						// Convert from HSL to Hex
						color = NW.colors.HSL(color);
						
						$(".NWInputWindow.NWHSL input").each(function() {
							$(this).val("");
						});
						$(".NWInputWindow.NWHSL").hide();
						updateColorPicker(color, button);
						return false;
					}
					$(".NWInputWindow.NWHSL")[0].getElementsByClassName("NWDone")[0].onclick = closeHSL;
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[0].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSL();
					};
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[1].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSL();
					};
					$(".NWInputWindow.NWHSL")[0].getElementsByTagName("input")[2].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSL();
					};
					break;
				case "hsv":
					$(".NWInputWindow.NWHSV").css("top", position.y);
					$(".NWInputWindow.NWHSV").css("left", position.x);
					
					$(".NWInputWindow.NWHSV")[0].getElementsByClassName("NWDone")[0].onclick = null;
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[0].onkeypress = null;
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[1].onkeypress = null;
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[2].onkeypress = null;
					$(".NWInputWindow.NWHSV").show();
					$(".NWInputWindow.NWHSV input:first").focus();
					$(".NWInputWindow.NWHSV .NWDraggableTitle").text(title);
					function closeHSV() {
						var i = 0;
						var colorArray = [];
						$(".NWInputWindow.NWHSV input").each(function() {
							colorArray[i] = $(this).val();
							i++;
						});
						color = "";
						for (i = 0; i < colorArray.length; i++) {
							color += colorArray[i];
							if (i + 1 != colorArray.length) color += " ";
						}
						// Convert from HSV to Hex
						color = NW.colors.HSV(color);
						
						$(".NWInputWindow.NWHSV input").each(function() {
							$(this).val("");
						});
						$(".NWInputWindow.NWHSV").hide();
						updateColorPicker(color, button);
						return false;
					}
					$(".NWInputWindow.NWHSV")[0].getElementsByClassName("NWDone")[0].onclick = closeHSV;
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[0].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSV();
					};
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[1].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSV();
					};
					$(".NWInputWindow.NWHSV")[0].getElementsByTagName("input")[2].onkeypress = function(e) {
						if (e.which == Key.ENTER) closeHSV();
					};
					break;
		}
		
		function updateColorPicker(color, button) {
			if(color)
				jQuery.farbtastic( button.parent().children("div.NWColorPickerWindow").children("div.NWDraggableBody").children("div.NWColorPicker") ).setColor(color);
				
			NW.colors.colorChange(button.parent().children("a.NWColorPicker").attr("rel"));
		}
	}
};

$(document).ready(function() {
	$("div.NWColorPickerWindow").mouseup(function() {
		NW.colors.colorChange($(this).parent().children("a.NWColorPicker").attr("rel"));
	});
	
	//$("div.NWColorPickerWindow.NWBackgroundColor div.NWColorPicker").farbtastic("div.NWBackgroundColor a.NWColorPicker span");
	//jQuery.farbtastic("div.NWFontColor div.NWColorPicker").linkTo("div.NWFontColor a.NWColorPicker span");
	//$("div.NWColorPickerWindow.NWFontColor div.NWColorPicker").farbtastic("div.NWFontColor a.NWColorPicker span");
	$("div.NWColorPicker").each(function() {
		var bg = $(this).parent().parent().children("a.NWColorPicker span");
		//$(this).farbtastic( $(this).parent().parent().children("a.NWColorPicker").children() );
		jQuery.farbtastic( $(this) ).linkTo( $(this).parent().parent().parent().children("a.NWColorPicker").children() );
	});
	$("a.NWColorPicker").click(function() {
		/*var attr = $(this).attr("rel");
		$("div.NWColorPickerWindow").each(function() {
			if( $(this).attr("command") == attr )
				$(this).toggle();
		});*/
		
		$(this).parent().children("div.NWColorPickerWindow").toggle();
	});
	$("div.NWColorPickerWindow a.NWDone").click(function() {
		$(this).parent().parent().hide();
		return false;
	});
	$("a.NWColorNone").click(function() {
		$(this).prev().children().css("background-color", "transparent");
		NW.colors.colorChange( $(this).prev().attr("rel") );
	});
});