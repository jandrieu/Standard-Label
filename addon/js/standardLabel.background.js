if(typeof standardLabel == "undefined")
	var standardLabel = {};

standardLabel.activeHtml = "active.html";
standardLabel.defaultHtml = "default.html";

standardLabel.tabUpdate = function(tabId, changeInfo, tab) {
	console.log("tabupdate change info: "+JSON.stringify(changeInfo));
	console.log("tabupdate tab info: "+JSON.stringify(tab));
	var data;
	switch(changeInfo.status) {
	   case "complete" : 
	        data = standardLabel.setData(tab.url,tab.windowId,tabId);
					standardLabel.setIcon(data);
					standardLabel.setPopupHtml(data);
	        break;
	    case "loading" :
	        break;
	    default: 
	        console.log("unknown changeInfo status in standardLabelTabUpdate");
	}
}

standardLabel.tabActivate = function(activeInfo) {
	console.log("tabActivate activeInfo: "+JSON.stringify(activeInfo));
}

standardLabel.tabHighlight = function(highlightInfo) {
	console.log("tabActivate highlightInfo: "+JSON.stringify(highlightInfo));
}


standardLabel.setData = function(url,windowId,tabId) {
	var data = {"source" : url,
					 	 	"tabId" : tabId};
	var package = standardLabel.checkOAuth(url);
	if(package) {
		data.type="OAuth";
		data.handler=package.handler;
		data.target=package.redirect;
		data.label=package.label;
	} else {
	  data.type="default"; // target can be ignored
	}
	return data;
}
												
standardLabel.setIcon = function(data) {
	if(data.type == "OAuth") {
		chrome.browserAction.setIcon({path: "images/active.19x19.png", "tabId":data.tabId});
	} else {
		chrome.browserAction.setIcon({path: "images/default.19x19.png", "tabId":data.tabId});
	}
	return;
}

standardLabel.setPopupHtml = function(data) {
	
	var url;
	switch(data.type) {
		case "default" :
			url=standardLabel.defaultHtml;
			break;
		case "OAuth" :
			url=standardLabel.activeHtml;
			break;
		default:
			console.log("error: unknown data.type in standardLabel.setPopupHtml() : "+data.type);
			return;
	}
	if(data)
		url+= "?data="+encodeURIComponent(JSON.stringify(data));
		
	chrome.browserAction.setPopup({"tabId":data.tabId,"popup":url});
}



chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "hello")
			sendResponse({farewell: "goodbye"});
	});


var standardLabelSource = {};

standardLabel.loadIntercepts = function(callback) {
	var url = "http://standardlabel.org/intercepts/intercepts.json";
	$.ajax({
		url: url,
		dataType: "json",
		crossDomain: true,
		error: function(jqXHR, textStatus, error){
		 console.log("Failed to get intercepts from "
								 +url
								 +" status: "
								 +textStatus
								 +" error: "
								 +JSON.stringify(error));
		},
		success: function(data, textStatus, jqXHR){
		 console.log("Got intercepts from "
								 +url
								 +" status: "
								 +textStatus);
			
			if(typeof data != "object") {
				console.log("unknown data type in standardLabel.loadIntercepts");
				if(callback && typeof callback == "function") 
				  callback();
				else
				  return;
			}
			
			if(!(data instanceof Array)) {
				console.log("unknown object type in standardLabel.loadIntercepts");
				if(callback && typeof callback == "function") 
				  callback();
				else
				  return;
		  }
			// first, pre-process all regex fields
			for(i=0;i<data.length;i++) {
				if(data[i].hit)
					data[i].hit = new RegExp(data[i].hit,"i");
				if(data[i].extract)
					data[i].extract = new RegExp(data[i].extract,"i");
			}
			standardLabelSource.urlIntercepts = data;
			if(callback && typeof callback == "function") 
			  callback();
			else
			  return;
		}
	});			 
};

standardLabel.checkOAuth = function(url) {
	// a simple look up to test if the current URL is a known OAuth transaction.
	// if it is, call the handler and return the label
	
	// for now we just check for facebook OAuth
	//https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location
	result = {};
	for(i = 0; i<standardLabelSource.urlIntercepts.length; i++) { // run through all the intercepts
		intercept = standardLabelSource.urlIntercepts[i];
		console.log("testing intercept "+i+" "+intercept.hit.test(url) + " on " + url);
		// first test for the hit
		if(intercept.hit.test(url)) {
			// since this is for OAuth, we also need to extract the redirect_URI as the 
			// label is keyed on both
			
			result.handler = intercept.handler;
			if(intercept.extract) {  // extract data to pass to the handler
				extraction = intercept.extract.exec(url);
				if(extraction) {
					result.redirect = decodeURIComponent(extraction[1]);
					result.label = standardLabel.getLabel(result.handler,result.redirect);
					if(result.label)
					  return result;  // return only if there's a valid target that we know (this is OAuth!)
				}
			} else { // just get the label 
				result.label = standardLabel.getLabel(result.handler);
				return result;
			}
		}
	}
}


