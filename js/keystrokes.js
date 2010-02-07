NW.keystrokes = {
	NWQuickSelect: [
		{
			name: "Basic",
			modifiers: "CMD",
			keyCode: "",
			"click": "LEFT"
		},
		{
			name: "Other",
			modifiers: "CMD ALT",
			keyCode: "",
			"click": "LEFT"
		}
	],
	general: [
		NW.listener.bindKey("CMD", Key.S, NW.io.save, "Save open file"),
		
		NW.listener.bindKey("CMD", Key.E, NW.editor.functions.toggleEditPanel, "Close Edit Panel"),
		NW.listener.bindKey("CMD", Key.W, NW.editor.functions.closeWindow, "Close Window"),
		//NW.listener.bindKey("CMD", Key.O, NW.io.openDialog, "Open File"),
		
		NW.listener.bindKey("CMD SHIFT", Key.P, NW.editor.functions.confirmPublishPage, "Publish File"),
		
		NW.listener.bindKey("CMD", Key.B, function() { NW.editor.functions.fireCommand("bold", false, null); }, "Bold"),
		NW.listener.bindKey("CMD", Key.L, NW.editor.functions.createLink, "Create Link"),
		
		// Assign a shortcut for all functions that use Enter
		NW.listener.bindKey("", Key.ENTER, NW.onenterpress, "Enter Press"),
		
		NW.listener.bindKey("ALT", "", NW.onoptiondown, "Option Press", "keydown"),
		NW.listener.bindKey("ALT", "", NW.onoptionup, "Option Press", "keyup"),
		
		// Templates Window Keystrokes
		NW.listener.bindKey("", Key.LEFT_ARROW, NW.templates.moveSelectorLeft, "Move Selector Left"),
		NW.listener.bindKey("", Key.RIGHT_ARROW, NW.templates.moveSelectorRight, "Move Selector Right"),
		NW.listener.bindKey("", Key.UP_ARROW, NW.templates.moveSelectorUp, "Move Selector Up"),
		NW.listener.bindKey("", Key.DOWN_ARROW, NW.templates.moveSelectorDown, "Move Selector Down")
	],

	checkKeystroke: function(modifiers, keyCode, click, e) {
		var ctrlKey = (modifiers.toUpperCase().indexOf("CTRL") != -1);
		var altKey = (modifiers.toUpperCase().indexOf("ALT") != -1);
		var metaKey = (modifiers.toUpperCase().indexOf("META") != -1) || (modifiers.toUpperCase().indexOf("APPLE") != -1);
		var shiftKey = (modifiers.toUpperCase().indexOf("SHIFT") != -1);
	
		// Check for the platform specific key type
		// The magic "CMD" means metaKey for Mac (the APPLE or COMMAND key)
		// and ctrlKey for Windows (CONTROL)
		if (modifiers.toUpperCase().indexOf("CMD") != -1) {
			if (isMac()) {
				metaKey = true;
			} else {
				ctrlKey = true;
			}
		}
		
		// Check if the key has been just lifted up and if it should have been there
		// Work-arounds: there has to be a better way!
		if (e.type.toUpperCase().indexOf("KEY") != -1
			&& (e.keyCode == 17
			|| e.keyCode == 18
			|| e.keyCode == 224
			|| e.keyCode == 16
			)
		) {
			
			if (ctrlKey && e.keyCode != 17) return false;
			if (altKey && e.keyCode != 18) return false;
			if (metaKey && e.keyCode != 224) return false;
			if (shiftKey && e.keyCode != 16) return false;
		} else {
		
			// Check if the key is supposed to be pressed and if it is pressed
			if (ctrlKey && !e.ctrlKey) return false;
			if (altKey && !e.altKey) return false;
			if (metaKey && !e.metaKey) return false;
			if (shiftKey && !e.shiftKey) return false;
		}
		
		// Check if the key isn't supposed to be pressed and if it is pressed
		if (!ctrlKey && e.ctrlKey) return false;
		if (!altKey && e.altKey) return false;
		if (!metaKey && e.metaKey) return false;
		if (!shiftKey && e.shiftKey) return false;
		
		// Check keys
		if (keyCode != "" && e.keyCode != keyCode) return false;
		
		// Check clicks
		var leftClick = (click.toUpperCase().indexOf("LEFT") != -1);
		var rightClick = (click.toUpperCase().indexOf("RIGHT") != -1);
		
		if (!e) var e = window.event;
		
		if (e.which) leftClicked = (e.which == 1);
		else if (e.button) leftClicked = (e.button == 0);
		
		if (e.which) rightClicked = (e.which == 3);
		else if (e.button) rightClicked = (e.button == 2);
		
		if (leftClick && !leftClicked) return false;
		if (rightClick && !rightClicked) return false;
		
		if (!leftClick && leftClicked) return false;
		if (!rightClick && rightClicked) return false;
		
		// If everything went well, that means all the modifier keys were pressed
		return true;
	}
};