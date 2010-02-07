NW.dragNumber = {
	findFunction: function(path) {
		var pathArray = path.split(".");
		// BRING BACK console.log(this);
		var finalFunction = false;
		for (var i = 0; i < pathArray.length; i++) {
			if (i == 0) {
				// The first one needs to use the "this" command
				finalFunction = window[pathArray[i]];
			} else {
				// ...the rest, I just use the last value of the variable
				finalFunction = finalFunction[pathArray[i]];
			}
		}
		
		return finalFunction;
	},
	decrementNumber: function(e) {
		e.preventDefault();
		var theFunction = NW.dragNumber.findFunction(this.name);
		theFunction({obj: this, numAdded: -1});
	},
	incrementNumber: function(e) {
		e.preventDefault();
		var theFunction = NW.dragNumber.findFunction(this.name);
		theFunction({obj: this, numAdded: 1});
	},
	onInputFocus: function(obj) {
		var obj = (obj.value != null) ? obj : this;
		obj.readOnly = false;
		//// BRING BACK console.log("here");
		//// BRING BACK console.log(obj);
		$(obj).addClass("NWHasFocus");
		obj.focus();
		obj.select();
		
		obj.removeEventListener("keypress", NW.dragNumber.onEnterPress, false);
		obj.addEventListener("keypress", NW.dragNumber.onEnterPress, false);
	},
	/*dragNumberInputDblClick: function(obj) {
		var obj = (obj.value != null) ? obj : this;
		obj.readOnly = false;
		
		obj.removeEventListener("keypress", NW.dragNumber.onEnterPress, false);
		obj.addEventListener("keypress", NW.dragNumber.onEnterPress, false);
	},*/
	onEnterPress: function(e) {
		if	(e.which == Key.ENTER) {
			this.blur();
			/*NW.dragNumber.dragNumberInputDblClick(this);
			this.focus();
			this.select();*/
			NW.dragNumber.onInputFocus(this);
			
			return true;
		}
	},
	onInputChange: function() {
		// BRING BACK console.log("change");
		var value = parseFloat(this.value);
		value = Math.round(value);
		
		var theFunction = NW.dragNumber.findFunction(this.name);
		theFunction({obj: this, setNum: value});
	},
	onInputBlur: function() {
		this.readOnly = true;
		// BRING BACK console.log("blur");
		$(this).removeClass("NWHasFocus");
	},
	ondragstart: function(e) {
		if ($(this).hasClass("NWHasFocus")) {
			// BRING BACK console.log("focused");
			return true;
		}
		e.preventDefault();
		NW.inputDrag = {};
		// Set the variables for where the mouse is intially
		NW.inputDrag.initMousePos = {
			x: e.clientX,
			y: e.clientY
		};
		
		NW.inputDrag.currentInput = this;
		NW.inputDrag.dragged = false;
		
		// Add an event listener to see if the mouse moves
		window.addEventListener("mousemove", NW.dragNumber.ondrag, false);
		
		// Add an event listener for when the mouse "mouseups"
		window.addEventListener("mouseup", NW.dragNumber.ondragend, false);
	},
	ondrag: function(e) {
		//e.preventDefault();
		NW.inputDrag.dragged = true;
		// Assign the current mouse position
		NW.inputDrag.currentMousePos = {
			x: e.clientX,
			y: e.clientY
		};
		//// BRING BACK console.log("init: " + NW.inputDrag.initMousePos.x);
		// BRING BACK console.log("current: " + NW.inputDrag.currentMousePos.x);
		
		
		var difference = NW.inputDrag.currentMousePos.x - NW.inputDrag.initMousePos.x;
		//// BRING BACK console.log(difference);
		var input = NW.inputDrag.currentInput;
		
		$(input).addClass("NWSelected");
		
		if (!NW.dragNumber.overAllDiv) {
			// Add a div over everything so the x y values stay the same over the iframe
			var overAllDiv = document.createElement("div");
			overAllDiv.style.position = "fixed";
			overAllDiv.style.left = 0;
			overAllDiv.style.top = 0;
			overAllDiv.style.width = window.innerWidth + "px";
			overAllDiv.style.height = window.innerHeight + "px";
			overAllDiv.style.background = "none";
			
			input.parentNode.appendChild(overAllDiv);
			NW.dragNumber.overAllDiv = overAllDiv;
		}
		
		// Now fire a function
		// Just so that it doesn't have to figure out the function every time...
		if (!this.currentFunction) {
			var theFunction = NW.dragNumber.findFunction(input.name);
			this.currentFunction = theFunction;
		}
		this.currentFunction({obj: input, numAdded: difference});
		
		/*switch (theFunction) {
			case "image":
				//NW.editor.functions.changeImageSize(direction, difference);
				// BRING BACK console.log(this["NW"]);
				break;
			case "margin":
				NW.editor.functions.imageMarginChange(difference);
		}*/
		
		
		// Assign the current mouse position to the initial one for the next time the mouse moves
		NW.inputDrag.initMousePos = NW.inputDrag.currentMousePos;
	},
	ondragend: function(e) {
		// If the mouse was not moved, focus on the input
		if (!NW.inputDrag.dragged) {
			NW.dragNumber.onInputFocus(NW.inputDrag.currentInput);
		}
		
		// Delete the class
		$(NW.inputDrag.currentInput).removeClass("NWSelected");
		
		// Remove div over everything
		if (NW.dragNumber.overAllDiv) {
			NW.dragNumber.overAllDiv.parentNode.removeChild(NW.dragNumber.overAllDiv);
			NW.dragNumber.overAllDiv = null;
		}
		
		// Delete the global variables
		NW.inputDrag = {};
		this.currentFunction = null;
		
		// Delete the listeners
		window.removeEventListener("mousemove", NW.dragNumber.ondrag, false);
		window.removeEventListener("mouseup", NW.dragNumber.ondragend, false);
	}
};