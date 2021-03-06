/*****
* All functions related to the editor will hopefully be in here someday
*
* Format: JSON
*
*****/
NW = {
	editor: {
		init: function() {
			var buttons = NW.editor.buttons();
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].id) {
					var result = NW.byId(buttons[i].id);
					NW.listener.bindButton(result, buttons[i].trigger, buttons[i].action);
				} else if (buttons[i].className) {
					var results = NW.byClass(buttons[i].className);
					for (var x = 0; x < results.length; x++) {
						NW.listener.bindButton(results[x], buttons[i].trigger, buttons[i].action);
					}
				} else {
					var results = NW.byJquery(buttons[i].jquery);
					for (var x = 0; x < results.length; x++) {
						NW.listener.bindButton(results[x], buttons[i].trigger, buttons[i].action);
					}
				}
			}
		},
		/****
		*
		*	All functions associated with the editor (which should be most)
		*
		*	The functions can have an event attached to them
		*
		****/
		functions: {
			fireCommand: function(command, useCss, text) {
				var succeeded = NWEditPage.document.execCommand(command, useCss, text);
				if (succeeded) {
					NW.editor.functions.refreshEditor();
				}
			},
			refreshEditor: function() {
				NW.editor.checkQueryState();
				NW.filesystem.changeToDraft();
				document.getElementById("NWEditPage").blur();
				document.getElementById("NWEditPage").focus();
			},
			setNWLeftSidebarNormalWidth: function(args) {
				NW.window.NWLeftSidebarNormalWidth = parseInt(args.obj.css("width"));
				
				NW.window.resize();
			},
			changeListEditorSize: function(args) {
				if (args) {
					if (!args.obj) {
						var args = {
							obj: $("#NWListEditor")
						};
					}
				} else {
					var args = {
						obj: $("#NWListEditor")
					};
				}
				
				// Make sure the list editor is not bigger than the NWEdit area
				var newHeight = parseInt(args.obj.css("height"));
				//if (newHeight > parseInt($("#NWEdit").css("height"))) args.obj.css("height", parseInt($("#NWEdit").css("height")) + "px");
				// Change the inside height
				var innerHeight = newHeight - 30;
				args.obj.children("#NWListEditorBox").css("height", innerHeight + "px");
				
				// Change the height of the iframe
				NW.window.resize();
			},
			initRightSidebar: function() {
				//$("#NWEditPanel").css("display", "block");
				NW.editor.functions.selectRightSidebarCategory($("#NWEditPanel")[0]);
			},
			selectRightSidebarCategory: function(obj) {
				var obj = (obj.target) ? obj.target : obj;
				// If the object is not in the right place, don't do anything
				if (!$(obj).parents("#NWSidebarRightCategoriesContainer")[0] && !$(obj).parents("#NWSidebarRightCategories")[0]) return false;
				
				
				
				if ($(obj).parents("#NWSidebarRightCategoriesContainer")[0]) { // If you are selecting via a category
					// Hide the other categories
					$("#NWSidebarRightCategoriesContainer > .NWSelected").removeClass("NWSelected").css("display", "none");
					// Show the category
					$(obj).addClass("NWSelected").css("display", "block");
					
					// Figure out the number of child this object is
					var categoryNum = $(obj).prevAll().length;
					
					// Remove the NWSelected class from the elements
					$("#NWSidebarRightCategories ul li a.NWSelected").removeClass("NWSelected");
					// Select the correct button based on the order of the buttons
					$("#NWSidebarRightCategories ul li:nth-child(" + (categoryNum + 1) + ") a").addClass("NWSelected");
				} else { // If you are selecting via a button
					// Deselect the other buttons
					$("#NWSidebarRightCategories ul li a.NWSelected").removeClass("NWSelected");
					// Select the button
					$(obj).parent().addClass("NWSelected"); // For some reason, the obj is a span element
					
					// Figure out the number of child this object is
					var categoryNum = $(obj).parent().parent().prevAll().length;
					
					// Remove the NWSelected class from the categories
					$("#NWSidebarRightCategoriesContainer > .NWSelected").removeClass("NWSelected").css("display", "none");
					// Show the correct category based on the order of the buttons
					$("#NWSidebarRightCategoriesContainer > div:nth-child(" + (categoryNum + 1) + ")").addClass("NWSelected").css("display", "block");
				}
			},
			addPageInfoRow: function(title, type, obj) {
				if ((title && title == "") || !obj) return false;
				var pageInfoTable = $("#NWPageInfo table")[0];
				// First create the row
				var row = pageInfoTable.insertRow(pageInfoTable.rows.length);
				
				// Add the title cell
				var titleCell = row.insertCell(0);
				titleCell.className = "NWPageInfoTitle";
				var textNode = document.createTextNode(title + ":");
				titleCell.appendChild(textNode);
				
				// Add the input cell
				var inputCell = row.insertCell(1);
				inputCell.className = "NWPageInfoInput";
				var inputElement = document.createElement("input");
				inputElement.type = type;
				inputCell.appendChild(inputElement);
				
				switch (type) {
					case "checkbox":
						var className = obj.className;
						var startTruePos = (className.indexOf("NWCheckboxPageInfoTrue") != -1)
												? className.indexOf("NWCheckboxPageInfoTrue") + 22
												: 0;
						var endTruePos = (className.indexOf("NWcheckboxPageInfoTrueZ") != -1)
												? className.indexOf("NWcheckboxPageInfoTrueZ")
												: 0;
						var trueText = className.substring(startTruePos, endTruePos);
						trueText = trueText.replace(/_/g, " ");
						
						var startFalsePos = (className.indexOf("NWCheckboxPageInfoFalse") != -1)
												? className.indexOf("NWCheckboxPageInfoFalse") + 23
												: 0;
						var endFalsePos = (className.indexOf("NWcheckboxPageInfoFalseZ") != -1)
												? className.indexOf("NWcheckboxPageInfoFalseZ")
												: 0;
						var falseText = className.substring(startFalsePos, endFalsePos);
						falseText = falseText.replace(/_/g, " ");
						
						// Initialize its checked state
						inputElement.checked = (obj.textContent == trueText) ? true : false;
						
						inputElement.addEventListener("change", function() {
							if (this.checked) {
								NW.editor.functions.updatePageInfo(obj, trueText);
							} else {
								NW.editor.functions.updatePageInfo(obj, falseText);
							}
						}, false);
						break;
					default: // Type == text
						// Initialize its value
						inputElement.value = obj.textContent;
						
						// Add listeners
						inputElement.addEventListener("keydown", function() {NW.editor.functions.updatePageInfo(obj, inputElement.value);}, false);
						// For some reason the keydown event is one step behind: it doesn't show the current value of the input
						inputElement.addEventListener("keyup", function() {NW.editor.functions.updatePageInfo(obj, inputElement.value);}, false);
						inputElement.addEventListener("dragend", function() {NW.editor.functions.updatePageInfo(obj, inputElement.value);}, false);
						break;
				};
				
				return inputElement;
			},
			updatePageInfo: function(obj, text) { // Update the page
				obj.innerHTML = "";
				obj.textContent = text;
				NW.filesystem.changeToDraft();
			},
			updatePageInfoInput: function(inputObj, text) { // Update the input
				inputObj.value = text;
			},
			clearPageInfoRows: function() {
				$("#NWPageInfo table")[0].innerHTML = "";
			},
			exitQuickSelectOptions: function() {
				var theWindow = this.parentNode.parentNode.parentNode;
				
				var command = this.rel;
				NW.editor.functions.fireCommand(command, false, null);
				
				// Hide the window
				theWindow.style.display = "none";
				// Prevent the # symbol from showing in the address bar
				return false;
			},
			initQuickSelectOptions: function(args, e) {
				var theWindow = document.getElementById(args.id);
				
				// Show the window so that the width and height functions will work
				theWindow.style.display = "block";
				
				var width = theWindow.clientWidth;
				var height = theWindow.clientHeight;
				
				var posX = theWindow.offsetLeft;
				var posY = theWindow.offsetTop;
				
				var mousePos = NW.quickSelect.mousePosition(e, false);
				
				var pageWidth = window.innerWidth;
				var pageHeight = window.innerHeight;
				
				// Set the position of the window
				var heightOffset = 35;
				// BRING BACK console.log(width);
				theWindow.style.left = mousePos.x - (width / 2) + "px";
				theWindow.style.top = mousePos.y - heightOffset + "px";
				
				// Check to see if the window is past the borders of the page
				if (mousePos.x - (width / 2) < 0) theWindow.style.left = 0;
				if (mousePos.x + (width / 2) > pageWidth) theWindow.style.left = pageWidth - width + "px";
				if (mousePos.y - heightOffset < 0) theWindow.style.top = 0;
				if (mousePos.y + height > pageHeight) theWindow.style.top = pageHeight - height + "px";
				
				// Set up the buttons
				var buttons = theWindow.getElementsByClassName("NWQuickSelectButtons")[0].children;
				for (var i = 0; i < buttons.length; i++) {
					var button = buttons[i];
					if (!button.onclick) button.onclick = NW.editor.functions.exitQuickSelectOptions;
				}
			},
			setNWRightNormalWidth: function(args) {
				NW.window.NWRightNormalWidth = parseInt(args.obj.css("width"));
				
				NW.window.resize();
			},
			openLoadingWindow: function(message) {
				message = message || "Loading...";
				$(".NWLoading .NWLoadingText").text(message);
				$(".NWLoading").animate({
					top: 0,
					height: "100%"
				});
			},
			closeLoadingWindow: function() {
				$(".NWLoading").animate({
					top: -135,
					height: 0
				});
			},
			openConfirmWindow: function(message, subMessage, callbackYes) {
				message = message || "Are you sure?";
				subMessage = subMessage || "This action cannot be undone.";
				$("#NWConfirm #NWConfirmHeader").text(message);
				$("#NWConfirm #NWConfirmText").text(subMessage);
				
				// Set the buttons up strictly
				document.getElementById("NWConfirmYes").onclick = null;
				document.getElementById("NWConfirmYes").onclick = function() {
					callbackYes();
					NW.editor.functions.closeConfirmWindow();
					document.getElementById("NWConfirmYes").onclick = null;
					document.getElementById("NWConfirmCancel").onclick = null;
				};
				document.getElementById("NWConfirmCancel").onclick = null;
				document.getElementById("NWConfirmCancel").onclick = NW.editor.functions.closeConfirmWindow;
				
				$("#NWConfirm").animate({
					top: 0,
					height: "100%"
				});
			},
			closeConfirmWindow: function() {
				$("#NWConfirm").animate({
					top: -parseInt($("#NWConfirmWindow").css("height")) - 60,
					height: 0
				});
				document.getElementById("NWConfirmYes").onclick = null;
				document.getElementById("NWConfirmCancel").onclick = null;
			},
			confirmWindowEnterPress: function() {
				// If the confirm window isn't open, no need for the function
				if (parseInt($("#NWConfirm").css("height")) == 0) return true;
				
				if (document.getElementById("NWConfirmYes").onclick) document.getElementById("NWConfirmYes").onclick();
			},
			confirmRevert: function() {
				var selected = NW.filesystem.getSelected() || null;
				//if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
				if ($(selected).children(".NWFile")[0]) selected = null;
				
				if (!selected) return false;
				
				NW.editor.functions.openConfirmWindow("Are you sure you want to revert the page \"" + selected.textContent + "\" to its current public state?", "This action cannot be undone and will delete any changes you have made so far.", NW.io.revert);
			},
			togglePublishPage: function() {
				var publishButton = $(".NWPublishSite .NWToolbarButtonName")[0];
				publishButton.textContent = "Publish Page";
			},
			togglePublishSite: function() {
				var publishButton = $(".NWPublishSite .NWToolbarButtonName")[0];
				publishButton.textContent = "Publish Site";
			},
			publishButton: function(e) {
				if (this.children[1].innerHTML.toUpperCase().indexOf("SITE") != -1) {
					NW.editor.functions.confirmPublishSite();
				} else {
					//NW.io.publishPage();
					NW.editor.functions.confirmPublishPage();
				}
			},
			confirmPublishPage: function() {
				var selected = NW.filesystem.getSelected() || null;
				//if ($(selected).hasClass("NWRowCategoryHeader")) selected = null;
				
				if (!selected) return false;
				
				if ($(selected).children(".NWFile")[0]) {
					// Confirm when the page is already saved
					NW.editor.functions.openConfirmWindow("Are you sure you want to publish \"" + selected.textContent + "\"?", "This file has already been published and no changes have been made to it.", NW.io.publishPage);
				} else {
					// Confirm to save the page
					NW.editor.functions.openConfirmWindow("Are you sure you want to publish \"" + selected.textContent + "\"?", "This action cannot be undone.", NW.io.publishPage);
				}
			},
			confirmPublishSite: function() {
				NW.editor.functions.openConfirmWindow("Are you sure you want to publish all drafts?", "This action cannot be undone.", NW.io.publishSite);
			},
			openSettings: function() {
				NW.io.save(null, true, false);
				location.href = "settings.php";
			},
			logOut: function() {
				NW.io.save(null, true, false);
				location.href = "php/logout.php";
			},
			toggleEditPanel: function() {
				if ($("#NWLeft").hasClass("NWRightClosed")) {
					$("#NWLeft").removeClass("NWRightClosed");
				} else {
					$("#NWLeft").addClass("NWRightClosed");
				}
				
				if ($("#NWRight").hasClass("NWRightClosed")) {
					$("#NWRight").removeClass("NWRightClosed");
				} else {
					$("#NWRight").addClass("NWRightClosed");
				}
				//document.getElementById("NWLeft").className = (document.getElementById("NWLeft").className == "NWRightClosed") ? "" : "NWRightClosed";
				//document.getElementById("NWRight").className = (document.getElementById("NWRight").className == "NWRightClosed") ? "" : "NWRightClosed";
				//$(".NWEditPanelToggle").click(function() {
					//$("#NWLeft").toggleClass("NWRightClosed");
					//$("#NWRight").toggleClass("NWRightClosed");
				NW.window.resize();
				return false;
				//});
			},
			editPanelA: function(e) {
				//$("div#NWEditPanel a").click( function() {
				var command = this.rel;
				if (command == "inserthtml" || command == "createLink" || command.indexOf("_") >= 0 || !command)
					return;
				NW.editor.functions.fireCommand(command,false,null);
				//document.getElementById("NWEditPage").contentWindow.document.execCommand(command, false, null);
				
				//document.getElementById("NWEditPage").blur();
				//document.getElementById("NWEditPage").focus();
				
				return false;
				//});
			},
			getFieldsDataArray: function() {
				var fieldsArray = {};
				var fieldClassName, startFieldPos, endFieldPos, fieldName, data;
				var startDataTypePos, endDataTypePos, dataType;
				$(NWEditPage.document.body).find(".NWfield, .NWEditableData").each(function() {
					data = null;
					
					fieldClassName = $(this)[0].className;
					
					// Data type
					startDataTypePos = fieldClassName.indexOf("NWData") + 6;
					endDataTypePos = fieldClassName.indexOf("NWdataZ");
					dataType = fieldClassName.substring(startDataTypePos, endDataTypePos);
					switch (dataType) {
						case "checkbox":
							var startTruePos = (fieldClassName.indexOf("NWCheckboxPageInfoTrue") != -1)
													? fieldClassName.indexOf("NWCheckboxPageInfoTrue") + 22
													: 0;
							var endTruePos = (fieldClassName.indexOf("NWcheckboxPageInfoTrueZ") != -1)
													? fieldClassName.indexOf("NWcheckboxPageInfoTrueZ")
													: 0;
							var trueText = fieldClassName.substring(startTruePos, endTruePos);
							trueText = trueText.replace(/_/g, " ");
							if (this.textContent == trueText) {
								data = true;
							} else {
								data = false;
							}
							break;
						case "image":
							if ($(this).attr("src") == "") break;
							var startAttrData = fieldClassName.indexOf("NWEditableAttr") + 14;
							var endAttrData = fieldClassName.indexOf("NWAttrZ");
							var attrData = fieldClassName.substring(startAttrData, endAttrData).split("_");
							var attrVal;
							data = {};
							for (var i = 0; i < attrData.length; i++) {
								attrVal = $(this).attr(attrData[i]);
								data[attrData[i]] = attrVal;
							}
							break;
						default: // Defaults as field
							var imageId = 0; // Does not correspond to the images actual id
							var imgsIds = [];
							// Go through first of all and delete the id's and other things from the imgs
							$(this).find("img").each(function() {
								imgsIds[imageId] = this.id;
								this.removeAttribute("id");
								this.style.removeProperty("cursor");
								imageId++;
							});
							
							data = $(this)[0].innerHTML;
							
							// Now go back through and replace the id's from the imgs
							imageId = 0;
							$(this).find("img").each(function() {
								this.id = imgsIds[imageId];
								imageId++;
							});
							break;
					};
					
					startFieldPos = fieldClassName.indexOf("NWField") + 7;
					endFieldPos = fieldClassName.indexOf("NWZ");
					fieldName = fieldClassName.substring(startFieldPos, endFieldPos);
					//fieldName = $(this)[0].id;
					
					fieldsArray[fieldName] = data;
					fieldsArray[fieldName + "Style"] = this.style.cssText;
				});
				
				return fieldsArray;
			},
			fireCustomCommand: function(commandName, text) {
				if (!commandName) return false;
				var command = NW.editor.commands[commandName];
				if (!command) return false;
				
				var userSelection;
				if (NWEditPage.getSelection) {
					userSelection = NWEditPage.getSelection();
				} else if (NWEditPage.document.selection) { // should come last; Opera!
					userSelection = NWEditPage.document.selection.createRange();
				}
				
				var rangeObject;
				if (userSelection.getRangeAt)
					rangeObject = userSelection.getRangeAt(0);
				else { // Safari!
					var range = document.createRange();
					range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
					range.setEnd(userSelection.focusNode, userSelection.focusOffset);
					rangeObject = range;
				}
				
				NW.filesystem.changeToDraft();
				
				if (command.applyToParent) {
					var foundElement = false;
					
					if ($(userSelection.focusNode).hasClass("NWEditable")
						|| (NW.browserDetect.browser != "Safari" && $(userSelection.focusNode).css("display") != "inline")) {
						//console.log("in here");
						/*var divElement = NWEditPage.document.createElement("div");
						divElement.innerHTML = userSelection.focusNode.innerHTML;
						userSelection.focusNode.innerHTML = "";
						$(divElement).css(command.css, command.value);
						userSelection.focusNode.appendChild(divElement);
						foundElement = true;*/
						$(userSelection.focusNode).css(command.css, command.value);
						foundElement = true;
					}
					$(userSelection.focusNode).parents().each(function() {
						// if the element is already found, no need to keep looking
						if (!foundElement) {
							// Check to see if the current is the contenteditable element
							// If it is, then apply the css to this
							if ($(this).hasClass("NWEditable")
								|| $(this).css("display") != "inline"
							) {
								$(this).css(command.css, command.value);
								foundElement = true;
								return;
							}
						}
					});
				} else {
					/*var foundElement = false;
					$(userSelection.focusNode).parents().each(function() {
						// if the element is already found, no need to keep looking
						if (!foundElement) {
							// Check to see if the current is the contenteditable element
							// If it is, then apply the css to this
							if ($(this).hasClass("NWEditable")
								|| $(this).css("display") != "inline"
							) {
								var element = NWEditPage.document.createElement("span");
								//$(element).css("color", "red");
								element.style.color = "red";
								console.log(rangeObject);
								rangeObject.surroundContents(element);
								foundElement = true;
							}
						}
					});*/
				}
				
				NW.editor.checkQueryState();
				NW.filesystem.changeToDraft();
				document.getElementById("NWEditPage").blur();
				document.getElementById("NWEditPage").focus();
			},
			alignText: function(e) {
				var textAlign = this.rel.replace("_justify", "");
				if (textAlign == "full") textAlign = "justify";
				
				NW.editor.functions.fireCustomCommand(this.rel.replace("_", ""), "");
				
				/*var userSelection;
				if (NWEditPage.getSelection) {
					userSelection = NWEditPage.getSelection();
				} else if (NWEditPage.document.selection) { // should come last; Opera!
					userSelection = NWEditPage.document.selection.createRange();
				}
				
				var foundElement = false;
				$(userSelection.focusNode).parents().each(function() {
					// if the element that has the textAlign is already found, no need to keep looking
					if (!foundElement) {
						// Check to see if the current is the contenteditable element
						// If it is, then apply the text align to this
						if ($(this).hasClass("NWEditable")
							|| $(this).css("display") != "inline"
						) {
							$(this).css("text-align", textAlign);
							foundElement = true;
						}
					}
				});*/
				//NW.editor.functions.fireCommand(this.rel.replace("_", ""), false, null);
			},
			closeWindow: function() {
				var zIndex = 0;
				var topWindow = null;
				for (var i = 0; i < document.getElementsByClassName("NWDraggable").length; i++) {
					var tempWindow = document.getElementsByClassName("NWDraggable")[i];
					if (parseInt(tempWindow.style.zIndex) >= zIndex && tempWindow.style.display == "block") {
						zIndex = parseInt(tempWindow.style.zIndex);
						topWindow = tempWindow;
						//// BRING BACK console.log("accepted");
					}
					/*console.log (tempWindow);
					// BRING BACK console.log(zIndex + " " + tempWindow.style.display);
					// BRING BACK console.log(parseInt(tempWindow.style.zIndex) >= zIndex + " " + tempWindow.style.display == "block");*/
				}
				if (topWindow) {
					topWindow.style.display = "none";
					//// BRING BACK console.log(topWindow);
					return false;
				} else {
					// make a function for checking if the user wants to save, then place a reference to it here
				}
			},
			select: function() {
				//$("div#NWEditPanel select").click(function() {
				var command = this.name;
				var value = this.value || null;
				if (command == "fontsize") {
					/*
					*	1 = 10px
					*	2 = 13px
					*	3 = 16px
					*	4 = 18px
					*	5 = 24px
					*	6 = 32px
					*	7 = 48px
					*/
					value = parseInt(value);
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
				NW.editor.functions.fireCommand(command,false,value);
				// BRING BACK console.log('hi');
				
				return false;
				//});
			},
			colorPickerManual: function() {
				//$("a.NWColorPickerManual").click(function() {
				var type = this.rel;
				var title = this.title;
				if (title.indexOf("background") != -1) {
					title = "Set the Background Color";
				} else if (title.indexOf("highlight") != -1) {
					title = "Set the Highlight Color";
				} else {
					title = "Set the Font Color";
				}
				var theThis = null;
				var colorPickerButtons = $("a.NWColorPickerManual");
				var clickedButton = null;
				/*for (var i = 0; i < colorPickerButtons.length && !theThis; i++) {
					//if (this == colorPickerButtons[i]) {theThis = colorPickerButtons[i]; // BRING BACK console.log(colorPickerButtons);}
					//if (this != colorPickerButtons[i] colorPickerButtons.splice(0,5);
					if (this == colorPickerButtons[i]) {
						colorPickerButtons.splice(i + 1, colorPickerButtons.length - (i + 1));
						if (i != 0) colorPickerButtons.splice(0, i);
						theThis = colorPickerButtons;
					}
				}*/
				theThis = colorPickerButtons.each(function() {
					if (this == $(this)[0]) return $(this);
				});
				//colorPickerButtons.splice(0,5);
				//theThis = clickedButton;
				//// BRING BACK console.log(colorPickerButtons);
				NW.colors.manualColor(type, title, theThis);
				
				return false;
			},
			initFontFamily: function() {
				// Change Font Family
				$("select.NWSetFontFamily").children().each(function() {
					$(this).css("font-family",$(this).attr("value"));
				});
			},
			// This is already controlled by the NWCheckQueryStat() function
			/*setFontFamily: function() {
				// BRING BACK console.log("font");
				//$("select.NWSetFontFamily").click(function() {
				var button = null;
				button = $("select.NWSetFontFamily").each(function() {
					if (this == $(this)[0]) return $(this);
				});
				button.children().each(function() {
					if($(this).attr("selected"))
						$(this).parent().css("font-family",$(this).css("font-family"));
				});
				//});
			}*/
			createLink: function() {
				//$("a.NWCreateLink").click(function() {
				var command = this.rel || "createLink";
				NW.windows.openInputWindow("NWLink", command);
				return false;
			},
			alignImageLeft: function() {
				// If there is no image, no need to go on
				if (!NW.selectedImage) return false;
				if (!NW.selectedImage.allowedAttributes.align) return false;
				
				// If the image is already aligned, that means that the person doesn't want it aligned
				if (NW.selectedImage.align == "left") {
					NW.selectedImage.removeAttribute("align");
					
					NW.editor.functions.swapPrimaryImageMargin();
					NW.editor.functions.removeImageInfo();
					NW.editor.functions.addImageInfo();
					
					NW.filesystem.changeToDraft();
					return false;
				}
				
				NW.selectedImage.align = "left";
				
				NW.editor.functions.swapPrimaryImageMargin();
				NW.editor.functions.removeImageInfo();
				NW.editor.functions.addImageInfo();
				
				NW.filesystem.changeToDraft();
			},
			alignImageRight: function() {
				// If there is no image, no need to go on
				if (!NW.selectedImage) return false;
				if (!NW.selectedImage.allowedAttributes.align) return false;
				
				// If the image is already aligned, that means that the person doesn't want it aligned
				if (NW.selectedImage.align == "right") {
					NW.selectedImage.removeAttribute("align");
					
					NW.editor.functions.swapPrimaryImageMargin();
					NW.editor.functions.removeImageInfo();
					NW.editor.functions.addImageInfo();
					
					NW.filesystem.changeToDraft();
					return false;
				}
				
				NW.selectedImage.align = "right";
				
				NW.editor.functions.swapPrimaryImageMargin();
				NW.editor.functions.removeImageInfo();
				NW.editor.functions.addImageInfo();
				
				NW.filesystem.changeToDraft();

			},
			mouseoverImage: function() {
				this.style.cursor = "default";
				// BRING BACK console.log("OVER");
				if (NW.browserDetect.browser == "Firefox" && false) {
					if (NW.imageWasMousedDown) {
						NW.editor.functions.addImageEvents(this);
						NW.editor.functions.updateImageMargin();
						NW.imageWasMousedDown = false;
						// BRING BACK console.log("FIREFOX");
					}
				}
			},
			mouseoutImage: function() {
				this.style.cursor = "";
				// BRING BACK console.log("OUT");
				
			},
			mousemoveImage: function() {
				// BRING BACK console.log("MOVE");
			},
			mousedownImage: function(e) {
				//this.addEventListener("mousemove", NW.editor.functions.mousemoveImage, false);
				//this.removeAttribute("_moz_resizing");
				// BRING BACK console.log("DOWN");
				if (NW.browserDetect.browser == "Firefox") {
					NW.imageWasMousedDown = true;
				}
			},
			mouseupImage: function() {
				// BRING BACK console.log("mouseup");
				if (NW.selectedImage) {
					var image = (this.id) ? this : NW.selectedImage;
					NW.editor.functions.addImageEvents(image);
				}
				// BRING BACK console.log("UP");
			},
			dragstartImage: function(e) {
				//e.dataTransfer.setData("Text", this.id);
			},
			dragendImage: function() {
				// This function is a pointer to the addImageEvents() function
				NW.editor.functions.addImageEvents(this);
				
				// The top or bottom margin can change if it is drug to the beginning or end of the paragraph
				NW.editor.functions.updateImageMargin();
				
				// BRING BACK console.log("---------dragend---------");
			},
			addImageEvents: function(image, init) {
				// BRING BACK console.log(image);
				if (!NW.selectedImage && !image) return false;
				// BRING BACK console.log("ADDING EVENTS");
				
				if (init) {
					if (!NW.imageId) NW.imageId = 0;
					image.id = "NWImage" + NW.imageId;
					NW.imageId++;
				}
				
				// Since the image seems to disappear from the DOM once it is drug, I need to get it by id again
				var image = NWEditPage.document.getElementById(image.id);
				if (!image) {
					NW.selectedImage = null;
					NW.editor.functions.removeImageInfo();
					NW.filesystem.changeToDraft();
					return false;
				}
				
				//// BRING BACK console.log(image);
				//// BRING BACK console.log("270");
				
				// Add click event to this image
				// Remove all the events before adding new ones (this functions will be fired every
				// time the image is moved) 
				if (!init) {
					NW.editor.functions.clickImage(image); // Fire this function first
					NW.editor.functions.offclickImage(); // Fire this function to compensate for the NW.imageClick variable
				}
				
				image.removeEventListener("click", NW.editor.functions.clickImage, false);
				image.addEventListener("click", NW.editor.functions.clickImage, false);
				
				NWEditPage.document.removeEventListener("click", NW.editor.functions.offclickImage, false);
				NWEditPage.document.addEventListener("click", NW.editor.functions.offclickImage, false);
				
				NWEditPage.document.removeEventListener("mouseup", NW.editor.functions.mouseupImage, false);
				NWEditPage.document.addEventListener("mouseup", NW.editor.functions.mouseupImage, false);
				
				// Add mouse over and mouse out event to this image
				image.removeEventListener("mouseover", NW.editor.functions.mouseoverImage, false);
				image.removeEventListener("mouseout", NW.editor.functions.mouseoutImage, false);
				
				image.addEventListener("mouseover", NW.editor.functions.mouseoverImage, false);
				image.addEventListener("mouseout", NW.editor.functions.mouseoutImage, false);
				
				image.removeEventListener("mousedown", NW.editor.functions.mousedownImage, false);
				image.addEventListener("mousedown", NW.editor.functions.mousedownImage, false);
				
				image.removeEventListener("mouseup", NW.editor.functions.mouseupImage, false);
				image.addEventListener("mouseup", NW.editor.functions.mouseupImage, false);
				
				image.removeEventListener("mousemove", NW.editor.functions.mousemoveImage, false);
				image.addEventListener("mousemove", NW.editor.functions.mousemoveImage, false);
				
				// Add drag event to this image so that every time it is drug, it will apply the events again
				// (the event listeners break once the image is drug)
				//image.removeEventListener("dragstart", NW.editor.functions.dragstartImage, false);
				//image.addEventListener("dragstart", NW.editor.functions.dragstartImage, false);
				
				image.removeEventListener("dragend", NW.editor.functions.dragendImage, false);
				image.addEventListener("dragend", NW.editor.functions.dragendImage, false);
				
				// For Firefox:
				//image.removeEventListener("dragexit", NW.editor.functions.dragendImage, false);
				//image.addEventListener("dragexit", NW.editor.functions.dragendImage, false);
			},
			addImageInfo: function() {
				// BRING BACK console.log("addImageInfo called");
				if (!NW.selectedImage) return false;
				
				var image = NW.selectedImage;
				if (image.nodeName != "IMG") {
					// Something has been deleted
					NW.editor.functions.removeImageInfo();
					NW.selectedImage = null;
					NW.filesystem.changeToDraft();
					return false;
				}
				
				// BRING BACK console.log(image);
				// Fill in the information on the sidebar
				if (image.allowedAttributes.src) $(".NWEditControls.NWInsertImageURL input").val(image.getAttribute("src"));
				if (image.allowedAttributes.align) {
					if (image.align == "left") {
						$(".NWEditControls.NWObjectWrap .NWObjectWrapLeft").addClass("NWSelected");
					} else if (image.align == "right") {
						$(".NWEditControls.NWObjectWrap .NWObjectWrapRight").addClass("NWSelected");
					}
				}
				
				if (image.allowedAttributes.width) NW.editor.functions.updateImageSizeInput("width");
				if (image.allowedAttributes.height) NW.editor.functions.updateImageSizeInput("height");
				
				if (image.allowedAttributes.width && image.allowedAttributes.height) {
					$(".NWEditControls.NWResizeProportional .NWResizeLink").addClass("NWSelected");
					NW.imageResizeLink = true;
				}
				
				NW.editor.functions.updateImageMarginInput();
			},
			removeImageInfo: function() {
				// Delete the information on the sidebar
				$(".NWEditControls.NWInsertImageURL input").val("");
				$(".NWEditControls.NWObjectWrap .NWSelected").removeClass("NWSelected");
				
				NW.editor.functions.updateImageSizeInput("width", true);
				NW.editor.functions.updateImageSizeInput("height", true);
				
				$(".NWEditControls.NWResizeProportional .NWResizeLink").removeClass("NWSelected");
				NW.imageResizeLink = false;
			},
			clickImage: function(extraThis) {
				// Tell the offclickImage function that an image has been clicked
				NW.imageClick = true;
				
				var image = this;
				if (extraThis && extraThis.src) image = extraThis;
				//// BRING BACK console.log(image);
				//// BRING BACK console.log("321");
				// Assign the image to a global variable so I can access it for functions
				NW.selectedImage = image;
				
				NW.selectedImage.allowedAttributes = {
					"alt": true,
					"src": true,
					"align": true,
					"height": true,
					"width": true,
					"margin": true,
					"padding": true,
					"border": true
				};
				// Add the attributes that can only be used to edit the image
				if ($(image).hasClass("NWEditableData")) {
					var imageClasses = image.className;
					
					var startAttrData = imageClasses.indexOf("NWEditableAttr") + 14;
					var endAttrData = imageClasses.indexOf("NWAttrZ");
					var attrData = imageClasses.substring(startAttrData, endAttrData).split("_");
					
					var attributes = [];
					for (var i = 0; i < attrData.length; i++) {
						attributes[attrData[i]] = true;
					}
					
					NW.selectedImage.allowedAttributes = attributes;
				}
				
				// Fill in the info in the sidebar
				NW.editor.functions.removeImageInfo();
				NW.editor.functions.addImageInfo();
			},
			offclickImage: function() {
				
				// If no image is selected, no use going any further since this will just delete information
				//if ($(".NWEditControls.NWInsertImageURL input").val == "") return true;
				
				// If an image is being selected, don't go any further
				if (NW.imageClick) {
					// Set imageClick to false so it's not like the image is always being clicked
					NW.imageClick = false;
					return true;
				}
				
				if (!NW.selectedImage) return true;
				
				// BRING BACK console.log("selected is null");
				// Delete the image from the global variable
				NW.selectedImage = null;
				
				// Delete the info in the sidebar
				NW.editor.functions.removeImageInfo();
			},
			placePreviewImage: function(images, numImages) {
				// Use a picture that says "invalid url" if the images.length doesn't equal numImages
				if (images.length != numImages) {
					// Do as said before in here
					/*function placeFailed(theImages, numOfImages) {
						document.getElementById("NWInsertImagePreview").children[0].src = theImages[0].src;
					}
					var failedImage = [];
					failedImage[0] = "images/NWInsertImage/failed_image.png";
					var failed = new ImagePreloader(failedImage, placeFailed);
					// BRING BACK console.log("Image Preload Failed");*/
					return;
				}
				/*// BRING BACK console.log(images[0]);
				// BRING BACK console.log(document.getElementById("NWInsertImagePreview").insertAdjacentElement);
				document.getElementById("NWInsertImagePreview").children[0].src = images[0].src;
				//$("#NWInsertImagePreview").text("haha");
				// BRING BACK console.log(document.getElementById("NWInsertImagePreview"));*/
				
				// This is the new version of insert image
				//if (NWEditPage.document.getSelection) // I may need this
				// Make sure that the caret has been set
				if (NWEditPage.getSelection().rangeCount == 0) return false;
				
				if (NW.browserDetect.browser == "Firefox") {
					var parentObj = NWEditPage.getSelection().getRangeAt(0).startContainer;
					
					// If the selection is in the body, there is no parent
					if (parentObj.nodeName == "BODY") return false;
					
					var editableObj = false;
					while (!editableObj) {
						// Assign the parentObj its parentObj so the loop keeps going
						parentObj = parentObj.parentNode;
						
						// Check to see if the current object is editable
						if (parentObj.getAttribute("contenteditable") == "true") editableObj = true;
						
						// Check to see if the current object is the body
						if (parentObj.nodeName == "BODY") return false;
					}
				}
				
				// Figure out where the "caret" (or the selection) is located
				var cursorPos = NWEditPage.getSelection().getRangeAt(0);
				// BRING BACK console.log(cursorPos);
				
				// Shortcut so I don't have to keep using images[0]
				var image = images[0];
				
				if (!image) return false;
				
				// Clear the selected text (if any)
				cursorPos.deleteContents();
				
				// Adjust the src for the offset
				var imageSrc = image.getAttribute("src");
				for (var i = 0; i < NW.imagePathOffset; i++) {
					imageSrc = "../" + imageSrc;
				}
				
				// Create the image
				var imageTag = NWEditPage.document.createElement("img");
				imageTag.setAttribute("src", imageSrc);		// Give the img tag a src
				imageTag.height = image.height;	// Set height
				imageTag.width = image.width;	// Set width
				imageTag.align = "left";		// Default to aligning to left
				imageTag.alt = "";				// Set an "alt" for HTML validity
				
				
				// Set a variable for keeping track of images by id
				if (!NW.imageId) NW.imageId = 0;
				imageTag.id = "NWImage" + NW.imageId; // Give the image a unique id
				
				
				// Create a temporary div tag and canvas tag
				/*var divTag = NWEditPage.document.createElement("div");
				divTag.id = "NWTempDiv" + NW.imageId;  // Give the div a unique id
				divTag.style.float = "left";
				//divTag.style.height = imageTag.height;
				//divTag.style.width = imageTag.width;
				// Set draggable attributes to the div
				//divTag.setAttribute("draggable", "true");
				divTag.style.border = "none";
				divTag.style.position = "absolute";
				divTag.style.left = "0px";
				//divTag.setAttribute("style", "-khtml-user-drag: element;");
				
				var canvasTag = NWEditPage.document.createElement("canvas");
				canvasTag.id = "NWTempCanvas" + NW.imageId;  // Give the canvas a unique id
				canvasTag.height = imageTag.height;
				canvasTag.width = imageTag.width;
				canvasTag.style.position = "absolute";
				// BRING BACK console.log(imageTag.offsetLeft);
				// BRING BACK console.log(imageTag.offsetRight);
				// BRING BACK console.log(imageTag.offsetTop);
				// BRING BACK console.log(imageTag.offsetBottom);
				//canvasTag.style.left = -imageTag.width + "px";
				//canvasTag.style.left = "1px";
				//canvasTag.style.left = 0;
				canvasTag.style.backgroundColor = "rgba(0,0,0,0.5)";*/
				
				
				
				// Insert the temporary div and canvas
				/*cursorPos.insertNode(divTag);
				var div = NWEditPage.document.getElementById("NWTempDiv" + NW.imageId);
				// BRING BACK console.log(div);
				div.appendChild(canvasTag);*/
				
				// Insert the image
				cursorPos.insertNode(imageTag);
				//div.appendChild(imageTag);
				
				// Assign the image to the global variable
				NW.selectedImage = document.getElementById(imageTag.id);
				
				// Add the events to the image
				NW.editor.functions.addImageEvents(imageTag);
				//console.log(NW.selectedImage);
				
				NW.editor.functions.changeImageMargin({setNum: 13, first: true});	// Set a default margin for the image
				
				// Increment the image id
				NW.imageId++;
				
				// Tell the editor that this file is now a draft
				NW.filesystem.changeToDraft();
				
				//if (cursorPos)
				//NW.editor.functions.fireCommand("insertimage", false, images[0].src);
			},
			loadImage: function(url) {
				var e = (url.target) ? url : null;
				if (e) {
					if (e.type != "keydown" && !NW.keystrokes.checkKeystroke("", Key.ENTER, "", e)) return false;
				}
				// Do this just in case the function doesn't get an argument
				var url = this.value || url;
				
				if (url == null) return false;
				
				// Make sure an image isn't already selected, in which case it would just change the source
				if (NW.selectedImage) {
					if (NW.selectedImage.getAttribute("src") != url) {
						NW.selectedImage.onload = NW.editor.functions.resetImageSize;
						NW.selectedImage.setAttribute("src", url);
						
						// Check for an image wrapper
						if ($(NW.selectedImage).parent(".NWImageLink")[0]) {
							$(NW.selectedImage).parent(".NWImageLink").attr("href", url);
						}
						
						NW.filesystem.changeToDraft();
					}
					return false;
				}
				
				if (url.target) return false;
				
				// BRING BACK console.log(url);
				
				var image = [];
				image[0] = url;
				for (var i = 0; i < NW.phpPathOffset; i++) {
					if (image[0].indexOf("../") == 0) {
						image[0] = image[0].substr(3);
					}
				}
				NW.imagePathOffset = i;
				var imageSet = new ImagePreloader(image, NW.editor.functions.placePreviewImage);
				
				/*
				var imgElement = NWEditPage.document.createElement("img");
				imgElement.setAttribute("src", url);
				image[0] = imgElement;
				NW.editor.functions.placePreviewImage(image, 1);
				*/
				
				//document.getElementById("NWInsertImagePreview").children[0].src = url;
			},
			/*imageLocation: function(theSelect) {
				var theWindow = document.getElementById("NWInsertImage");
				// Needed for when theSelect is not explicity declared, but is instead declared by an event
				theSelect = theSelect.target || theSelect;
				
				var selected = null;
				for (var i = 0; i < theSelect.children.length; i++) {
					if (theSelect.children[i].selected) selected = theSelect.children[i];
					if (selected) break;
				}
				
				var locationInput = theSelect.parentNode.parentNode.nextElementSibling;
				var tempLocationInput = locationInput;
				for (var x = 0; x <= i; x++) {
					if (x == i) break;
					locationInput = locationInput.nextElementSibling;
				}
				
				for (var i = 0; i < theSelect.children.length; i++) {
					
					if (tempLocationInput == locationInput) {
						tempLocationInput.style.display = "block";
					} else {
						tempLocationInput.style.display = "none";
					}
					tempLocationInput = tempLocationInput.nextElementSibling;
				}
				
				locationInput = locationInput.children[0].children[0];
				// BRING BACK console.log(locationInput);
				
			},*/
			/*insertImage: function() {
				var theWindow = document.getElementById("NWInsertImage");
				// Show the window
				theWindow.style.display = "block";
				
				var theSelect = document.getElementById("NWInsertImageLocation").children[0].children[0];
				if (!theSelect.onchange)
					theSelect.onchange = NW.editor.functions.imageLocation;
				// Only show the correct input
				NW.editor.functions.imageLocation(theSelect);
				
				// Set up the preload for url images
				var urlInput = document.getElementById("NWInsertImageURL").getElementsByTagName("input")[0];
				if (!urlInput.onblur) {
					urlInput.onblur = function() {
						NW.editor.functions.loadImage(urlInput.value);
					};
				}
				if (!urlInput.onkeydown) {
					urlInput.onkeydown = function(e) {
						if (NW.keystrokes.checkKeystroke("", Key.ENTER, "", e))
							NW.editor.functions.loadImage(urlInput.value);
					};
				}
				
				// Set up the preload for files on the user's computer
				var chooseInput = document.getElementById("NWInsertImageURL").nextElementSibling.children[0].children[0];
				// BRING BACK console.log(chooseInput);
				chooseInput.onchange = function(e) {
					*//*// BRING BACK console.log(e);
					// BRING BACK console.log(e.target.value);
					// BRING BACK console.log(chooseInput.value);*/
					//NW.editor.functions.loadImage(chooseInput.value);
				//};
				
				//NW.editor.functions.fireCommand("insertimage", false, "http://localhost/~nathanielwinckler/AdminPanel/images/NWToolbar/add_page.png");
			//},*/
			
			updateImageSizeInput: function(direction, clear) {
				if (!NW.selectedImage || clear) {
					$(".NWEditControls.NWDragNumber .NWDragNumber").val("");
					$(".NWEditControls.NWDragNumber .NWDragNumber").val("");
					return false;
				}
				
				if (direction == "width") {
					var width = NW.selectedImage.width;
					width = parseInt(width);
					$(".NWEditControls.NWDragNumber .NWDragNumber.NWResizeWidth").val(width);
				} else {
					var height = NW.selectedImage.height;
					height = parseInt(height);
					// This needs to be more specific!
					$(".NWEditControls.NWDragNumber .NWDragNumber.NWResizeHeight").val(height);
				}
				NW.filesystem.changeToDraft();
			},
			changeImageSize: function(args, direction, numAdded, setNum) {
				if (!NW.selectedImage) return false;
				
				var direction = args.direction;
				var numAdded = args.numAdded;
				var setNum = args.setNum;
				
				if (!direction && args.obj) {
					if (args.obj.rel) { // ... for links
						direction = args.obj.rel.replace(/_/g, "");
						direction = direction.toLowerCase();
					} else { // ...for inputs
						direction = args.obj.className.match(/width|height/gi);
						direction = direction[0].toLowerCase();
						
					}
				}
				
				// Make sure the direction is in lower case
				direction = direction.toLowerCase();
				
				var num = (numAdded != null) ? numAdded : setNum;
				//// BRING BACK console.log(num);
				if (numAdded != null) {
					if (direction == "width" && NW.selectedImage.allowedAttributes.width) {
						var width = NW.selectedImage.width;
						width += num;
					} else if (NW.selectedImage.allowedAttributes.height) {
						var height = NW.selectedImage.height;
						height += num;
					}
				} else {
					if (direction == "width" && NW.selectedImage.allowedAttributes.width) {
						var width = NW.selectedImage.width;
						width = num;
					} else if (NW.selectedImage.allowedAttributes.height) {
						var height = NW.selectedImage.height;
						height = num;
					}
				}
				
				if (width) {
					// Constrain proportions
					if (NW.imageResizeLink && NW.selectedImage.allowedAttributes.height) {
						// new height = (original height / orig width) * new width
						NW.selectedImage.height =
							Math.round((NW.selectedImage.naturalHeight / NW.selectedImage.naturalWidth) * width);
						NW.editor.functions.updateImageSizeInput("height");
					}
					
					// Create a cap so value doesn't go under 0; weird things happen when it goes under zero
					NW.selectedImage.width = (width < 0) ? 0 : width;
				} else if (height) {
					// Constrain proportions
					if (NW.imageResizeLink && NW.selectedImage.allowedAttributes.width) {
						// new width = (orig width / orig height) * new height
						NW.selectedImage.width =
							Math.round((NW.selectedImage.naturalWidth / NW.selectedImage.naturalHeight) * height);
						NW.editor.functions.updateImageSizeInput("width");
					}
					
					// Create a cap so value doesn't go under 0; weird things happen when it goes under zero
					NW.selectedImage.height = (height < 0) ? 0 : height;
				}
				
				// For Firefox:
				if (NW.selectedImage.allowedAttributes.width) NW.selectedImage.style.width = "";
				if (NW.selectedImage.allowedAttributes.height) NW.selectedImage.style.height = "";
				
				if (NW.selectedImage.allowedAttributes.width || NW.selectedImage.allowedAttributes.height) NW.editor.functions.updateImageSizeInput(direction);
			},
			resetImageSize: function() {
				if (!NW.selectedImage) return false;
				if (!NW.selectedImage.allowedAttributes.width || !NW.selectedImage.allowedAttributes.height) return false;
				
				NW.selectedImage.removeAttribute("width");
				NW.selectedImage.removeAttribute("height");
				
				NW.editor.functions.updateImageSizeInput("width");
				NW.editor.functions.updateImageSizeInput("height");
			},
			imageSizeLink: function() {
				if (!NW.selectedImage) return false;
				if (!NW.selectedImage.allowedAttributes.width && !NW.selectedImage.allowedAttributes.height) return false;
				if ($(this).hasClass("NWSelected")) {
					NW.imageResizeLink = false;
					$(this).removeClass("NWSelected");
				} else {
					NW.imageResizeLink = true;
					$(this).addClass("NWSelected");
				}
			},
			swapPrimaryImageMargin: function() {
				if (NW.selectedImage.align == "right") {
					var prevPrimaryMargin = $(NW.selectedImage).css("margin-right");
					NW.selectedImage.style.marginLeft = prevPrimaryMargin;
					NW.selectedImage.style.marginRight = "0px";
				} else if (NW.selectedImage.align == "left") {
					var prevPrimaryMargin = $(NW.selectedImage).css("margin-left");
					NW.selectedImage.style.marginRight = prevPrimaryMargin;
					NW.selectedImage.style.marginLeft = "0px";
				} else {
					var prevPrimaryMargin = (parseInt($(NW.selectedImage).css("margin-left")) > parseInt($(NW.selectedImage).css("margin-right")))
											? $(NW.selectedImage).css("margin-left")
											: $(NW.selectedImage).css("margin-right");
					
					NW.selectedImage.style.marginLeft = prevPrimaryMargin;
					NW.selectedImage.style.marginRight = prevPrimaryMargin;
				}
			},
			updateImageMarginInput: function() {
				var obj = $(".NWEditControls.NWDragNumber .NWChangeMargin");
				if (!NW.selectedImage) {
					obj.val("");
					return false;
				}
				if (!NW.selectedImage.allowedAttributes.margin) return false;
				// BRING BACK console.log(NW.selectedImage.align);
				var margin = (NW.selectedImage.align == "left")
					? $(NW.selectedImage).css("margin-right")
					: $(NW.selectedImage).css("margin-left");
				
				/*// BRING BACK console.log(parseInt(NW.selectedImage.style.marginRight) > 0);
				var margin = (parseInt(NW.selectedImage.style.marginRight) > 0)
					? NW.selectedImage.style.marginRight
					: NW.selectedImage.style.marginLeft;*/
				margin = parseInt(margin);
				// BRING BACK console.log(margin);
				obj.val(margin);
				NW.filesystem.changeToDraft();
			},
			updateImageMargin: function() {
				//// BRING BACK console.log("update function called");
				if (!NW.selectedImage) return false;
				//NW.selectedImage = NWEditPage.document.getElementById(NW.selectedImage.id);
				
				// BRING BACK console.log("UPDATING MARGIN");
				
				if (NW.selectedImage.align == "left") {
					var currentMargin = $(NW.selectedImage).css("margin-right");
					var useRightMargin = true;
				} else {
					var currentMargin = $(NW.selectedImage).css("margin-left");
				}
				currentMargin = parseInt(currentMargin);
				
				var margin = {
					// Check to see if image is at the top or bottom of a paragraph
					top: (NW.selectedImage == NW.selectedImage.parentNode.childNodes[0])
						? 0 // if it's at the top:
						: Math.round(.8 * currentMargin) // if it's not at the top
					,
					
					// Check to see if image is aligned left or right
					right: (useRightMargin) ? Math.round(currentMargin) : 0,
					
					// Check to see if image is at the top or bottom of a paragraph
					bottom: (NW.selectedImage ==
						NW.selectedImage.parentNode.childNodes[NW.selectedImage.parentNode.childNodes.length - 1])
							? 0 // if it's at the bottom:
							: Math.round(.8 * currentMargin) // if it's not at the bottom
					,
					
					// Check to see if image is aligned left or right
					left: (useRightMargin) ? 0 : Math.round(currentMargin)
				};
				
				// BRING BACK console.log(margin);
				
				NW.selectedImage.style.marginTop = margin.top + "px";
				NW.selectedImage.style.marginRight = margin.right + "px";
				NW.selectedImage.style.marginBottom = margin.bottom + "px";
				NW.selectedImage.style.marginLeft = margin.left + "px";
			},
			changeImageMargin: function(args) {
				if (!NW.selectedImage) return false;
				if (!NW.selectedImage.allowedAttributes.margin) return false;
				
				var numAdded = args.numAdded;
				var setNum = args.setNum;
				
				var num = (numAdded != null) ? numAdded : setNum;
				
				if (NW.selectedImage.align == "left") {
					var currentMargin = $(NW.selectedImage).css("margin-right");
					var useRightMargin = true;
				} else if (NW.selectedImage.align == "right") {
					var currentMargin = $(NW.selectedImage).css("margin-left");
					var useLeftMargin = true;
				} else {
					var currentMargin = (parseInt($(NW.selectedImage).css("margin-left"))
										> parseInt($(NW.selectedImage).css("margin-right"))
										)
											? $(NW.selectedImage).css("margin-left")
											: $(NW.selectedImage).css("margin-right");
					
					var useRightMargin = true;
					var useLeftMargin = true;
				}
				currentMargin = parseInt(currentMargin);
				
				var newMargin = 0;
				
				if (numAdded != null) {
					// Needs to be different
					newMargin = currentMargin + numAdded;
				} else {
					// Needs to be different for setting (if aligned left, don't need margin on left
					newMargin = setNum;
				}
				
				newMargin = (newMargin < 0) ? 0 : newMargin;
				
				var margin = {
					// Check to see if image is at the top or bottom of a paragraph
					top: (NW.selectedImage == NW.whitespace.first_child(NW.selectedImage.parentNode))
						? 0 // if it's at the top:
						: Math.round(.8 * newMargin) // if it's not at the top
					,
					// Check to see if image is aligned left or right
					right: (useRightMargin) ? Math.round(newMargin) : 0,
					bottom: (NW.selectedImage == NW.whitespace.last_child(NW.selectedImage.parentNode))
						? 0 // if it's at the bottom:
						: Math.round(.8 * newMargin) // if it's not at the bottom
					,
					// Check to see if image is aligned left or right
					left: (useLeftMargin) ? Math.round(newMargin) : 0
				};
				//console.log(NW.whitespace.first_child(NW.selectedImage.parentNode));
				// BRING BACK console.log(margin);
				
				NW.selectedImage.style.marginTop = margin.top + "px";
				NW.selectedImage.style.marginRight = margin.right + "px";
				NW.selectedImage.style.marginBottom = margin.bottom + "px";
				NW.selectedImage.style.marginLeft = margin.left + "px";
				
				NW.editor.functions.updateImageMarginInput();
				//// BRING BACK console.log("changed");
			},
			customHTML: function() {
				// Insert Custom HTML
				//$("a.NWInsertCustomHTML").click(function() {
				var selection = "";
				var command = this.rel;
				// BRING BACK console.log(this.nextElementSibling.children[0].checked);
				if(!this.nextElementSibling.children[0].checked)
					selection = NW.editor.checkQueryState();
				NW.windows.openInputWindow("NWCustomHTML", command, selection);
				return false;
			},
			iframeLoad: function() {
					// BRING BACK console.log("File Loaded");
				// Shorten typing
				if (document.getElementById("NWEditPage").src == "") {
					NWEditPage = null;
					return false; // The iframe really didn't load anything
				}
				NWEditPage = document.getElementById("NWEditPage").contentWindow;
				var iframe = document.getElementById("NWEditPage");
				
				// Make all the sections in the iframe that have the class "NWEditable" editable
				//$("#NWEditPage .NWEditable").attr("contenteditable", "true");
				var editables = $("#NWEditPage").contents().find(".NWEditable");
				editables.attr("contenteditable", "true");
				
				// Make all editable images able to be seen by the image editor
				$("#NWEditPage").contents().find("img.NWEditableData, .NWEditable img").each(function() {
					NW.editor.functions.addImageEvents(this, true);
				});
				
				// Make the page information editable in Page Information in the sidebar
				NW.editor.functions.clearPageInfoRows();
				$("#NWEditPage").contents().find(".NWEditablePageInfo").each(function() {
					var className = this.className;
					
					var startTitlePos = className.indexOf("NWPageInfo") + 10;
					var endTitlePos = className.indexOf("NWpageInfoZ");
					var title = className.substring(startTitlePos, endTitlePos);
					title = title.replace(/_/g, " ");
					
					var startTypePos = (className.indexOf("NWTypePageInfo") != -1)
											? className.indexOf("NWTypePageInfo") + 14
											: 0;
					var endTypePos = (className.indexOf("NWtypePageInfoZ") != -1)
											? className.indexOf("NWtypePageInfoZ")
											: 0;
					var type = className.substring(startTypePos, endTypePos);
					if (!type || type == "") type = "text";
					
					var inputElement = NW.editor.functions.addPageInfoRow(title, type, this);
					if (inputElement) {
						switch (type) {
							case "checkbox":
								break;
							default: // Type == text
								this.addEventListener("keydown", function() {NW.editor.functions.updatePageInfoInput(inputElement, this.textContent);}, false);
								this.addEventListener("keyup", function() {NW.editor.functions.updatePageInfoInput(inputElement, this.textContent);}, false);
								this.addEventListener("dragend", function() {NW.editor.functions.updatePageInfoInput(inputElement, this.textContent);}, false);
								break;
						}
					}
				});
				
				// Disable all links inside the iframe
				var links = $("#NWEditPage").contents().find("a");
				links.each(function() {
					if ($(this).attr("href") != "#"
						&& $(this).attr("href") != "javascript:;"
						&& $(this).attr("href") != ""
						&& !$(this).parents(".NWEditable")[0]
					) {
						$(this).click(function(){return false;});
					}
				});
				/*editables.each(function() {
					$(this)[0].designMode = 'On';
					console.log($(this)[0]);
				});
				NWEditPage.document.designMode = "On";
				$(NWEditPage.document.body).attr("contentEditable", "false");*/
				/*for (var i = 0; i < editables.length; i++) {
					var obj = editables[i];
					obj.addEventListener("focus", function() {
						// BRING BACK console.log("editable focus");
					}, false);
					obj.addEventListener("blur", function() {
						// BRING BACK console.log("editable blur");
					}, false);
				}*/
				
				// Set up the keystrokes that happen inside the iframe
				NW.listener.onkeydown.page(NWEditPage);
				NW.listener.onkeyup.page(NWEditPage);
				
				iframe.contentDocument.addEventListener("click", NW.editor.checkQueryState, false);
				iframe.contentDocument.addEventListener("mousedown", NW.editor.checkQueryState, false);
				iframe.contentDocument.addEventListener("mouseup", NW.editor.checkQueryState, false);
				iframe.contentDocument.addEventListener("drag", NW.filesystem.changeToDraft, false);
				iframe.contentDocument.addEventListener("keydown", NW.filesystem.changeToDraft, false);
				iframe.contentDocument.addEventListener("keydown", NW.editor.functions.arrowKeysCheck, false);
				iframe.contentDocument.addEventListener("keyup", NW.editor.functions.arrowKeysCheck, false);
				iframe.contentDocument.addEventListener("keypress", NW.editor.functions.arrowKeysCheck, false);
				
				// The only other times NW.editor.checkQueryState is called during a key event is
				// when the user clicks on the arrow keys.  This is implemented in the
				// NW.keystrokes section.
				iframe.contentDocument.onmousedown = NW.quickSelect.onmousedown;
			},
			arrowKeysCheck: function(e) {
				// BRING BACK console.log("press");
				if (
					   NW.keystrokes.checkKeystroke("", Key.LEFT_ARROW, "", e)
					|| NW.keystrokes.checkKeystroke("", Key.RIGHT_ARROW, "", e)
					|| NW.keystrokes.checkKeystroke("", Key.UP_ARROW, "", e)
					|| NW.keystrokes.checkKeystroke("", Key.DOWN_ARROW, "", e)
				) {
					NW.editor.checkQueryState();
					return true;
				}
				return true;
			}
		},
		buttons: function() {
			var buttons = [
				// Filesystem
				{
					jquery: ".NWSelectable li",
					action: NW.filesystem.select,
					trigger: "click"
				},
				/*{
					jquery: ".NWRowCategoryHeader div.NWClosed",
					action: NW.filesystem.expandTriangle,
					trigger: "click"
				},
				{
					jquery: ".NWRowCategoryHeader div.NWOpen",
					action: NW.filesystem.collapseTriangle,
					trigger: "click"
				},*/
				
				{
					jquery: ".NWRowCategoryHeader div.NWOpen, .NWRowCategoryHeader div.NWClosed",
					action: NW.filesystem.triangleSwitch,
					trigger: "click"
				},
				
				// List Editor
				{
					id: "NWListEditorAdd",
					action: NW.filesystem.addEntry,
					trigger: "click"
				},
				{
					id: "NWListEditorDelete",
					action: NW.filesystem.confirmDeleteEntry,
					trigger: "click"
				},
				
				// Resize Windows
				{
					jquery: ".NWResizeVertical .NWResizeHandle",
					action: NW.innerWindow.resizeVertical,
					trigger: "mousedown"
				},
				{
					jquery: ".NWResizeHorizontal .NWResizeHandle",
					action: NW.innerWindow.resizeHorizontal,
					trigger: "mousedown"
				},
				
				// Toolbar
				{
					className: "NWEditPanelToggle",
					action: NW.editor.functions.toggleEditPanel,
					trigger: "click"
				},
				{
					className: "NWSaveDraft",
					action: NW.io.save,
					trigger: "click"
				},
				{
					className: "NWRevertDraft",
					action: NW.editor.functions.confirmRevert,
					trigger: "click"
				},
				{
					className: "NWPublishSite",
					action: NW.editor.functions.publishButton,
					trigger: "click"
				},
				{
					className: "NWAddPage",
					action: NW.templates.openTemplatesWindow,
					trigger: "click"
				},
				{
					className: "NWSettings",
					action: NW.editor.functions.openSettings,
					trigger: "click"
				},
				{
					className: "NWLogOut",
					action: NW.editor.functions.logOut,
					trigger: "click"
				},
				{
					jquery: "div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul li",
					action: NW.templates.selectTemplate,
					trigger: "click"
				},
				{
					jquery: "div.NWChooseTemplate .NWTemplatesWindow .NWTemplates ul li",
					action: function() { NW.templates.closeTemplatesWindow(); },
					trigger: "dblclick"
				},
				{
					jquery: "div.NWChooseTemplate .NWTemplatesWindow .NWTemplatesWindowCancel",
					action: function() { NW.templates.closeTemplatesWindow(false); },
					trigger: "click"
				},
				{
					jquery: "div.NWChooseTemplate .NWTemplatesWindow .NWTemplatesWindowChoose",
					action: function() { NW.templates.closeTemplatesWindow(); },
					trigger: "click"
				},
				{
					jquery: "#NWSidebarRightCategories > ul > li > a",
					action: NW.editor.functions.selectRightSidebarCategory,
					trigger: "click"
				},
				{
					jquery: "div#NWEditPanel .NWEditPanelGroup .NWEditControls > a",
					action: NW.editor.functions.editPanelA,
					trigger: "click"
				},
				{
					jquery: "div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWTextAlign > a",
					action: NW.editor.functions.alignText,
					trigger: "click"
				},
				{
					jquery: "div#NWEditPanel select",
					action: NW.editor.functions.select,
					trigger: "click"
				},
				{
					jquery: "a.NWColorPickerManual",
					action: NW.editor.functions.colorPickerManual,
					trigger: "click"
				},
				{
					action: NW.editor.functions.initFontFamily,
					trigger: "load"
				},
				{
					jquery: "a.NWCreateLink",
					action: NW.editor.functions.createLink,
					trigger: "click"
				},
				/*{
					id: "NWRight",
					action: NW.editor.functions.insertImage,
					trigger: "click"
				},*/
				{
					jquery: "a.NWInsertCustomHTML",
					action: NW.editor.functions.customHTML,
					trigger: "click"
				},
				/*{
					jquery: "#NWInsertImageLocation select",
					action: NW.editor.functions.imageLocation,
					trigger: "click"
				},
				{
					jquery: "#NWInsertImageURL input",
					action: NW.editor.functions.imageLocation,
					trigger: "blur"
				},*/
				/*{
					action: NW.editor.functions.insertImage,
					trigger: "load"
				},*/
				{
					jquery: ".NWEditControls.NWInsertImageURL input",
					action: NW.editor.functions.loadImage,
					trigger: "blur"
				},
				{
					jquery: ".NWEditControls.NWInsertImageURL input",
					action: NW.editor.functions.loadImage,
					trigger: "keydown"
				},
				{
					jquery: ".NWEditControls.NWDragNumber .NWDecreaseNumber",
					action: NW.dragNumber.decrementNumber,
					trigger: "click"
				},
				{
					jquery: ".NWEditControls.NWDragNumber .NWIncreaseNumber",
					action: NW.dragNumber.incrementNumber,
					trigger: "click"
				},
				/*{
					jquery: ".NWEditControls.NWDragNumber .NWDragNumber",
					action: NW.dragNumber.dragNumberInputDblClick,
					trigger: "dblclick"
				},*/
				{
					jquery: ".NWEditControls.NWDragNumber .NWDragNumber",
					action: NW.dragNumber.onInputFocus,
					trigger: "focus"
				},
				{
					jquery: ".NWEditControls.NWDragNumber .NWDragNumber",
					action: NW.dragNumber.onInputChange,
					trigger: "change"
				},
				{
					jquery: ".NWEditControls.NWDragNumber .NWDragNumber",
					action: NW.dragNumber.onInputBlur,
					trigger: "blur"
				},
				{
					jquery: ".NWEditControls.NWDragNumber .NWDragNumber",
					action: NW.dragNumber.ondragstart,
					trigger: "mousedown"
				},
				{
					jquery: ".NWEditControls.NWResizeProportional .NWResizeLink",
					action: NW.editor.functions.imageSizeLink,
					trigger: "click"
				},
				{
					jquery: ".NWEditControls.NWObjectWrap .NWObjectWrapLeft",
					action: NW.editor.functions.alignImageLeft,
					trigger: "click"
				},
				{
					jquery: ".NWEditControls.NWObjectWrap .NWObjectWrapRight",
					action: NW.editor.functions.alignImageRight,
					trigger: "click"
				},
				{
					action: NW.editor.functions.iframeLoad,
					trigger: "iframeload"
				}
			]
			return buttons;
		}
	},
	byClass: function(theClass) {
		// Return all classes as an array
		var results = [];
		for (var i = 0; i < document.getElementsByClassName(theClass).length; i++) {
			results[i] = document.getElementsByClassName(theClass)[i];
		}
		return results;
	},
	byId: function(id) {
		return document.getElementById(id);
	},
	byJquery: function(string) {
		var results = [];
		for (var i = 0; i < $(string).length; i++) {
			results[i] = $(string)[i];
		}
		return results;
	},/*,
	parseCssString: function(string) {
		var array = string.split(/ /gi);
		for (var i = 0; i < array.length; i++) {
			array[i] = array[i].split(/#|\./gi);
		}
		
		return array;
	}*/
	onenterpress: function() {
		var returnVal = true;
		var tempVal = null;
		tempVal = NW.windows.closeInputWindow() || false; // Close Input Window
		returnVal = (returnVal == false) ? returnVal : tempVal;
		
		tempVal = NW.templates.closeTemplatesWindow() || false; // Use the currently selected template
		returnVal = (returnVal == false) ? returnVal : tempVal;
		
		tempVal = NW.editor.functions.confirmWindowEnterPress() || false; // Agree to Confirmation Window
		returnVal = (returnVal == false) ? returnVal : tempVal;
		
		return returnVal;
	},
	onescapepress: function() {
		NW.editor.functions.closeConfirmWindow();
	},
	onoptiondown: function() {
		NW.editor.functions.togglePublishSite();
	},
	onoptionup: function() {
		NW.editor.functions.togglePublishPage();
	},
	ondeletedown: function() {
		NW.editor.functions.offclickImage();
	},
	onresize: function() {
		NW.window.resize();
	},
	onload: function() {
		// Setup the browser detection
		NW.browserDetect.init();
		
		// Set up the buttons
		NW.editor.init();
		
		// Set up the listener; the page listener is in the iframeLoad function
		NW.listener.onkeydown.window();
		NW.listener.onkeyup.window();
		
		// Preload the images of the quick select buttons
		NW.quickSelect.buttons.init();
		
		// Open the last open file
		NW.io.openLastOpenFile();
		
		// Set up the draggable windows
		NW.windows.setupDraggable();
	},
	onDOMLoad: function() {
		// Resize the window as soon as the page loads (should probably use jquery for this part)
		NW.window.resize();
		
		// Check to see if the user has logged in
		NW.io.checkLogin();
		
		// Expand or collapse triangles
		NW.filesystem.init();
		
		// Show the edit tools in the right sidebar
		NW.editor.functions.initRightSidebar();
		
		// The path offset from the templates and the AdminPanel
		NW.phpPathOffset = 1;
		
		/*Range.prototype.surroundContents = function (newNode) {
			console.log("it worked");
                // extract and surround contents
                var content = this.extractContents();
                this.insertNode(newNode);
                newNode.appendChild(content);
                this.selectNode(newNode);
        };*/
	},
	onbeforeunload: function(e) {
		var selected = NW.filesystem.getSelected();
		if ($(selected).hasClass("NWUnsaved")) {
			NW.io.save(null, true, false);
			//return "You have unsaved changes in the draft \"" + selected.textContent + "\".\nYour changes are currently being saved.  Please wait until it is finished.";
		} else {
			NW.io.unlock(NW.filesystem.getSelected(), false);
		}
		
	},
	onunload: function() {
		//setTimeout("alert('now');", 5000);
		//alert("gone");
		return false;
	},
};

