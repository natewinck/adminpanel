NW.windows = {
	setupDraggable: function() {
		$(".NWDraggable").draggable({
			stack: {group: ".NWDraggable", min: 1 },
			cancel: ".NWDraggableClose, a, button, input, textarea",
			cursor: "default",
			addClasses: false,
			scroll: false,
			containment: "window",
			stop: function() {$("#NWEditPage").focus();}
		}).each(function() {
			if( $(this).css("position") == "relative" )
				$(this).css("position", "absolute"); // Work-around for Safari
		});
		$(".NWDraggable .NWDraggableToolbar .NWDraggableClose").click(function() {
			$(this).parent().parent().hide();
		});
	},
	
	// Set up the input windows
	openInputWindow: function(theClass, command, extra) {
		// Disable the window from popping up if another one is already up
		for (var i = 0; i < document.getElementsByClassName("NWInputWindow").length; i++) {
			if (document.getElementsByClassName("NWInputWindow")[i].style.display == "block") return;
		}
		
		// I need to know if the window is open
		NW.windows.inputWindowOpen = true;
		
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var position = {x: 0, y: 0};
		
		var theWindow = document.getElementsByClassName(theClass)[0].getElementsByClassName("NWInputWindow")[0];
		
		var zIndex = 0;
		for (var i = 0; i < document.getElementsByClassName("NWDraggable").length; i++) {
			var tempWindow = document.getElementsByClassName("NWDraggable")[i];
			if (parseInt(tempWindow.style.zIndex) >= zIndex && tempWindow != theWindow) {
				zIndex = parseInt(tempWindow.style.zIndex);
			}
		}
		theWindow.style.zIndex = zIndex + 1;
		
		theWindow.style.display = "block";
		// Reset the position of the window
		position.y = (windowHeight / 2) - (theWindow.clientHeight);
		position.x = (windowWidth / 2) - (theWindow.clientWidth / 2);
		
		theWindow.style.position = "fixed";
		theWindow.style.top = position.y + "px";
		theWindow.style.left = position.x + "px";
		
		// Open the window and get the initial value of the input
		var inputWindow = $("." + theClass + " .NWDraggable.NWInputWindow");
		
		// Disable the click so it doesn't keep adding up
		//// BRING BACK console.log(inputWindow[0].getElementsByClassName("NWDone")[0].onclick);
		
		var originalVal = theWindow.getElementsByTagName("input")[0].value;
		extra = extra || "";
		
		theWindow.getElementsByTagName("input")[0].focus();
		
		NW.windows.inputWindowArgs = {
			theWindow: theWindow,
			command: command,
			extra: extra,
			originalVal: originalVal
		};
			
		// When the user clicks done, get the value of the input, hide the window, and restore the original value
		if(!theWindow.getElementsByClassName("NWDone")[0].onclick) {
			theWindow.getElementsByClassName("NWDone")[0].onclick = function() {
				NW.windows.closeInputWindow(theWindow, command, extra, originalVal);
			};
		}
		
		//if(!theWindow.getElementsByTagName("input")[0].onkeypress) {
		/*	theWindow.getElementsByTagName("input")[0].addEventListener("keypress", function(e) {
				//// BRING BACK console.log("HI");
				if (e.which == Key.ENTER) NW.windows.closeInputWindow(theWindow, command, extra, originalVal);
			}, true);
		//}*/
	},
	closeInputWindow: function(theWindow, command, extra, originalVal) {
		if (!NW.windows.inputWindowOpen) return true;
		NW.windows.inputWindowOpen = false;
		
		if (!theWindow) {
			var theWindow = NW.windows.inputWindowArgs.theWindow;
			var command = NW.windows.inputWindowArgs.command;
			var extra = NW.windows.inputWindowArgs.extra;
			var originalVal = NW.windows.inputWindowArgs.originalVal;
			
			NW.windows.inputWindowArgs = null;
		}
		
		var text = theWindow.getElementsByTagName("input")[0].value;
		NWEditPage.document.execCommand(command,false,text + extra);
		
		theWindow.style.display = "none";
		theWindow.getElementsByTagName("input")[0].value = originalVal;
		
		NW.editor.checkQueryState();
		document.getElementById("NWEditPage").focus();
		
		// Disable the click so it doesn't keep adding up
		theWindow.getElementsByClassName("NWDone")[0].onclick = null;
	}
};