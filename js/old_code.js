$(document).ready(function() {
	/*function NW.window.resize() {
		var clientW = window.innerWidth;
		var clientH = window.innerHeight;
		
		// Resize NWLeft and NWRight
		var NWRightW = $("#NWRight").css("width");
		var NWRightOriginalW = 330;
		NWRightW = NWRightW.replace(/px/gi, "");
		var NWLeftW = $("#NWLeft").css("width");
		NWLeftW = NWLeftW.replace(/px/gi, "");
		if ($("#NWRight").css("display") == "none") {
			$("#NWLeft").css("width", clientW);
		} else if (clientW >= 620) {
			NWLeftW = clientW - NWRightOriginalW;
			$("#NWLeft").css("width", NWLeftW);
			$("#NWRight").css("width", NWRightOriginalW);
		} else if (clientW < 620) {
			$("#NWLeft").css("width", "290px");
			NWRightW = clientW - 290;
			$("#NWRight").css("width", NWRightW);
		}
		
		// Resize NWSidebarLeft, NWEdit, and NWToolbar
		var NWSidebarLeftH;
		//var NWToolbarH = $("#NWToolbar").css("height");
		//NWToolbarH = NWToolbarH.replace(/px/gi, "");
		NWToolbarH = 65;
		
		NWSidebarLeftH = clientH - NWToolbarH;
		$("#NWSidebarLeft").css("height", NWSidebarLeftH - 2).css("min-height", NWSidebarLeftH - 2).css("max-height", NWSidebarLeftH - 2);
		$("#NWEdit").css("height", NWSidebarLeftH).css("min-height", NWSidebarLeftH).css("max-height", NWSidebarLeftH);
	}
	NW.window.resize();*/
	//$(window).resize(NW.window.resize);
	
	
	
	//}
	//NWRefreshSidebarLeft();
	
	
	
	
	
	//NW.listener.bindKey("CTRL", "S", test, "a name");
	//NW.listener.bindKey("CMD", Key.S, test, "a name2");
	
	
	
	
	
	
	
	/*document.getElementById("NWRight").onclick = function(e) {
		console.log(document.getSelection());
	}
	document.onkeydown = function(e) {
		if (NW.keystrokes.checkKeystroke("ALT", "", "", e)) {
			console.log(document.getSelection().getRangeAt().cloneContents());
			console.log(document.getSelection().getRangeAt());
		}
	}*/
	// test:
	/*window.onmouseup = function(e) {
		console.log("hi");
		var args = {
			id: "NWQuickSelectAlignment"
		}
		NW.editor.functions.initQuickSelectOptions(args, e);
	}*/
	//console.log(NW.parseCssString("#id .class#id"));
	//console.log($(".NWEditPanelGroup").length);
	
	// Initialize all the buttons and functions
	/*(function() {
		NW.editor.buttons = {
			toggleEditPanel: (function(functions) {
				var buttons = NW.byClass("NWEditPanelToggle");
				for (var i = 0; i < buttons.length; i++) {
					NW.listener.bindButton(buttons[i], NW.editor.functions.toggleEditPanel);
				}
			})()
		};
	})();*/
	/*(function() {
		var buttons = NW.editor.buttons();
		for (var i = 0; i < buttons.length; i++) {
			var results = NW.byClass(buttons[i].className);
			for (var x = 0; x < results.length; x++) {
				NW.listener.bindButton(results[x], buttons[i].action);
			}
			console.log(NW.editor.buttons[i].action);
		}
		
		var buttons = NW.editor.buttons();
		console.log(buttons[0].action);
	})();*/
	
	
	//NWEditPage.document.onclick = function() {alert("hello3");};
	//document.getElementById("NWEditPage").onclick = NW.editor.checkQueryState;
	/*$(".NWEditable").click(NW.editor.checkQueryState);
	$(".NWEditable").mousedown(NW.editor.checkQueryState);
	$(".NWEditable").mouseup(NW.editor.checkQueryState);
	$(".NWEditable").keydown(NW.editor.checkQueryState);
	$(".NWEditable").keyup(NW.editor.checkQueryState);*/
	function NWAddEvents(iframe){
	  var events = new Array( "mousedown", "mouseup", "mouseout", "mouseover",
							  "click", "keydown", "keyup", "keypress" );
	  for(var i = 0; i < events.length; i++){
		if(iframe.contentDocument && iframe.contentDocument.addEventListener){
		  // DOM L2
		  iframe.contentDocument.addEventListener(events[i], function(oEvent){
			//NWQuickSelect(oEvent);
			//iframe.contentDocument.addEventListener("mousemove", NW.quickSelect.mousePosition, false);
			NW.editor.checkQueryState();
		  }, false);
		}else if(iframe.contentWindow && iframe.contentWindow.document &&
				 iframe.contentWindow.document.attachEvent){
		  // IE
		  iframe.contentWindow.document.attachEvent("on" + events[i], function(){
			NW.editor.checkQueryState();
		  });
		}
	  }
	  //iframe.contentDocument.oncontextmenu = function() {return false;};
	  //	iframe.contentDocument.onmousedown = NW.quickSelect.onmousedown;
	  //iframe.contentDocument.onmouseup = NW.quickSelect.onmouseup;
	  //window.onmouseup = NW.quickSelect.onmouseup;
	  
	  // Set up the keystrokes
	  NW.listener.onkeydown.page(iframe.contentDocument);
	}
	//document.addEventListener("contextmenu", function(e) { e.stopPropagation(); }, false);
	//document.addEventListener("mousedown", NWQuickSelect, false);
	//document.addEventListener("mouseup", NWQuickSelect, false);
	
	//document.oncontextmenu = function() {return false;};
	//document.onmousedown = NWQuickSelect;
	//document.onmouseup = NWQuickSelect;
	//window.onload = function() {
		
	//};
	
	//document.getElementById("NWEditPage").onload = function() {addEvents(document.getElementById("NWEditPage"));}
	//Finds all NWEditable and makes the contenteditable="true"
	//document.getElementById("NWEditPage").contentDocument.designMode="on";
	/*$.frameReady(function() {
		$(".NWEditable").attr("contenteditable", "true");
		
	}, "top.NWEditPage",
	{
		remote: true,
	}, function() {
		// Shorten typing
		NWEditPage = document.getElementById("NWEditPage").contentWindow;
		
		// I'm trying to make everything go through the keystrokes section
		 //NWAddEvents(document.getElementById("NWEditPage"));
	});
	*/
	/*$(".NWColorPicker").ColorPicker({
		color: "#ffffff",
		onShow: function (colpkr) {
			$(colpkr).toggle();
			return false;
		},
		
		onHide: function (colpkr) {
		$(colpkr).toggle();
		return false;
		},
		
		onChange: function (hsb, hex, rgb) {
			$(".NWColorPicker").css('background-color', '#' + hex);
		}
	});*/
	
	
	
	// Replaced by NW.editor.functions.editPanelA
	/*$("div#NWEditPanel a").click( function() {
		var command = $(this).attr("rel");
		if(command == "inserthtml" || command == "createLink")
			return;
		NWEditPage.document.execCommand(command,false,null);
		NW.editor.checkQueryState();
		$("#NWEditPage").focus();
	});*/
	
	// Replaced by NW.editor.functions.select
	/*$("div#NWEditPanel select").click(function() {
		var command = $(this).attr("name");
		var value = $(this).attr("value") || null;
		if(command == "fontsize") {*/
			/*
			*	1 = 10px
			*	2 = 13px
			*	3 = 16px
			*	4 = 18px
			*	5 = 24px
			*	6 = 32px
			*	7 = 48px
			*/
			/*value = parseInt(value);
			switch(value) {
				case 10:
					value = 1;
					break;
				case 13:
					value = 2;
					break;
				case 16:
					value = 3;
					break;
				case 18:
					value = 4;
					break;
				case 24:
					value = 5;
					break;
				case 32:
					value = 6;
					break;
				case 48:
					value = 7;
					break;
				default:
					value = 2;
					break;
			}
		}
		NWEditPage.document.execCommand(command,false,value);
		NW.editor.checkQueryState();
	});*/
	
	
	
	
	
	// Replaced by NW.editor.functions.colorPickerManual
	/*$("a.NWColorPickerManual").click(function() {
		var type = $(this).attr("rel");
		var title = $(this).attr("title");
		if (title.indexOf("background") != -1) {
			title = "Set the Background Color";
		} else if (title.indexOf("highlight") != -1) {
			title = "Set the Highlight Color";
		} else {
			title = "Set the Font Color";
		}
		var theThis = $(this);
		NW.colors.manualColor(type, title, theThis);*/
		/*switch(type) {
			case "hex":
				NW.colors.manualColor(type, title, theThis);
				//var color = prompt("Please insert a hexadecimal value");
				//if(!color.match("#"))
					//color = "#" + color;
				break;
			case "rgb":
				var color = prompt("Please insert an RGB value");
				if(!color.match(/rgb\(/gi)) {
					color = color.replace(/^\s+|\s+$/g, '');	// Trims whitespace
					var commaArray = color.split(",");			// Creates array from commas
					if(!commaArray[1]) {
						colorArray = color.split(/\s+/);		// If no commas, create array from space
						color = "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")";
					}
					else
						color = "rgb(" + color + ")";
				}
				color = NW.colors.RGB(color);
				NW.colors.manualColor(type, title, theThis);
				break;
			case "hsl":
				var color = prompt("Please insert an HSL value");
				color = NW.colors.HSL(color);
				break;
			case "hsv":
				var color = prompt("Please insert an HSV value");
				color = NW.colors.HSV(color);
				break;				
		}*/
		/*if(color)
			jQuery.farbtastic( $(this).parent().children("div.NWColorPickerWindow").children("div.NWDraggableBody").children("div.NWColorPicker") ).setColor(color);
		NW.colors.colorChange($(this).parent().children("a.NWColorPicker").attr("rel"));*/
	//});
	
	
	
	// Replaced with NW.editor.functions.initFontFamily and NW.editor.functions.setFontFamily
	// Change Font Family
	/*$("select.NWSetFontFamily").children().each(function() {
		$(this).css("font-family",$(this).attr("value"));
	});
	$("select.NWSetFontFamily").click(function() {
		$(this).children().each(function() {
			if($(this).attr("selected"))
				$(this).parent().css("font-family",$(this).css("font-family"));
		});
	});*/
	
	
	// Replaced by NW.editor.functions.createLink
	// Create Link
	/*$("a.NWCreateLink").click(function() {
		var command = $(this).attr("rel");
		NW.windows.openInputWindow("NWLink", command);
		//var url = prompt("Please insert the full url (including http://) of the web page you want to link to");
		//if (url) NWEditPage.document.execCommand(command,false,url);
		//NW.editor.checkQueryState();
		//$("#NWEditPage").focus();
	});*/
	
	// Replaced by NW.editor.functions.customHTML
	// Insert Custom HTML
	/*$("a.NWInsertCustomHTML").click(function() {
		var selection = "";
		var command = $(this).attr("rel");
		if(!$(this).next().children().attr("checked"))
			selection = NW.editor.checkQueryState();
		NW.windows.openInputWindow("NWCustomHTML", command, selection);*/
		/*var html = prompt("Please insert a valid HTML snippet\ne.g. <span style=\"color: #ffffff;\">");
		if (html) NWEditPage.document.execCommand(command,false,html+selection);
		NW.editor.checkQueryState();
		$("#NWEditPage").focus();*/
	//});
	
	
	
	
	
	
	
	
	/*$(".hideRight").toggle(
			function() {
				$("#NWRight").animate({width: "0%"}, 0);
				$("#NWLeft").animate({width: "100%"}, 0);
			},
			function() {
				$("#NWRight").animate({width: "25%"}, 0);
				$("#NWLeft").animate({width: "75%"}, 0);
			}
		);*/
	//$(this).parent().children(".NWRowCategory").css({visibility: "hidden"});
});