$(document).ready(function() {
	NW.onDOMLoad();
});
window.onload = NW.onload;
window.onbeforeunload = NW.onbeforeunload;
window.onunload = NW.onunload;
window.onresize = NW.onresize;

// Set up all keystrokes
NW.listener = {
	actions: [],
	bindKey: function(modifiers, keyCode, action, name, passThrough, event, scope) {
		this.actions[this.createActionId(null, scope, modifiers, keyCode, event)] = {name: name, modifiers: modifiers, keyCode: keyCode, action: action, event: event, scope: scope, passThrough: passThrough};
	},
	createActionId: function(e, scope, modifiers, keyCode, event) {
		var actionId = "";
		if (e) {
			var modifierArray = [];
			if (e.type == "keydown") {
				if (e.altKey) modifierArray.push("ALT");
				if (e.shiftKey) modifierArray.push("SHIFT");
				if (e.metaKey && isMac()) modifierArray.push("CMD");
				if (e.ctrlKey) {
					if (isMac()) {
						modifierArray.push("CTRL");
					} else {
						modifierArray.push("CMD");
					}
				}
			} else {
				if (e.keyCode == 18) modifierArray.push("ALT");
				if (e.keyCode == 16) modifierArray.push("SHIFT");
				if ((e.keyCode == 224 || e.keyCode == 91) && isMac()) modifierArray.push("CMD");
				if (e.keyCode == 17) {
					if (isMac()) {
						modifierArray.push("CTRL");
					} else {
						modifierArray.push("CMD");
					}
				}
			}
			modifierArray.sort();
			
			for (var i = 0; i < modifierArray.length; i++) {
				if (i == 0) {
					actionId = modifierArray[i];
				} else {
					actionId += " " + modifierArray[i];
				}
			}
			
			var keyCode = e.keyCode;
			switch (e.keyCode) {
				/*case "CONTROL":
				case "CTRL":
				case "ALT":
				case "META":
				case "SHIFT":*/
				case 17: // CTRL key
				case 18: // ALT key
				case 224: // Firefox META key
				case 91: // Safari META key
				case 16: // SHIFT key
					keyCode = null;
					break;
			}
			if (modifierArray[0] && keyCode) {
				actionId += " " + keyCode;
			} else if (keyCode) {
				actionId = keyCode;
			}
			
			actionId += " " + e.type;
			if (scope) actionId += " " + scope.toLowerCase();
		} else {
			if (modifiers) {
				var modifierArray = modifiers.split(" ");
				modifierArray.sort();
				for (var i = 0; i < modifierArray.length; i++) {
					if (i == 0) {
						actionId = modifierArray[i];
					} else {
						actionId += " " + modifierArray[i];
					}
				}
			}
			
			if (modifiers && keyCode) {
				actionId += " " + keyCode;
			} else if (keyCode) {
				actionId = keyCode;
			}
			
			(event) ? actionId += " " + event : actionId += " " + "keydown";
			if (scope) actionId += " " + scope.toLowerCase();
		}
		
		return actionId;
	},
	listener: function(e, scope) {
		// Try to make the id with a scope first
		var actionId = NW.listener.createActionId(e, scope);
		var action = NW.listener.actions[actionId];
		// If the one with the scope didn't work, try it without the scope
		if (!action) {
			actionId = NW.listener.createActionId(e);
			action = NW.listener.actions[actionId];
		}
		
		if (!action) return false;
		
		//for (var i = 0; i < NW.listener.actions.length; i++) {
			//var action = NW.listener.actions[i];
			//var keystroke = NW.keystrokes.checkKeystroke(action.modifiers, action.keyCode, "", e);
			//// BRING BACK console.log(e.keyCode);
			//// BRING BACK console.log(action.modifiers + " " + action.keyCode);
			//// BRING BACK console.log(keystroke);
			//if (keystroke) {
				// If the action specifies a specific event, and the wrong event occurred, stop the process
				/*if (action.event && action.event != e.type) {
					return false;
				}*/
				
		// Check to see if the function returns a value
		// That value shows if the browser should also get the key command
		
		var passToBrowser;
		if (typeof(action.action) == "string") {
			passToBrowser = eval(action.action);
		} else {
			passToBrowser = action.action();
		}
		/*if (passToBrowser != null) {
			if (!passToBrowser) e.preventDefault();
			return passToBrowser;
		}*/
		// This prevents the default action from happening (though Safari likes to keep the basic ones such as bold
		// If the action is not to pass through, prevent it
		//if ((passToBrowser != null && passToBrowser == false) || (passToBrowser == null && action.passThrough != true))
		if ((action.passThrough == null && passToBrowser != null && passToBrowser == false)
			|| (action.passThrough != null && action.passThrough == false)) e.preventDefault();
		return false;
			//}
		//}
	},
	onkeydown: {
		window: function() {
			// If I use the addEventListener, the browser also saves since this code is just
			// adding a listner, not replacing it
			window.addEventListener("keydown", function(e) {NW.listener.listener(e, "window");}, false);
			//window.onkeydown = NW.listener.listener;
		},
		page: function(page) {
			// Look at the reason above for why I'm using onkeydown instead of addEventListener
			page.addEventListener("keydown", function(e) {NW.listener.listener(e, "page");}, false);
			//page.onkeydown = NW.listener.listener;
		}
	},
	onkeyup: {
		window: function() {
			// If I use the addEventListener, the browser also saves since this code is just
			// adding a listner, not replacing it
			window.addEventListener("keyup", function(e) {NW.listener.listener(e, "window");}, false);
			//window.onkeydown = NW.listener.listener;
		},
		page: function(page) {
			// Look at the reason above for why I'm using onkeydown instead of addEventListener
			page.addEventListener("keyup", function(e) {NW.listener.listener(e, "page");}, false);
			//page.onkeydown = NW.listener.listener;
		}
	},
	bindButton: function(button, trigger, callback) {
		if (trigger) trigger = trigger.toLowerCase();
		switch (trigger) {
			case "click":
				button.addEventListener("click", callback, false);
				break;
			case "dblclick":
				button.addEventListener("dblclick", callback, false);
				//button.ondblclick = callback;
				break;
			case "mousedown":
				button.addEventListener("mousedown", callback, false);
				//button.onmousedown = callback;
				break;
			case "mouseup":
				button.addEventListener("mouseup", callback, false);
				//button.onmouseup = callback;
				break;
			case "focus":
				button.addEventListener("focus", callback, false);
				//button.onfocus = callback;
				break;
			case "blur":
				button.addEventListener("blur", callback, false);
				//button.onblur = callback;
				break;
			case "change":
				button.addEventListener("change", callback, false);
				break;
			case "keydown":
				button.addEventListener("keydown", callback, false);
				//button.onkeydown = callback;
				break;
			case "keyup":
				button.addEventListener("keyup", callback, false);
				//button.onkeyup = callback;
				break;
			case "keypress":
				button.addEventListener("keypress", callback, false);
				//button.onkeypress = callback;
				break;
			case "load":
				// There should probably be some sort of function that checks if the DOM is loaded.
				// But right now, this is inside the jquery onload function, so it is not needed yet
				callback();
				break;
			case "iframeload":
				document.getElementById("NWEditPage").addEventListener("load", callback, false);
				// Apparently, the onload section also includes the iframe onload. So, no need to wait.
				//callback();
				break;
			default:
				button.onclick = callback;
		}
	}
};

