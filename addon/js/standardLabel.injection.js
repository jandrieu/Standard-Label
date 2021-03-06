console.log("loading standardLabel.js");

if(typeof standardLabel == "undefined")
	var standardLabel = {};

standardLabel.highlights = new Array();

standardLabel.highlight = function(request,sender,callBack) {
	if(request.method) {
		switch(request.method) {
			case "highlight" : 	standardLabel.highlightSelector(request.selector);
													break;
			default:
				console.log("UNKNOWN REQUEST METHOD in standardLabel.highlight");
		}
	}
	if(typeof callback == "function") 
	  callback("highlighted");
}

standardLabel.highlightSelector = function(selector) {
	var $selection = standardLabel.getSelected(selector);
	
	if($selection) {
		var border = $selection.css("border");
		standardLabel.highlights.push(border);

		console.log("highlighting. old border: "+border);
		$selection.css("border","thick yellow solid");
		standardLabel.highlight.push(setTimeout(function(){
									$selection.css({ "border": standardLabel.highlights.pop()});
								}, 1000));
	}
}

standardLabel.getSelected = function(selector) {
	
	var selection;
	if(typeof selector == "string") {
		selection = $(selector);
	} else if(selector.item) {
			selection = $(selector.item);
			if(selector.parent) {
				selection = selection.parents(selector.parent);
				console.log(selection.length);
			}
	}
	
	return selection;
		
}
chrome.extension.onMessage.addListener(standardLabel.highlight);
																		 

