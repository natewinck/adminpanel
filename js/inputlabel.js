function onInputFocus() {
	//console.log(this);
	if (this.nodeName == "INPUT") {
		var placeholder = $(this).prev().children()[0];
		var input = this;
	} else {
		var placeholder = $(this).children()[0];
		var input = $(this).next()[0];
	}
	//console.log(placeholder);
	if ($(placeholder).hasClass("focus")) return false;
	//console.log("here");
	//console.log(placeholder);
	$(placeholder).addClass("focus");
	//$(placeholder).addClass("focus", 250);
	
	$(placeholder).animate(
		{
			color: "#cccccc"
		},
		{
			queue: false,
			duration: 250
		}
	);
	
	// Make sure the listener hasn't been set yet
	input.removeEventListener("keydown", onInputType, false);
	input.addEventListener("keydown", onInputType, false);
	
	// Make sure the listener hasn't been set yet
	input.removeEventListener("blur", onInputBlur, false);
	input.addEventListener("blur", onInputBlur, false);
	
	// Focus on the input
	if (this.nodeName != "INPUT") input.focus();
}

function onInputType() {
	// If the user has already type, nothing else has to be done
	if (this.value != "") return false;
	
	var placeholder = $(this).prev().children()[0];
	//$(placeholder).addClass("hidden");
	$(placeholder).css("opacity", 0);
}

function onInputBlur() {
	if (this.value != "") return false;
	
	var placeholder = $(this).prev().children()[0];
	$(placeholder).removeClass("hidden").removeClass("focus");
	//$(placeholder).parent().removeClass("focus");
	$(placeholder).css("opacity", "1");
	$(placeholder).animate(
		{
			color: "#999999"
		},
		{
			queue: false,
			duration: 250
		}
	);
}