NW.window = {
	resize: function() {
		// This function needs to be cleaned up.  I made a mess when I tried to make some resizes automatic
		var clientW = window.innerWidth;
		var clientH = window.innerHeight;
		
		// Resize NWLeft and NWRight
		var NWRightW = parseInt($("#NWRight").css("width"));
		var NWRightOriginalW = 340;
		
		var NWLeftW = parseInt($("#NWLeft").css("width"));
		
		if ($("#NWRight").css("display") == "none") {
			$("#NWLeft").css("width", clientW);
		} else {
			NWLeftW = clientW - NWRightW;
			var minLeftWidth = 290;
			if (!NW.window.NWRightNormalWidth) NW.window.NWRightNormalWidth = NWRightOriginalW;
			if (parseInt($("#NWLeft").css("width")) <= minLeftWidth
				//|| parseInt($("#NWLeft").css("width")) - parseInt($("#NWRight").css("width")) < minLeftWidth
			) {
				//if (!NW.window.NWRightNormalWidth) NW.window.NWRightNormalWidth = parseInt($("#NWRight").css("width"));
				var leftWidthDifference = parseInt($("#NWRight").css("width")) - NW.window.NWRightNormalWidth;
				var userDraggable = false;
				if (leftWidthDifference == 0 && clientW - parseInt($("#NWRight").css("width")) > minLeftWidth) userDraggable = true;
				if (leftWidthDifference < 0) leftWidthDifference = 0;
				if (userDraggable) {
					// the difference is zero, that means that the right side is whatever the user wants it to be 
					// width-width = 0
					$("#NWLeft").css("width", clientW - parseInt($("#NWRight").css("width")) + "px");
					//console.log("Is user draggable");
				} else {
					$("#NWLeft").css("width", minLeftWidth + leftWidthDifference + "px");
					$("#NWRight").css("width", clientW - minLeftWidth + "px");
				}
				
				
				//$("#NWRight").css("width", clientW - minLeftWidth + "px");
				//$("#NWLeft").css("width", clientW - parseInt($("#NWRight").css("width")) + "px");
				//console.log("resized");
			} else {
				//console.log(NW.window.NWRightNormalWidth);
				if (NW.window.NWRightNormalWidth) {
					$("#NWRight").css("width", NW.window.NWRightNormalWidth + "px");
				}
				$("#NWLeft").css("width", clientW - NWRightW);
			}
			//$("#NWRight").css("width", NWRightOriginalW);
		}
		/*else if (clientW < 620) {
			$("#NWLeft").css("width", "290px");
			NWRightW = clientW - 290;
			$("#NWRight").css("width", NWRightW);
		}*/
		
		// Resize NWSidebarLeft, NWEdit, and NWToolbar
		var NWSidebarLeftH;
		var NWSidebarLeftBorderWidth = 1;
		//var NWToolbarH = $("#NWToolbar").css("height");
		//NWToolbarH = NWToolbarH.replace(/px/gi, "");
		NWToolbarH = 65;
		
		NWSidebarLeftH = clientH - NWToolbarH;
		$("#NWSidebarLeft").css("height", NWSidebarLeftH - NWSidebarLeftBorderWidth).css("min-height", NWSidebarLeftH - NWSidebarLeftBorderWidth).css("max-height", NWSidebarLeftH - NWSidebarLeftBorderWidth);
		$("#NWEdit").css("height", NWSidebarLeftH).css("min-height", NWSidebarLeftH).css("max-height", NWSidebarLeftH);
		
		// Resize the left sidebar width
		var NWSidebarWidth = parseInt($("#NWSidebarLeft").css("width"));
		var NWLeftWidth = parseInt($("#NWLeft").css("width"));
		var limit = NWLeftWidth * .9;
		if (NWSidebarWidth > limit) {
			$("#NWSidebarLeft").css("width", limit + "px");
		} else if (NWSidebarWidth < NW.window.NWLeftSidebarNormalWidth) {
			if (limit < NW.window.NWLeftSidebarNormalWidth) {
				$("#NWSidebarLeft").css("width", limit + "px");
			} else {
				$("#NWSidebarLeft").css("width", NW.window.NWLeftSidebarNormalWidth + "px");
			}
		}
		
		// Resize the iframe and list editor
		// only if the list editor is open
		if ($("#NWListEditor").css("display") != "none") {
			// resize iframe
			var listEditorHeight = parseInt($("#NWListEditor").css("height"));
			var NWEditHeight = parseInt($("#NWEdit").css("height"));
			$("#NWEditPage").css("height", NWEditHeight - listEditorHeight + "px");
			
			// resize list editor
			if (listEditorHeight > NWEditHeight) {
				$("#NWListEditor").css("height", NWEditHeight - 1 + "px");
				NW.editor.functions.changeListEditorSize();
			}
		} else {
			$("#NWEditPage").css("height", "100%");
		}
	}
};

