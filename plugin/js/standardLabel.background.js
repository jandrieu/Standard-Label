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
	var OAuth = standardLabel.checkOAuth(url)
	if(OAuth) {
		data.type="OAuth";
		data.target=OAuth;
	} else {
	  data.type="default"; // target can be ignored
	}
	return data;
}
												
standardLabel.setIcon = function(data) {
	if(data.type == "OAuth") {
		chrome.browserAction.setIcon({path: "images/active.19x19.png", "tabId":data.tabId});
		return OAuth;
	} else {
		chrome.browserAction.setIcon({path: "images/default.19x19.png", "tabId":data.tabId});
	}
	return undefined;
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

standardLabel.setTabStatus = function(url,windowId,tabId) {
    console.log("setTabStatus: "+windowId);
	if(typeof standardLabel.tabs[windowId] == "undefined")
		standardLabel.tabs[windowId] = [];
		
	standardLabel.stopAnimation(windowId,tabId);
	standardLabel.tabs[windowId][tabId] = "default";
	var OAuth = standardLabel.checkOAuth(url)
}
 
standardLabel.showStatus = function(windowId,tabId) {
	
    console.log("showStatus: "+windowId);

    if(windowId in standardLabel.tabs) {
        if(tabId in standardLabel.tabs[windowId]) {
            var status = standardLabel.tabs[windowId][tabId];
            standardLabel.windowStatus[windowId]={"status":status,"tabId":tabId};
        } else {
			standardLabel.windowStatus[windowId]="default";
		}
    }
    standardLabel.drawStatus(windowId,tabId); // this will paint the icon and start animation timer if necessary (for the window)
        
	return;
}

standardLabel.drawStatus = function(windowId,tabId) {
    console.log("drawStatus: "+windowId);

	var status=standardLabel.windowStatus[windowId];
	if(typeof status=="undefined" || status.status == "default") {
			console.log("setting default animation");
			standardLabel.stopAnimation(windowId,tabId);
	} else if ("type" in status.status){
		switch (status.status.type) {
			case "OAuth":
				standardLabel.animate(windowId,tabId);
				break;
			default:
				console.log("unknown status type in standardLabel.drawStatus: "+JSON.stringify(status));
		}
	} else {
		console.log("unknown status in standardLabel.drawStatus: "+JSON.stringify(status));
	}
}

//standardLabel.newTab = function (tabId, changeInfo, tab) 
//{
//	if (changeInfo.status == 'complete') 
//	{
//		var OAuth = standardLabel.checkOAuth(tab.url)
////		console.log(tab.url);
////		console.log("checkOAuth: "+JSON.stringify(standardLabel.checkOAuth(tab.url)));
////		chrome.browserAction.setIcon({path: "images/icon.png"})
//
//		if(OAuth) {
//			standardLabel.animate();			
//		} else {
//			standardLabel.stopAnimation();
//		}
//		if (tab.url.split('oauth').length > 1)
//		{
//		    
//		    var appName = tab.url.split('apps.facebook.com%2F')[1].split('%2F')[0];		    
//		    var actions = tab.url.split('scope=').pop();
//		}
//	}
//	//alert('called ' + JSON.stringify(changeInfo) + JSON.stringify(tab));
//}

standardLabel.animationNumber = 6;
standardLabel.animationInterval = 166;
standardLabel.animationCount = 0;
standardLabel.animationTimer = [];  // timers for every window

standardLabel.animate = function(windowId,tabId) {
    console.log("animate "+windowId);
	standardLabel.animationCount = 0;
	standardLabel.animationTimer[windowId] = setInterval(function(){standardLabel.doAnimation(windowId,tabId);}, standardLabel.animationInterval);

}

standardLabel.stopAnimation = function(windowId,tabId) {
    console.log("stopAnimation "+windowId);
	clearInterval(standardLabel.animationTimer[windowId]);
	standardLabel.animationTimer[windowId] = undefined;
	standardLabel.clearAnimation(tabId);
}

standardLabel.clearAnimation = function(tabId) {
	chrome.browserAction.setIcon({path: "images/default.19x19.png", "tabId":tabId});
}

standardLabel.doAnimation = function(windowId,tabId) {
 	if(standardLabel.animationCount++ %2)
		chrome.browserAction.setIcon({path: "images/icon.png", "tabId":tabId});
	else
		chrome.browserAction.setIcon({path: "images/default.19x19.png", "tabId":tabId});
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

standardLabelSource.urlIntercepts = [{
				hit : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
				extract : /redirect_uri=([^&]*)(?:&|$)/,
				name : "Facebook OAuth Permissions",
				id : "facebook", // must be unique
				tests: [
					{	
						name: "basic facebook extraction #1",
						data:"https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location",
						isMatch: true,
						extraction:"http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads"
					},
					{	
						name: "basic facebook extraction #2",
						data: "https://www.facbook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location",
						isMatch: false,
						extraction: undefined
					}
				]	
				},
				{
				hit : /^file:\/\/\/c:\/Users\/Joe\/Documents\/GitHub\/Standard-Label\/plugin\/test\.FB\.OAuth\.htm/i,
				extract : /redirect_uri=([^&]*)(?:&|$)/,
				name : "Facebook OAuth Test Page1",
				id : "facebookTest2", // must be unique
				tests: [
					{	
						name: "basic facebook TEST extraction #1",
        		data:"file:///c:/Users/Joe/Documents/GitHub/Standard-Label/plugin/test.FB.OAuth.htm"
,
						isMatch: true
					},
					{	
						name: "basic facebook TEST extraction #2",
		data:"file:///C:/Users/Joe/Documents/GitHub/Standard-Label/plugin/test.FB.OAuth.htm?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location"
,
						isMatch: true,
						extraction:"http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads"
					}

				]	
				}];


standardLabel.checkOAuth = function(url) {
	// a simple look up to test if the current URL is a known OAuth transaction.
	// if it is, extract the destination signature and return it
	
	// for now we just check for facebook OAuth
	//https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location

	for(i = 0; i<standardLabelSource.urlIntercepts.length; i++) { // run through all the intercepts
		intercept = standardLabelSource.urlIntercepts[i];
		
		// first test for the hit
		    var extraction =intercept.extract.exec(url);
		    if(extraction){  
		        extraction=extraction[1];
      			return decodeURIComponent(extraction); //exit early if we find it
        } else {
            return;
        }
	}
}

standardLabel.checkRedirect = function(uri) {
	
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
		var success = true;
		var intercept,test,extraction,i,j,match;
		for(i = 0; i<standardLabelSource.urlIntercepts.length; i++) { // run through all the intercepts
			intercept = standardLabelSource.urlIntercepts[i];
			
			for(j = 0; j<intercept.tests.length; j++) {  // do all the tests
				test = intercept.tests[j];

				// first test for the hit
				match = intercept.hit.test(test.data);
				if(match==test.isMatch) {
					console.log("URL intercept hit "+j+" ("+intercept.name+") passed");
					
					if(match) {
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
					console.log("URL intercept hit "+j+" ("+intercept.name+") failed");
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

								 
standardLabelTester.test = function() {
var success = true;

	success &= standardLabelTester.urlInterceptTest();

	if(!success) 
		console.log("************************\nStandard Label tests FAILED!\n************************");
	else
		console.log("Standard Label tests passed.");
	
};

standardLabelTester.test();


chrome.tabs.onUpdated.addListener(standardLabel.tabUpdate);
//chrome.tabs.onUpdated.addListener(standardLabel.tabActivate);
chrome.tabs.onHighlighted.addListener(standardLabel.tabHighlight);


