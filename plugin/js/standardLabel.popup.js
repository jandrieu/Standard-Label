// Copyright (c) 2012 Joe Andrieu
//
// Requires jquery.

$(document).ready(function() {
	var pivot;
	data = extractData(window.location.search);
  console.log(JSON.stringify(data));
	switch($("body").attr("id")) {
		case "default" :
			pivot = data.source;
			break;
		case "active" :
		  pivot = data.target;
			getLabelJSON(data);
			break;
		default:
			console.log("loaded in unknown body. id = "+$("body").attr("id"));
	}
	if(pivot)
		addPivot(pivot);
});

var extractData = function(uri) { 
	console.log(typeof uri + " : "+uri);
	if(typeof uri != "string")
		return undefined;
	
	data = new QueryData(uri).data;
//uri.match(/(?:\?|&)data=([^&]*)(?:&|$)/)[1];
//	data = decodeURIComponent(data);
//	if(data[0] == "\"") {
//		data = data.substring(1,data.length-2);
//	}
  data = JSON.parse(data);
	console.log(data);
	return data;
}

var addPivot = function(pivot) {
	$("a#pivot").attr("href",pivot).attr("target","_blank").append(pivot);
}

var getLabelJSON = function(data) {
	// run through the available processors until one of them claims the data
	var result = {};
	
	if(setLabelFacebook(result,data))
	   return result;

  // nothing hit
	return false;
}

var setLabelFacebook = function(result,data) {
	
}