NW.innerWindow = {
	resizeVertical: function(e) {
		NW.innerWindow.ondragstart(e, "vertical", this)
	},
	resizeHorizontal: function(e) {
		NW.innerWindow.ondragstart(e, "horizontal", this)
	},
	ondragstart: function(e, orientation, theThis) {
		e.preventDefault();
		NW.innerWindowDrag = {};
		// Set the variables for where the mouse is intially
		NW.innerWindowDrag.initMousePos = {
			x: e.clientX,
			y: e.clientY
		};
		NW.innerWindowDrag.currentWindow = $(theThis).parents(".NWResizeVertical:first, .NWResizeHorizontal:first");
		NW.innerWindowDrag.orientation = orientation;
		NW.innerWindowDrag.resizeSide = (NW.innerWindowDrag.currentWindow.children(".resizeSide:first")) ? NW.innerWindowDrag.currentWindow.children(".resizeSide:first").val() : "right";
		
		NW.innerWindowDrag.initSize = {
			height: parseInt(NW.innerWindowDrag.currentWindow.css("height")),
			width: parseInt(NW.innerWindowDrag.currentWindow.css("width"))
		};
		
		// Find the minumum and maximum
		var minElement = NW.innerWindowDrag.currentWindow.children(".min:first");
		if (minElement) {
			NW.innerWindowDrag.minimum = minElement.val();
			if (minElement.attr("placeholder") == "number") {
				NW.innerWindowDrag.minimum = parseInt(NW.innerWindowDrag.minimum);
			} else {
				// If it's a function
				NW.innerWindowDrag.minimum = parseInt(eval(NW.innerWindowDrag.minimum));
			}
		} else {
			NW.innerWindowDrag.minimum = 0;
		}
		
		var maxElement = NW.innerWindowDrag.currentWindow.children(".max:first");
		if (maxElement) {
			NW.innerWindowDrag.maximum = maxElement.val();
			if (maxElement.attr("placeholder") == "number") {
				NW.innerWindowDrag.maximum = parseInt(NW.innerWindowDrag.maximum);
			} else {
				// If it's a function
				NW.innerWindowDrag.maximum = parseInt(eval(NW.innerWindowDrag.maximum));
			}
		} else {
			NW.innerWindowDrag.maximum = 0;
		}
		
		//NW.innerWindowDrag.dragged = false;
		
		// Add an event listener to see if the mouse moves
		window.addEventListener("mousemove", NW.innerWindow.ondrag, false);
		
		// Add an event listener for when the mouse "mouseups"
		window.addEventListener("mouseup", NW.innerWindow.ondragend, false);
	},
	ondrag: function(e) {
		//e.preventDefault();
		//NW.innerWindowDrag.dragged = true;
		// Assign the current mouse position
		NW.innerWindowDrag.currentMousePos = {
			x: e.clientX,
			y: e.clientY
		};
		//// BRING BACK console.log("init: " + NW.innerWindowDrag.initMousePos.x);
		// BRING BACK console.log("current: " + NW.innerWindowDrag.currentMousePos.x);
		
		if (NW.innerWindowDrag.orientation == "horizontal") {
			var difference = NW.innerWindowDrag.currentMousePos.x - NW.innerWindowDrag.initMousePos.x;
		} else {
			var difference = NW.innerWindowDrag.currentMousePos.y - NW.innerWindowDrag.initMousePos.y;
		}
		//console.log(NW.innerWindowDrag);
		// Flip the direction that sizes up and down
		if (NW.innerWindowDrag.resizeSide == "left") difference = -difference;
		//// BRING BACK console.log(difference);
		
		// Apply the difference to the inner window
		var currentWindow = NW.innerWindowDrag.currentWindow;
		
		if (NW.innerWindowDrag.orientation == "horizontal") {
			var initWidth = NW.innerWindowDrag.initSize.width;
			var newWidth = initWidth + difference;
			if (newWidth < NW.innerWindowDrag.minimum) {
				newWidth = NW.innerWindowDrag.minimum;
			} else if (NW.innerWindowDrag.maximum != 0 && newWidth > NW.innerWindowDrag.maximum) {
				newWidth = NW.innerWindowDrag.maximum
			}
			
			currentWindow.css("width", newWidth + "px");
		} else {
			var initHeight = NW.innerWindowDrag.initSize.height;
			var newHeight = initHeight + difference;
			if (newHeight < NW.innerWindowDrag.minimum) {
				newHeight = NW.innerWindowDrag.minimum;
			} else if (NW.innerWindowDrag.maximum != 0 && newHeight > NW.innerWindowDrag.maximum) {
				newHeight = NW.innerWindowDrag.maximum
			}
			
			currentWindow.css("height", newHeight + "px");
		}
		
		if (!NW.innerWindowDrag.overAllDiv) {
			// Add a div over everything so the x y values stay the same over the iframe
			var overAllDiv = document.createElement("div");
			overAllDiv.style.position = "fixed";
			overAllDiv.style.left = 0;
			overAllDiv.style.top = 0;
			overAllDiv.style.width = window.innerWidth + "px";
			overAllDiv.style.height = window.innerHeight + "px";
			overAllDiv.style.background = "none";
			overAllDiv.style.cursor = (NW.innerWindowDrag.orientation == "horizontal") ? "col-resize" : "row-resize";
			
			NW.innerWindowDrag.currentWindow[0].parentNode.appendChild(overAllDiv);
			NW.innerWindowDrag.overAllDiv = overAllDiv;
		}
		
		// Now fire a function
		// Just so that it doesn't have to figure out the function every time...
		if (!NW.innerWindowDrag.callback && currentWindow.children(".callback:first").val()) {
			//eval(currentWindow.children(".callback:first").val());
			var callback = NW.dragNumber.findFunction(currentWindow.children(".callback:first").val());
			NW.innerWindowDrag.callback = callback;
		}
		if (NW.innerWindowDrag.callback) {
			NW.innerWindowDrag.callback({obj: currentWindow, numAdded: difference});
		}
		
		/*switch (theFunction) {
			case "image":
				//NW.editor.functions.changeImageSize(direction, difference);
				// BRING BACK console.log(this["NW"]);
				break;
			case "margin":
				NW.editor.functions.imageMarginChange(difference);
		}*/
		
		
		// Assign the current mouse position to the initial one for the next time the mouse moves
		//NW.innerWindowDrag.initMousePos = NW.innerWindowDrag.currentMousePos;
	},
	ondragend: function(e) {
		// If the mouse was not moved, focus on the input
		
		// Delete the class
		
		// Remove div over everything
		if (NW.innerWindowDrag.overAllDiv) {
			NW.innerWindowDrag.overAllDiv.parentNode.removeChild(NW.innerWindowDrag.overAllDiv);
			NW.innerWindowDrag.overAllDiv = null;
		}
		
		// Delete the global variables
		NW.innerWindowDrag = {};
		
		// Delete the listeners
		window.removeEventListener("mousemove", NW.innerWindow.ondrag, false);
		window.removeEventListener("mouseup", NW.innerWindow.ondragend, false);
	}
};

