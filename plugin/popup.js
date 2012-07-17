// Copyright (c) 2012 Joe Andrieu
//
// Requires jquery.

$(document).ready(function() {
	var target;
	switch($("body").attr("id")) {
		case "default" :
			target = window.location.href;
			break;
		case "active" :
			target = extractData(window.location.search);
			break;
		default:
			console.log("loaded in unknown body. id = "+$("body").attr("id"));
	}
	if(target)
		addTarget(target);
});

var extractData = function(uri) { 
	console.log(typeof uri);
	if(typeof uri != "string" || uri[0] != "?")
		return undefined;
	
	data = uri.match(/(?:\?|&)data=([^&]*)(?:&|$)/)[1];
	console.log(data);
	data = decodeURIComponent(data);
	if(data[0] == "\"") {
		data = data.substring(1,data.length-2);
	}
	console.log(data);
	return data;
}

var addTarget = function(target) {
	$("a#target").attr("href",target).attr("target","_blank").append(target);
}