// labels are provided as arrays keyed to their handler
// so, all Facebook apps are indexed to "facebook"
// sstandardLabelSource.labels = 

standardLabel.loadLabels = function(callback) {
	var url = "http://standardlabel.org/labels/labels.js";
	
//	var xhr = new XMLHttpRequest();
//	var j;
//	xhr.open("GET", url, true);
//	xhr.onreadystatechange = function() {
//		if (xhr.readyState == 4) {
//			console.log(xhr.responseText);
//			try {
//				j = JSON.parse(xhr.responseText);
//			}
//			catch(e) {
//				console.log("parse error in standardLabel.loadLabels: "+e+" ||| "+JSON.stringify(e));
//			}
//			
//			console.log(j);
//		}
//	}
//	xhr.send();
//	return;
	
	
	
	
	$.ajax({
		url: url,
		dataType: "text json",
		error: function(jqXHR, textStatus, error){
		 console.log("Failed to get labels from "
								 +url
								 +" status: "
								 +textStatus
								 +" error: "
								 +error);
		},
		success: function(data, textStatus, jqXHR){
		 console.log("Labels loaded from "
								 +url
								 +" status: "
								 +textStatus);
			
			if(typeof data != "object") {
				console.log("unknown data type in standardLabel.loadLabels");
				return;
			}


			standardLabelSource.labels = data;
			standardLabel.convertRedirectRx();

			
			if(callback && typeof callback == "function") 
			  callback();
			else
			  return;
		}
	});			 
};
standardLabel.convertRedirectRx = function(labels) {
  // for the label types that have a redirectRX
	// convert all their labels' redirectRX to a RegEx
	
	if(!labels) { // treat the labels as a heterogeneous source
		for(type in standardLabelSource.labels) {
			switch(type) {
				case "google_search" : // they don't have a redirectRX
					break;
				case "facebook" : // 
				  standardLabel.convertRedirectRx(standardLabelSource.labels[type]); // call ourselves to do the real work
					break;
				default:
				  console.log("Unknown type in standardLabel.convertRedirectRx = function(labels) ");
			}
		}
	} else { // we have a set of labels of the same type (all with redirectRX)
	  // first, pre-process all regex fields
			for(i=0;i<labels.length;i++) {
				if(labels[i].redirectRx) {
					labels[i].redirectRx = new RegExp(labels[i].redirectRx,"i");
				}
			}
	}
};

standardLabel.getLabel = function(handler,redirect) {
	var redirectKey;
	switch(handler) {
		case "facebook":
			return standardLabel.getFacebookLabel(redirect);
			break;
		case "google_search":
			return standardLabel.getDefaultLabel(handler);
		default: 
			console.log("Unknown handler in StandardLabel.getLabel: "+handler);			
	}
}

standardLabel.getFacebookLabel = function(redirect) {
	labels = standardLabelSource.labels["facebook"];
	for (i=0; i<labels.length; i++){
		if(labels[i].redirectRx.exec(redirect)){
			console.log("redirect found:"+labels[i].name);
			return labels[i].labelData;
		}
	}
}

standardLabel.getDefaultLabel = function(handler) {
	return standardLabelSource.labels[handler].labelData; // there is only one label
}
standardLabelTester = {};