//NWEditPage = document.getElementById("NWEditPage").contentWindow;
NW.editor.checkQueryState = function () {
	if (!NWEditPage) return false;
	if (NWEditPage.document.body.innerHTML == "") return false;
	
	// Font Style
	if(NWEditPage.document.queryCommandState('bold'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWBold").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWBold").removeClass("NWSelected");
	if(NWEditPage.document.queryCommandState('italic'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWItalic").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWItalic").removeClass("NWSelected");
	if(NWEditPage.document.queryCommandState('underline'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWUnderline").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWUnderline").removeClass("NWSelected");
	if(NWEditPage.document.queryCommandState('strikethrough'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWStrikethrough").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWStrikethrough").removeClass("NWSelected");
	// Font Color
	if(NWEditPage.document.queryCommandValue('forecolor')) {
		jQuery.farbtastic("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontColor .NWColorPickerWindow .NWColorPicker").setColor(NW.colors.RGB(NWEditPage.document.queryCommandValue("forecolor")));
	}
	// Highlight Color
	if(NWEditPage.document.queryCommandValue('hilitecolor'))
		jQuery.farbtastic("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWHighlightColor .NWColorPickerWindow .NWColorPicker").setColor(NW.colors.RGB(NWEditPage.document.queryCommandValue("hilitecolor")));
	if(NWEditPage.document.queryCommandValue('hilitecolor') == "transparent" || NWEditPage.document.queryCommandValue('hilitecolor') == "")
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWHighlightColor a.NWHighlightColorNone").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWHighlightColor a.NWHighlightColorNone").removeClass("NWSelected");
	// Background Color
	if(NWEditPage.document.queryCommandValue('backcolor'))
		jQuery.farbtastic("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWBackgroundColor .NWColorPickerWindow .NWColorPicker").setColor(NW.colors.RGB(NWEditPage.document.queryCommandValue("backcolor")));
	if(NWEditPage.document.queryCommandValue('backcolor') == "transparent" || NWEditPage.document.queryCommandValue('backcolor') == "")
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWBackgroundColor a.NWBackgroundColorNone").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWBackgroundColor a.NWBackgroundColorNone").removeClass("NWSelected");
	// Text Position
	if(NWEditPage.document.queryCommandState('superscript'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWTextPosition a.NWTextSuper").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWTextPosition a.NWTextSuper").removeClass("NWSelected");
	if(NWEditPage.document.queryCommandState('subscript'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWTextPosition a.NWTextSub").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWTextPosition a.NWTextSub").removeClass("NWSelected");
	// Text Align
	/*if(document.queryCommandState('justifyleft'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignLeft").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignLeft").removeClass("NWSelected");
	if(document.queryCommandState('justifycenter'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignCenter").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignCenter").removeClass("NWSelected");
	if(document.queryCommandState('justifyright'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignRight").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignRight").removeClass("NWSelected");
	if(document.queryCommandState('justifyfull'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignFull").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontStyle a.NWAlignFull").removeClass("NWSelected");*/
	// Font Size
	if(NWEditPage.document.queryCommandValue('fontsize') != false) {
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontSize select.NWSetFontSize option").each(function() {
			var found = false;
			//if( $(this).attr("value") == document.queryCommandValue('fontsize') ) {
			if( $(this).attr("value") == "" ) {
				//$(this).attr("selected","selected");
				found = true;
			}
			
			//attr.("value",document.queryCommandValue('fontsize'));
		});
	}
	// Font Family
	if(NWEditPage.document.queryCommandValue('fontname')) {
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWFontFamily select.NWSetFontFamily").children().each(function() {
			var tempFontName = $(this).val();
			var tempFontNameLength = tempFontName.length;
			var fontName = NWEditPage.document.queryCommandValue('fontname').replace(/\'/gi,"").replace(/\"/gi,"");
			fontName = fontName.substring(0, tempFontNameLength);
			//if(NWEditPage.document.queryCommandValue('fontname').replace(/\'/gi,"").replace(/\"/gi,"") == $(this).attr("value")) {
			if (fontName == tempFontName) {
				$(this).attr("selected","selected");
				$(this).parent().css("font-family",$(this).css("font-family"));
			}
			
		});
	}
	// List Style
	if(NWEditPage.document.queryCommandEnabled('insertunorderedlist') && NWEditPage.document.queryCommandState('insertunorderedlist'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWListStyle a.NWUnorderedList").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWListStyle a.NWUnorderedList").removeClass("NWSelected");
	if(NWEditPage.document.queryCommandState('insertorderedlist'))
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWListStyle a.NWOrderedList").addClass("NWSelected");
	else
		$("div#NWEditPanel .NWEditPanelGroup .NWEditControls.NWListStyle a.NWOrderedList").removeClass("NWSelected");
		
	// Tests: Delete
	//// BRING BACK console.log(NWEditPage.document.queryCommandState("justifyLeft"));
	//// BRING BACK console.log(NWEditPage.document.queryCommandValue("justifyLeft"));
	//// BRING BACK console.log(NWEditPage.document.queryCommandSupported("justifyLeft"));
	//// BRING BACK console.log(NWEditPage.document.queryCommandEnabled("justifyLeft"));
	//// BRING BACK console.log(NWEditPage.document.queryCommandIndeterm("justifyLeft"));
	//// BRING BACK console.log(document.getElementById("NWEditPage"));
	//// BRING BACK console.log(NWEditPage.document.queryCommandValue("fontsize"));
	
	// Get Selection
	if(NWEditPage.document.getSelection)
		return NWEditPage.document.getSelection();
	else
		return "";
}