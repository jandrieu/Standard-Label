if(typeof standardLabel == "undefined")
	var standardLabel = {};

standardLabel.newTab = function (tabId, changeInfo, tab) 
{
	if (changeInfo.status == 'complete') 
	{
		console.log(tab.url);
		console.log("checkOAuth: "+JSON.stringify(standardLabel.checkOAuth(tab.url)));
															
		if (tab.url.split('oauth').length > 1)
		{
		    
		    var appName = tab.url.split('apps.facebook.com%2F')[1].split('%2F')[0];		    
		    var actions = tab.url.split('scope=').pop();
		    //alert(appName + " ; " + actions);
//            chrome.tabs.insertCSS(tabId, {file: "test.css"});
//            chrome.tabs.insertCSS(tabId, {file: "bootstrap.css"});
//            chrome.tabs.insertCSS(tabId, {file: "standardLabel.css"});
//		    chrome.tabs.executeScript(tabId, {file: "jquery-1.7.2.min.js"});
//            chrome.tabs.executeScript(tabId, {file: "popover.js"});
//            chrome.tabs.executeScript(tabId, {file: "dv.js"});
//		    chrome.tabs.executeScript(tabId, {file: "content_dv.js"});
		}
	}
	//alert('called ' + JSON.stringify(changeInfo) + JSON.stringify(tab));
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
				}];


//regexMatchTests = [{
//	"rx" : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
//	"data" :"https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location",
//	"result" : true
//}
//,{
//	"rx" : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
//	"data" :"https://www.facebok.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location",
//	"result" : false
//	}
//,{
//	"rx" : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
//	"data" :"https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location",
//	"result" : false
//	}
//];

standardLabel.checkOAuth = function(url) {
	// a simple look up to test if the current URL is a known OAuth transaction.
	// if it is, extract the destination signature and return it
	
	// for now we just check for facebook OAuth
	//https://www.facebook.com/dialog/oauth?client_id=180444840287&redirect_uri=http%3A%2F%2Fapps.facebook.com%2Ftheguardian%2Fauthenticated%2Fcommentisfree%2F2012%2Fjul%2F08%2Fandy-murray-not-miserable-just-normal%3Ffb_source%3Dother_multiline%26fb_action_types%3Dnews.reads&scope=publish_actions,email,user_birthday,user_location

	for(i = 0; i<standardLabelSource.urlIntercepts.length; i++) { // run through all the intercepts
		intercept = standardLabelSource.urlIntercepts[i];
		
		// first test for the hit
		if(intercept.hit.test(url))
			return decodeURIComponent(intercept.extract.exec(url)[1]); //exit early if we find it
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
						extraction = intercept.extract.exec(test.data)[1];
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

//standardLabelTester.test();


chrome.tabs.onUpdated.addListener(standardLabel.newTab);


										 