standardLabelTester.urlInterceptTest = function() {
		
	// We run every intercept hit for a mtach and test against the isMatch.
	// If it is a match, and it passes the match test, we run the extraction test
	// Therefore, if tests[i].isMatch is false, the extraction is never run.
	
//	standardLabelSource.urlIntercepts = [{
//		hit : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
//		extract : /redirect_uri=([^&]*)(?:&|$)/,
//		name : "Facebook OAuth Permissions",
//		id : "facebook", // must be unique
//		tests: [{	
//			name: "basic facebook extraction #1",
//			data: "https://www.facebook.com/dialog/o",
//			isMatch: true,
//			extraction:"http%3A%2F%2Fapps.facebook.com%2F"
//		}]

		console.log("testing url intercepts");
		if(!standardLabelSource.urlIntercepts) {
			console.log("no intercepts to test");
			return false;
		}
		
		var success = true;
		var intercept,test,extraction,i,j,match;
		for(i = 0; i<standardLabelSource.urlIntercepts.length; i++) { // run through all the intercepts
			intercept = standardLabelSource.urlIntercepts[i];
			
			for(j = 0; j<intercept.tests.length; j++) {  // do all the tests
				test = intercept.tests[j];

				// first test for the hit
				match = intercept.hit.test(test.data);
				if(match==test.isMatch) {
					console.log("URL intercept hit "+j+" ("+intercept.name+":"+test.name+") passed on " + test.data);
					
					if(match & intercept.extract) {
						// then test for the extraction
						extraction = intercept.extract.exec(test.data);
						if(extraction) extraction=extraction[1]; // make sure we pass the test before we try for the extracted data
						if(test.extraction == extraction) {
							console.log("URL intercept extraction "+j+" ("+intercept.name+") passed");
						} else {
							console.log("URL intercept extraction "+j+" ("+intercept.name+") failed: \""+extraction+"\"");
							success = false;
						}
					}
					
				} else {
					console.log("URL intercept hit "+j+" ("+intercept.name+") failed on " + test.data);
					success = false;
				}
			}
		}

		if(!success) 
			console.log("************************\nURL intercept tests FAILED!\n************************");
		else
			console.log("URL intercept tests passed.");

		return success;
}

standardLabelTester.labelTest = function() {
	
	// this should test against the schema.
	// but we don't yet.
	// for Facebook, we actually have to check the regexes for the redirect test

	var success = true;
	
	if(success) {
		success = standardLabel.testFacebookLabels(standardLabelSource.labels['facebook']);
		if(!success) 
			console.log("************************\nFacebook Label tests FAILED!\n************************");
		else
			console.log("Label tests passed.");
	}
	if(!success) 
		console.log("************************\nLabel tests FAILED!\n************************");
	else
		console.log("Label tests passed.");

	return success;
}


//  	"name": "Guardian Facebook App",
//  	"id": "facebook_guardian",
//  	"redirectRx": /^http:\/\/apps\.facebook\.com%\/theguardian/,
//  	"tests": [{
//  				      name: "Guardian Facebook App redirect",
//  							data : //"http://apps.facebook.com/theguardian/authenticated/commentisfree/2012/jul/08/andy-murray-not-miserable-just-normal?fb_source=other_multiline&fb_action_types=news.reads",
//  							isMatch : true
//              }],
//  	"labelData" : ...
standardLabel.testFacebookLabels = function(labels){
	var success = true;
	var match;
	
	for(i=0; i<labels.length; i++) {		// run all the labels for Facebook
		label = labels[i];
		for(j=0; j<label.tests.length;j++) { // now all the tests for each label
			test = label.tests[j];
      match = label.redirectRx.test(test.data);
      if(match==test.isMatch) {
      	console.log("label match test "+j+" : "+ test.name +" for label "+label.name+" passed");
      } else {
      	console.log("label match test "+j+" : "+ test.name +" for label "+label.name+" failed");
      	success = false;
      }
		}
  }
	return success;
}

standardLabel.testDefaultLabel = function(label) {
	// right now, default labels don't have a test. The tests are in the intercept
	return true;
}
								 
standardLabelTester.test = function() {
  var success = true;

	success = standardLabelTester.urlInterceptTest() && success
	success = standardLabelTester.labelTest() && success;


	if(!success) 
		console.log("************************\nStandard Label tests FAILED!\n************************");
	else
		console.log("Standard Label tests passed.");

};


standardLabel.start = function() {
	// set up test run (set to null to skip tests);
  standardLabel.test = standardLabelTester.test;

  // load assets
	standardLabel.loadIntercepts(function(){
		standardLabel.loadLabels(standardLabel.test);
		}); // nested callbacks assure we load both intercepts and labels before we  run our tests
}();

chrome.tabs.onUpdated.addListener(standardLabel.tabUpdate);
//chrome.tabs.onUpdated.addListener(standardLabel.tabActivate);
chrome.tabs.onHighlighted.addListener(standardLabel.tabHighlight);


//http://www.google.com/#hl=en&sclient=psy-ab&q=asdfa&oq=asdfa&gs_l=hp.3..0i10j0l3.5846.6101.0.7392.5.4.0.0.0.0.227.813.0j2j2.4.0.eqn%2Crate_low%3D0-025%2Crate_high%3D0-025%2Cmin_length%3D2%2Ccconf%3D1-0%2Csecond_pass%3Dfalse%2Cnum_suggestions%3D1%2Cignore_bad_origquery%3Dtrue..0.0...1c.A5ZFqLtb-7o&pbx=1&bav=on.2,or.r_gc.r_pw.r_qf.&fp=b752d12a099bb300&biw=1110&bih=763

