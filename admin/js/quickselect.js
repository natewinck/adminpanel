NW.quickSelect = {
	mousePosition: function(e, draw, useWindow) {
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		}
		// posx and posy contain the mouse position relative to the document
		// Do something with this information
		//document.getElementById("test").innerHTML = posx + ", " + posy;
		if(draw == null) var draw = true;
		if(draw)
			NW.quickSelect.drawQuickSelectButtons(e, useWindow);
		
		return {"x": posx, "y": posy};
	},
	
	fixCanvas: function(ctx) {
		// Thank you Bespin!
		if (!ctx.fillText && ctx.mozDrawText) {
			ctx.fillText = function(textToDraw, x, y, maxWidth) {
				ctx.translate(x, y);
				ctx.mozTextStyle = ctx.font;
				ctx.mozDrawText(textToDraw);
				ctx.translate(-x, -y);
			};
		}
		// * Setup measureText
		if (!ctx.measureText && ctx.mozMeasureText) {
			ctx.measureText = function(text) {
				if (ctx.font) ctx.mozTextStyle = ctx.font;
				var width = ctx.mozMeasureText(text);
				return { width: width };
			};
		}
	
		// * Setup html5MeasureText
		if (ctx.measureText && !ctx.html5MeasureText) {
			ctx.html5MeasureText = ctx.measureText;
			ctx.measureText = function(text) {
				var textMetrics = ctx.html5MeasureText(text);
	
				// fake it 'til you make it
				textMetrics.ascent = ctx.html5MeasureText("m").width;
	
				return textMetrics;
			};
		}
	
		// * for other browsers, no-op away
		if (!ctx.fillText) {
			ctx.fillText = function() {};
		}
	
		if (!ctx.measureText) {
			ctx.measureText = function() { return 10; };
		}
	},
	
	getCanvasCorner: function(e, canvas) {
		// First get the global x y position of the mouse
		var mousePos = NW.quickSelect.mousePosition(e, false);
		
		// Find the x y position of the mouse inside the canvas
		var canvasW = canvas.width;
		var canvasH = canvas.height;
		
		// Find the difference to use
		// It finds the x y position of the top left corner of the canvas
		// To track mouse movement, subtract the difference from that position
		return {x: mousePos.x - (canvasW / 2), y: mousePos.y - (canvasH / 2)};
		//alert(NWCanvasCorner.x);
	},
	
	setupCTX: function(ctx) {
		if(!ctx.roundedRect) {
			ctx.roundedRect = function (x,y,width,height,radius) {
				ctx.beginPath();
				ctx.moveTo (x, y + radius);
				ctx.lineTo (x, y + height - radius);
				ctx.quadraticCurveTo (x, y + height, x + radius, y + height);
				ctx.lineTo (x + width - radius, y + height);
				ctx.quadraticCurveTo (x + width, y + height, x + width, y + height - radius);
				ctx.lineTo (x + width, y + radius);
				ctx.quadraticCurveTo (x + width, y, x + width - radius, y);
				ctx.lineTo (x + radius, y);
				ctx.quadraticCurveTo (x, y, x, y + radius);
				ctx.fill();
			};
		}
		
		if (!ctx.drawButtons) {
			ctx.drawButtons = function (middle, radius, line, prevTrueAngle, trueAngle, initClick, initCheckButtons, checkButtons, theme) {
				var button, textWidth, selected, left, right, top, bottom;
				var buttonWidth = 0;
				var tempLeft, tempRight, tempTop, tempBottom, tempButtonWidth;
				buttonSelected = false;
				var selected = false;
				var buttonIsSelected = false;
				
				// Figure out the width of all the buttons
				var padding = 10;
				var image = {
					width: 20,
					height: 20,
					padding: 0
				};
				for (var i = 0; i < NW.quickSelect.buttons.buttons.length; i++) {
					button = NW.quickSelect.buttons.buttons[i];
					ctx.font = theme.norm.font;
					tempButtonWidth = ctx.measureText(button.name).width + (padding * 2) + image.width + (image.padding * 2);
					if (tempButtonWidth > buttonWidth)	buttonWidth = tempButtonWidth;
				}
				
				for (var i = 0; i < NW.quickSelect.buttons.buttons.length; i++) {
					button = NW.quickSelect.buttons.buttons[i];
					
					// Set the height of all the buttons
					button.height = 30;
					// Set the the button width to the width of the widest button
					button.width = buttonWidth;
					
					// Set the selection to false
					selected = false;
					
					/*left = button.x + middle.x;
					right = left + button.width;
					top = middle.y - button.y;
					bottom = top + button.height;*/
					
					/*if (buttonIsSelected) {
						// If a button is selected, that means none of the others are.
						selected = false;
					}*/
					// Check to see if this button was selected the last time
					var wasSelected = false;
					if (button.selected) wasSelected = true;
					
					// Find the angle for the button
					var angle = i * 45;
					var radians = angle * Math.PI / 180;
					// Position the button
					/*if (angle % 180 == 0) {
						var offset = {
							x: button.width + 20,
							y: 0
						};
					} else if (angle % 90 == 0) {
						var offset = {
							x: button.width / 2,
							y: button.height + 20
						};
					} else {
						var offset = {
							x: button.width + 20,
							y: button.height + 20
						};
					}
					
					if (angle >= 90 && angle <= 270) offset.x = -offset.x;
					if (angle >= 180 && angle <= 360) offset.y = -offset.y;*/
					
					
					var separation = 30;
					var theButton = {
						left: 0,
						right: button.width,
						top: button.height,
						bottom: 0
					};
					var buttonMiddle = radius + (button.width / 2) + 40;
					var buttonCorner = radius + 20;
					if (angle % 180 == 0) {
						// If the button is on the left or right side, find the x y position accordingly
						var offset = {
							x: (radius + separation + (button.width / 2)) * Math.cos(radians),
							y: button.height / 2
						};
						
						offset.x -= button.width / 2;
					} else if (angle % 90 == 0) {
						// If the button is on the top or bottom, find the x y position accordingly
						var offset = {
							x: -button.width / 2,
							y: (radius + separation + (button.height / 2)) * Math.sin(radians)
						};
						offset.y += button.height / 2;
					} else {
						// If the button is at a 45 degree angle, find the x y position accordingly
						separation -= 25;  // These buttons are close to the middle than the others
						if (angle == 45) {
							var offset = {
								x: (radius + separation) * Math.cos(radians),
								y: (radius + separation) * Math.sin(radians)
							};
							offset.y += button.height;
						} else if (angle == 135) {
							var offset = {
								x: (radius + separation) * Math.cos(radians),
								y: (radius + separation) * Math.sin(radians)
							};
							offset.x -= button.width;
							offset.y += button.height;
						} else if (angle == 225) {
							var offset = {
								x: (radius + separation) * Math.cos(radians),
								y: (radius + separation) * Math.sin(radians)
							};
							offset.x -= button.width;
						} else if (angle == 315) {
							var offset = {
								x: (radius + separation) * Math.cos(radians),
								y: (radius + separation) * Math.sin(radians)
							};
						}
					}
					//// BRING BACK console.log("i = " + i + " " + angle + " or " + trueAngle);
					
					// Only check if a button is selected after it is outside the circle
					if (checkButtons) {
						if (angle == trueAngle) selected = true;
					}
						
						//// BRING BACK console.log(offset.x + ", " + offset.y);
						
						// Check to see if the current button is selected
						// First see if the mouse is inside the button.  If so, it's selected.  If not,
						// it will temporarily not make it selected
						/*for (var a = 0; a < NW.quickSelect.buttons.buttons.length && !selectedButton; a++) {
							var tempButton = NW.quickSelect.buttons.buttons[a];
							
							tempLeft = tempButton.x + middle.x;
							tempRight = tempLeft + tempButton.width;
							tempTop = middle.y - tempButton.y;
							tempBottom = tempTop + tempButton.height;
							
							if ( (mousePos.x >= tempLeft && mousePos.x <= tempRight) && (mousePos.y >= tempTop && mousePos.y <= tempBottom) ) {
								//selected = true;
								selectedButton = tempButton;
							}
						}
						if (button == selectedButton) {
							selected = true;
							selectedButton = null;
						} else {
							selected = false;
						}*/
						
						// Check to see if the line goes through the button
						/*if (!selected) {
							var lengthTraveled = 0;
							var y = 0;
							var x = 0;
							var tempX, tempY;
							while ( (x <= riseRun.x && y <= riseRun.y) && !selected ) {
								// Remember, you can't divide by zero, so...
								if (riseRun.x == 0 || riseRun.y == 0) {
									if (riseRun.x == 0 && riseRun.y == 0) {
										// If both are zero, then you are at the very middle
										tempX = 0;
										tempY = 0;
										// No need to continue after the current iteration
										x++;
										y++;
									}
									if (riseRun.x == 0) {
										tempX = 0;
										tempY = y;
										// Continue up the line
										y++;
									} else if (riseRun.y == 0) {
										tempX = x;
										tempY = 0;
										// Continue over the line
										x++;
									}
								} else if (riseRun.x >= riseRun.y) {
									// Uses ratio y:x = y:1  ;  Finds y
									// (x * rise) / run = y
									// Then, with x and y, do a2 + b2 = c2
									tempY = (x * riseRun.y) / riseRun.x;
									tempX = x;
									y = tempY;
									x++;
								} else if (riseRun.y > riseRun.x) {
									// Uses ratio x:y = x:1  ;  Finds x
									// (y * run) / rise = x
									// Then, with x and y, do a2 + b2 = c2
									tempX = (y * riseRun.x) / riseRun.y;
									tempY = y;
									x = tempX;
									y++;
								}
								
								if (mousePos.y < middle.y) tempY = -tempY;
								if (mousePos.x < middle.x) tempX = -tempX;
								
								// So far, the x and y positions are relative to the width and height of the "triangle"
								// Now to find the "real" x y position by adding it to the middle
								tempY += middle.y;
								tempX += middle.x;
								
								// I can use this method to figure out if I'm at the end of the line
								// But for now, I'll keep it the way it is
								//lengthTraveled = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
								
								for (var z = 0; z < NW.quickSelect.buttons.buttons.length && !selectedButton; z++) {
									tempButton = NW.quickSelect.buttons.buttons[z];
									
									tempLeft = tempButton.x + middle.x;
									tempRight = tempLeft + tempButton.width;
									tempTop = middle.y - tempButton.y;
									tempBottom = tempTop + tempButton.height;
									
									// Check to see if the current point is inside the current button
									if ( (tempX >= tempLeft && tempX <= tempRight) && (tempY >= tempTop && tempY <= tempBottom) ) {
										//selected = true;
										var selectedButton = tempButton;
									}
								}
								if (button == selectedButton) {
									selected = true;
									selectedButton = null;
								}
							}
						}
					}*/
					// If the arrow is pointing to a different point, reset the two buttons that changed
					var resetButton = false;
					if (prevTrueAngle != trueAngle && checkButtons) {
						if (prevTrueAngle == angle || trueAngle == angle) resetButton = true;
					}
					// Draw the buttons the first time...
					// Draw the buttons that changed if the angle changed...
					// Draw the button that is selected if the cursor just moved out of the circle...
					// Draw the button that is selected if the cursor just moved into the circle...
					if (initClick || resetButton || (initCheckButtons && selected) || (initCheckButtons && wasSelected)) {
						// Clear the button first
						ctx.clearRect(offset.x + middle.x, -offset.y + middle.y, button.width, button.height);
						// Draw the background
						(selected) ? ctx.fillStyle = theme.hover.bg : ctx.fillStyle = theme.norm.bg;
						//ctx.roundedRect(button.x + middle.x, 0 - button.y + middle.y, button.width, button.height, 10);
						ctx.roundedRect(offset.x + middle.x, 0 - offset.y + middle.y, button.width, button.height, 7);
						
						// Draw the image...
						// All the images are preloaded when the page loads; but, just to check:
						if (typeof NW.quickSelect.buttons.buttons[i].image === "object") {
							ctx.drawImage(NW.quickSelect.buttons.buttons[i].image, offset.x + middle.x + padding + image.padding, -offset.y + middle.y + (button.height / 2) - (image.height / 2));
						}
						//ctx.fillStyle = theme.hover.bg;
						//ctx.fillRect(offset.x + middle.x + padding + image.padding, -offset.y + middle.y + (button.height / 2) - (image.height / 2), 20, 20);
						
						// Draw the text...
						(selected) ? ctx.fillStyle = theme.hover.textColor : ctx.fillStyle = theme.norm.textColor;
						ctx.font = theme.norm.font;
						
						textWidth = ctx.measureText(button.name);
						
						ctx.fillText(button.name, offset.x + middle.x + ((button.width + (padding + image.width + (image.padding * 2))) / 2) - (textWidth.width / 2), -offset.y + middle.y + (button.height / 2) + 5);
						// Set if a button has been selected
						if (selected) buttonIsSelected = true;
						// Set the selection state of the button
						button.selected = selected;
					}
				}
			}
		}
	},
	
	buttons: {
		init: function() {
			function onPreload(images, numImages) {
				if (numImages != images.length) {
					//return;
				}
				/*for (var x = 0; x < NW.quickSelect.buttons.buttons.length; x++) {
					NW.quickSelect.buttons.buttons[x].image = images[x];
				}*/
				var imageID = 0;
				for (var z = 0; z < NW.quickSelect.buttons.menuSets.length; z++) {
					for (var i = 0; i < NW.quickSelect.buttons.menuSets[z].buttons.length; i++) {
						if (NW.quickSelect.buttons.menuSets[z].buttons[i].image != "") NW.quickSelect.buttons.menuSets[z].buttons[i].image = images[imageID];
						imageID++;
					}
				}
			}
			var imageID = 0;
			var images = [];
			for (var z = 0; z < this.menuSets.length; z++) {
				
				for (var i = 0; i < this.menuSets[z].buttons.length; i++) {
					if (this.menuSets[z].buttons[i].image != "") images[imageID] = this.menuSets[z].buttons[i].image;
					imageID++;
				}
			}
			this.images = images;
			var imageSet = new ImagePreloader(images, onPreload);
		},
		chooseMenu: function(menu) {
			if (menu) {
				for (var i = 0; i < this.menuSets.length; i++) {
					if (this.menuSets[i].name == menu) this.buttons = this.menuSets[i].buttons;
				}
			}
		},
		menuSets: [
			{
				name: "Basic",
				buttons: [
					{
						name: "Bold",
						x: -215,
						y: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/bold.png",
						selected: false
					},
					{
						name: "Italic",
						x: -105,
						y: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/italic.png",
						selected: false
					},
					{
						name: "Underline",
						x: 5,
						y: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/underline.png",
						selected: false
					},
					{
						name: "Strikethrough",
						x: 115,
						y: 120,
						//width: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/strikethrough.png",
						selected: false
					},
					{
						name: "Superscript",
						x: 115,
						y: 120,
						//width: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/super.png",
						selected: false
					},
					{
						name: "Subscript",
						x: 115,
						y: 120,
						//width: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/sub.png",
						selected: false
					},
					{
						name: "Bulleted List",
						x: 115,
						y: 120,
						//width: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/ul.png",
						selected: false,
						command: "insertunorderedlist"
					},
					{
						name: "Numbered List",
						x: 115,
						y: 120,
						//width: 120,
						width: 100,
						height: 40,
						image: "images/NWQuickSelect/ol.png",
						selected: false,
						command: "insertorderedlist"
					}
				]
			},
			{
				name: "Other",
				buttons: [
					{
						name: "Alignment",
						image: "images/NWQuickSelect/alignment.png",
						callback: NW.editor.functions.initQuickSelectOptions,
						args: {
							id: "NWQuickSelectAlignment"
						}
						//command: "bold"
					},
					{
						name: "Insert Image",
						callback: NW.editor.functions.insertImage
					}
				]
			}
		]
	},
	
	
	initialClick: true,
	drawQuickSelectButtons: function(e, useWindow) {
		
		//NWCanvasCorner = corner;
		// First get the global x y position of the mouse
		var mousePos = NW.quickSelect.mousePosition(e, false);
		
		// We'll be using this in a little bit
		var currentMousePos;
		
		// Find the x y position of the mouse inside the canvas
		var canvasW = document.getElementById("NWQuickSelectCanvas").width;
		var canvasH = document.getElementById("NWQuickSelectCanvas").height;
		// Delete the 'px' (no longer needed since it doesn't use css)
			//canvasW = canvasW.replace(/px/gi, "");
			//canvasH = canvasH.replace(/px/gi, "");
		
		var initClick = false;
		
		// When inside an iframe, the x y position is figured out relative to that document, not to the iframe object
		// So, if the user clicked farther down on the page inside the iframe, I need to figure out the difference
		// to reset it.
		// Subtract the scroll offset of x and y from the mouse position
		iframe = document.getElementById("NWEditPage").contentWindow;
		mousePos.x -= iframe.scrollX;
		mousePos.y -= iframe.scrollY;
		
		
		if (NW.quickSelect.initialClick) {
			// Next two functions are needed to find the "real" x y position of the mouse
			// Find the width of the left sidebar
			NWSidebarW = document.getElementById("NWSidebarLeft").clientWidth;
			NWSidebarW = parseInt(NWSidebarW);
			
			// Find the height of anything above the iframe
			NWEntryH = (document.getElementById("NWListEditor").style.display != "none")
							? $("#NWListEditor").css("height")
							: 0; // Find the height of the list editor
			NWEntryH = parseInt(NWEntryH);
			
			
			// Find the difference to use
			// It finds the x y position of the top left corner of the canvas
			// To track mouse movement, subtract the difference from that position
			//NWCanvasCorner = {x: mousePos.x - (canvasW / 2), y: mousePos.y - (canvasH / 2)};
			//// BRING BACK console.log("before " + initMousePos.x);
			initMousePos = {x: mousePos.x + NWSidebarW, y: mousePos.y + NWEntryH};
			NW.quickSelect.initialClick = false;
			snapAngle = null;
			lineLength = 0;
			initClick = true;
		}
		
		
		// Change the cursor to the default
		document.body.style.cursor = "default";
		
		// Figure out the offset for Firefox (the first click in Firefox uses the x y position of the iframe;
		// When you move the mouse it uses the x y  position of the window
		if (useWindow) {
			// Revert back to not using the scroll offset
			mousePos.x += iframe.scrollX;
			mousePos.y += iframe.scrollY;
			// Pull the x y position back to the top left corner of the iframe
			mousePos.x -= NWSidebarW;
			mousePos.y -= NWEntryH;
		}
		
		// Find the current mouse position
		currentMousePos = {x: mousePos.x + NWSidebarW, y: mousePos.y + NWEntryH};
		
		// Time to draw
		var canvas = document.getElementById("NWQuickSelectCanvas");
		if (canvas.getContext) {
			var ctx = canvas.getContext("2d");
			
			// Fix it for Firefox
			NW.quickSelect.fixCanvas(ctx);
			NW.quickSelect.setupCTX(ctx);
			
			//ctx.clearRect(0, 0, canvasW, canvasH);
			
			
			/*ctx.fillStyle = "rgb(200,0,0)";
			ctx.fillRect (10, 10, 55, 50);
			
			ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
			ctx.fillRect (30, 30, 50, 50);*/
			
			//ctx.fillStyle = "white";
			//ctx.font = "Helvetica";
			//ctx.fillText (mousePos.x + ", " + mousePos.y, 20, 30);
			
			// Find the length of the line using a2 + b2 = c2 and rise over run (yeah, you remember that)
			var riseRun = {x: Math.abs(currentMousePos.x - initMousePos.x), y: Math.abs(currentMousePos.y - initMousePos.y)};
			(typeof lineLength == "undefined") ? prevLineLength = null : prevLineLength = lineLength;
			lineLength = Math.sqrt( Math.pow(riseRun.x, 2) + Math.pow(riseRun.y, 2) );
			//ctx.fillText (lineLength, 50, 60);
			
			// Find the angle the line is facing
			var line = {
				x: currentMousePos.x - initMousePos.x,
				y: initMousePos.y - currentMousePos.y,
				length: lineLength
			};
			if (line.x == 0 && line.y > 0) {
				var angle = -Math.PI / 2;
			} else if (line.x == 0 && line.y < 0) {
				var angle = Math.PI / 2;
			} else  {
				var angle = Math.atan(line.y / line.x);
			}
			// Convert radians into degrees
			angle = (angle * 180) / Math.PI;
			
			if (line.x <= 0) {
				angle += 180;
			} else if (line.x > 0 && line.y < 0) {
				angle += 360;
			}
			// Find the snapped angle
			var tempSnapAngle = 0;
			var prevSnapAngle = (typeof snapAngle == "undefined") ? null : snapAngle;
			snapAngle = 0;
			while (tempSnapAngle < 360) {
				var bottomSnap = (tempSnapAngle == 0) ? 337.5 : tempSnapAngle - 22.5;
				if (tempSnapAngle == 0) {
					if (angle <= tempSnapAngle + 22.5 || angle > bottomSnap) {
						snapAngle = tempSnapAngle;
					}
				} else	if (angle <= tempSnapAngle + 22.5 && angle > bottomSnap) {
					snapAngle = tempSnapAngle;
				}
				tempSnapAngle += 45;
			}
			//// BRING BACK console.log(snapAngle);
			
			
			// Theme
			var theme = {
				//norm: {bg: "#666666", textColor: "white", font: "16px Lucida Grande"},
				//hover: {bg: "#ab5611", textColor: "white", font: "16px Lucida Grande"}
				norm: {bg: "rgba(0,0,0,.95)", textColor: "white", font: "14px Lucida Grande, Arial, Helvetica, sans-serif"},
				hover: {bg: "rgba(249,155,13,.95)", textColor: "black", font: "14px Lucida Grande, Arial, Helvetica, sans-serif"}
			};
			
			
			// Draw the center circle
			var centerRadius = 20;
			// If the pointer went outside the circle or into the circle...
			if ((prevLineLength >= centerRadius && lineLength < centerRadius) || (prevLineLength < centerRadius && lineLength >= centerRadius) || (prevSnapAngle != snapAngle && lineLength >= centerRadius) || initClick) {
				// Clear the middle
				var middleSquare = {
					x: initMousePos.x - centerRadius,
					y: initMousePos.y - centerRadius,
					width: centerRadius * 2,
					height: centerRadius * 2
				};
				ctx.clearRect(middleSquare.x, middleSquare.y, middleSquare.width, middleSquare.height);
				
				// Draw the circle
				ctx.beginPath();
				ctx.arc(initMousePos.x, initMousePos.y, centerRadius, 0, Math.PI * 2, true);
				
				// Figure out if the line is outside of the circle and color it accordingly
				if (lineLength >= centerRadius) {
					ctx.fillStyle = theme.norm.bg;
				} else {
					ctx.fillStyle = theme.hover.bg;
				}
				ctx.fill();
			}
			
			// Check to see if the cursor is outside the circle
			if (lineLength >= centerRadius) {
				var checkButtons = true;
			} else {
				var checkButtons = false;
			}
			// Check to see if the cursor has just gone into or gone out of the circle
			if ((prevLineLength >= centerRadius && lineLength < centerRadius) || (prevLineLength < centerRadius && lineLength >= centerRadius)) {
				var initCheckButtons = true;
			} else {
				var initCheckButtons = false;
			}
			
			// Draw the arrow in the circle
			// First check to see if the cursor is outside the circle and if it has just exited the circle or snapped to a different angle
			// Also, check to see if a button is where the arrow is pointing
			if (lineLength >= centerRadius && NW.quickSelect.buttons.buttons[snapAngle / 45] && (initCheckButtons || prevSnapAngle != snapAngle)) {
				// Convert the current snapped angle to radians
				var snapRadians = snapAngle * Math.PI / 180;
				// Set the angle the arrow's points are relative to the line and covert it to radians
				var arrowOffset = 140 * Math.PI / 180;
				var arrow = {height: 6};
				var arrow = {
					// Find the x y position of the top of the arrow
					x: Math.cos(snapRadians) * (centerRadius - 3),
					y: Math.sin(snapRadians) * (-centerRadius + 3),
					// Find the x y positions of the other two points of the arrow
					pointR: {x: arrow.height * Math.cos(-arrowOffset + snapRadians), y: -1 * arrow.height * Math.sin(-arrowOffset + snapRadians)},
					pointL: {x: arrow.height * Math.cos(arrowOffset + snapRadians), y: -1 * arrow.height * Math.sin(arrowOffset + snapRadians)}
				};
				// Draw the arrow
				ctx.fillStyle = theme.hover.bg;
				ctx.beginPath();
				ctx.moveTo(arrow.x + initMousePos.x, arrow.y + initMousePos.y);
				ctx.lineTo(arrow.pointR.x + initMousePos.x + arrow.x, arrow.pointR.y + initMousePos.y + arrow.y);
				ctx.lineTo(arrow.pointL.x + initMousePos.x + arrow.x, arrow.pointL.y + initMousePos.y + arrow.y);
				ctx.fill();
			}
			
			
			
			
			// Draw the buttons
			//ctx.roundedRect(initMousePos.x + 50, initMousePos.y + 50, 150, 30, 10);
			ctx.drawButtons(initMousePos, centerRadius, line, prevSnapAngle, snapAngle, initClick, initCheckButtons, checkButtons, theme);
			
			
			// Draw the line
			/*ctx.beginPath();
			//ctx.moveTo(canvasW / 2, canvasH / 2);
			ctx.moveTo(initMousePos.x, initMousePos.y);
			//ctx.lineTo(mousePos.x - NWCanvasCorner.x, mousePos.y - NWCanvasCorner.y);
			ctx.lineTo(currentMousePos.x, currentMousePos.y);
			ctx.closePath();
			ctx.stroke();*/
		}
	},
	
	onmousedown: function(e) {
		//var keystroke = NW.keystrokes.checkKeystroke("CMD", "", "LEFT", e);
		var i = 0;
		var keystroke = false;
		while (i < NW.keystrokes.NWQuickSelect.length && !keystroke) {
			var theKeystroke = NW.keystrokes.NWQuickSelect[i];
			keystroke = NW.keystrokes.checkKeystroke(theKeystroke.modifiers, theKeystroke.keyCode, theKeystroke.click, e);
			if (keystroke) var menu = theKeystroke.name;
			i++;
		}
		if (keystroke) {
			//var initPos  = NW.quickSelect.mousePosition(e);
			var NWQuickSelect = document.getElementById("NWQuickSelect");
			
			// Size the canvas to the window
			var clientW = window.innerWidth;
			var clientH = window.innerHeight;
			document.getElementById("NWQuickSelectCanvas").width = clientW;
			document.getElementById("NWQuickSelectCanvas").height = clientH;
			
			// Move the menu to the mouse
			/*
			NWQuickSelect.style.left = initPos.x + "px";
			NWQuickSelect.style.top = initPos.y + "px";
			*/
			// Show the menu after it's been moved and sized
			NWQuickSelect.style.display = "block";
			
			NW.quickSelect.buttons.chooseMenu(menu);
			
			// Draw the buttons before the user starts to move the mouse
			NW.quickSelect.drawQuickSelectButtons(e);
			
			// Firefox won't track over the canvas after a click in the iframe so...
			if (NW.browserDetect.browser == "Firefox" || true) { // Safari now uses the same system as Firefox, thus true
				window.onmousemove = function(e) {
					NW.quickSelect.mousePosition(e, true, true);
				}
				this.onmousemove = NW.quickSelect.mousePosition;
			} else
				this.onmousemove = NW.quickSelect.mousePosition;
			
			
			// Now for when the user release the click
			if (NW.browserDetect.browser == "Firefox" || true) { // Safari now uses the same system as Firefox, thus true
				window.onmouseup = NW.quickSelect.onmouseup;
			} else {
				this.onmouseup = NW.quickSelect.onmouseup;
				window.onmouseup = NW.quickSelect.onmouseup;
			}
			
			
			return false;
		} else
			NW.editor.checkQueryState();
	},
	
	// Now all the functions for when the user unclicks
	executeCommand: function(e) {
		var button, selectedButton, command;
		// First find the selected button
		for (var i = 0; i < NW.quickSelect.buttons.buttons.length && !selectedButton; i++) {
			button = NW.quickSelect.buttons.buttons[i];
			if (button.selected) selectedButton = button;
		}
		
		// If no button is selected, no need to keep going
		if (!selectedButton) return;
		
		// Then figure out if it needs a dialog box
		if (selectedButton.dialog) {
			// Code here
		}
		
		// Then figure out if the command is different than the name
		if (selectedButton.command) {
			command = selectedButton.command;
		} else {
			command = selectedButton.name.toLowerCase();
		}
		
		if (selectedButton.callback) {
			// Fire the callback with or without arguments
			(selectedButton.args) ? selectedButton.callback(selectedButton.args, e) : selectedButton.callback();
			// If there is no other command, end it.
			if (!selectedButton.command) return false;
		}
		
		NW.editor.functions.fireCommand(command,false,null);
	},
	
	onmouseup: function(e) {
		document.getElementById("NWEditPage").contentDocument.onmousemove = null;
		window.onmousemove = null;
		
		document.getElementById("NWEditPage").contentDocument.onmouseup = null;
		window.onmouseup = null;
		
		var NWQuickSelect = document.getElementById("NWQuickSelect");
		NW.quickSelect.initialClick = true;
		initMousePos = null;
		currentMousePos = null;
		// Now that the mouse is up, we don't need the menu anymore
		NWQuickSelect.style.display = "none";
		
		// Now to find out which button was selected
		NW.quickSelect.executeCommand(e);
		
		return false;
	}
};