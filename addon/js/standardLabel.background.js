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

standardLabelSource.urlIntercepts = [{
				hit : /^https:\/\/www\.facebook\.com\/dialog\/oauth/,
				extract : /redirect_uri=([^&]*)(?:&|$)/,
				name : "Facebook OAuth Permissions",
				handler : "facebook",  
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
				handler: "facebook",
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
				},{
				hit : /^https:\/\/www\.facebook\.com\/connect\/uiserver\.php\?.*&method=permissions.request/,
				extract : /redirect_uri=([^&]*)(?:&|$)/,
				name : "Facebook Permissions through UIServer Page",
				handler: "facebook",
				id : "facebook2",
				tests : [
				    {
				      name: "Facebook UIServer extraction 1",
							data : "https://www.facebook.com/connect/uiserver.php?app_id=225496380820004&method=permissions.request&redirect_uri=https%3A%2F%2Fapps.facebook.com%2Fsimcitysocial%2F%3Fpf_ref%3Dx1027_US_NNG-US-M-18-137--6974%26nan_pid%3D70097715&response_type=none&display=page&auth_referral=1",
							isMatch : true,
							extraction : "https%3A%2F%2Fapps.facebook.com%2Fsimcitysocial%2F%3Fpf_ref%3Dx1027_US_NNG-US-M-18-137--6974%26nan_pid%3D70097715"
             }]
         },
				{
				hit : /http(s|):\/\/www\.google\.com($|\/$|\/search\?|\/$|\/webhp|\/#)/,
				comment: "Should capture all google.com search URLs and google.com by itself, and /webhp and /#, but no other google URLs",
				name : "Google Search",
				handler: "google_search",
				id : "google_search", // must be unique
				tests: [
					{	
						name: "Google Home Page with slash",
						data: "https://www.google.com/",
						isMatch: true
					},{
						name: "google result problematic",
						data: "https://www.google.com/#q=London+2012+javelin&oi=ddle&ct=javelin-2012-hp&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.&fp=3caf70095441cb5a&biw=1110&bih=763",
						isMatch: true // failing test
					},{
						name: "Google doodle clickthrough",
						data: "https://www.google.com/webhp?hl=en&tab=ww&authuser=0#q=London+2012+hurdles&oi=ddle&ct=hurdles-2012-hp&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.&fp=3caf70095441cb5a&biw=1110&bih=763",
						isMatch: true
					},{	
						name: "Google Home Page",
						data: "https://www.google.com",
						isMatch: true
					},{
						name: "Embedded Google.com",
						data: "https://www.joeandrieu.com/test&q=http://google.com",
						isMatch :false
					},{	
						name: "",
						data: "https://www.google.com/search? sourceid=chrome&ie=UTF-8&q=wacaca",
						isMatch: true,
					},{	
						name: "",
						data: "http://example.com/google.com/cheese",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/calendar/render",
						isMatch: false,
					},{	
						name: "",
						data: "http://docs.google.com",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/search?sourceid=chrome&ie=UTF-8&q=testy",
						isMatch: true,
					},					{	
						name: "",
						data: "https://www.google.com/search?hl=en&q=news&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&biw=1024&bih=538&um=1&ie=UTF-8&tbm=isch&source=og&sa=N&tab=wi&ei=31sRUPjDMaPl0QHD4oDgAQ",
						isMatch: true,
					},{	
						name: "",
						data: "https://mail.google.com/mail/u/0/",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/mobile/?tab=wD",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/offers/home?utm_source=xsell&utm_medium=products&utm_campaign=sandbar&tab=wG#!details",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/shopping?hl=en&tab=Gf",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/finance?tab=ye",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/latitude/b/0?hl=en",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/calendar/render?hl=en&pli=1",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/talk/",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/wallet/#utm_source=EMB&utm_medium=emb-more&utm_campaign=en-US",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/wallet/#utm_source=EMB&utm_medium=emb-more&utm_campaign=en-US",
						isMatch: false,
					},{	
						name: "",
						data: "https://accounts.google.com/ServiceLogin?service=orkut&continue=http%3A%2F%2Fwww.orkut.com&n hl=en",
						isMatch: false,
					},{	
						name: "", 
						data: "http://www.google.com/reader/view/?hl=en&source=mmm-en#overview-page",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/cse/?hl=en",
						isMatch: false,
					},{	
						name: "",
						data: "http://scholar.google.com/schhp?hl=en",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/trends/",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/alerts?hl=en",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/finance",
						isMatch: false,
					},{	
						name: "",
						data: "https://www.google.com/?tbm=pts&hl=e",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/blogsearch?hl=en",
						isMatch: false,
					},{	
						name: "",
						data: "http://www.google.com/fusiontables/Home/",
						isMatch: false,
					}
					]	
				}];


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
standardLabelSource.labels = {	
	"facebook" : [{
  	"name": "Guardian Facebook App",
  	"id": "facebook_guardian",
  	"redirectRx": /^http:\/\/apps\.facebook\.com\/theguardian/,
  	"tests": [{
  				      name: "Guardian Facebook App redirect",
  							data : "http://apps.facebook.com/theguardian/authenticated/commentisfree/2012/jul/08/andy-murray-not-miserable-just-normal?fb_source=other_multiline&fb_action_types=news.reads",
  							isMatch : true
              }],
  	"labelData" : 
		{
			type: "facebook",
      shared_data:[
    		"Your basic info (name, profile picture, gender, networks, user ID, list of friends, any other information you made public)",
      	"Your e-mail address",
      	"Your birthday",
      	"Your location"],
      data_source:{"source":"3rd Party", "source_link":{"type":"url","name":"Facebook","url":"http://facebook.com"}},
      availability:"On Submission",
      data_recipient:{"name":"The Guardian", "source_link":{"url":"http://www.guardian.co.uk"}},
      location:"United Kingdom",
      contact:[{"type":"page","url":"http://www.guardian.co.uk/help/contact-us"}],
      purpose:"This app may post on your behalf, including videos you watched, articles you read and more.",
      for_how_long:"Indefinite.",
      output_to:"Posts to your Facebook wall",
      revocation:"Facebook permissions may be revoked. Data may be retained by The Guardian.",
      redistribution:"Unknown",
      access:"Unknown",
      related_agreements:[
    		{ "name":"The Guardian Facebook app terms of service",
				  "citation": {
						"url":"http://www.guardian.co.uk/info/2011/sep/22/2?fb=native"
					},{"name":"The Guardian Website Terms of Service","url":"http://www.guardian.co.uk/help/terms-of-service"}],
      third_party_ratings:[
    		{"name":"Mozilla",
				  "id" :"mozilla_privacy",
    			"url":"https://showmefirst.info/ratings/mozilla/theguardian.html",
    			"icon":"https://wiki.mozilla.org/images/thumb/f/fb/Privacyiconslogo.png/100px-Privacyiconslogo.png"},
    		{"name":"The Cake is a Lie",
				  "id" :"cake_is_a_lie",
    			"url":"https://showmefirst.info/ratings/cake/theguardian.html",
    			"icon":"https://showmefirst.info/ratings/cake/cake.png"}],
      author:{"service":"The Standard Crowd","author":"Joe Andrieu","url":"http://standardlabel.org/crowd/joeandrieu"},
			version:"http://standardlabel.org/v/0.5"
    }
		}],
	"google_search" : {
		name: "Google Search",
		id: "google_search",
		labelData : {
			type: "google",
			shared_data:"Search Terms",
			data_source:{
				source:"Web Form", 
				source_link:{
					"type":"onpage",
					"name":"Search Box",
					"selector":"input[name=q]",
					"parent_selector":"td"
				}
			},
			availability:{
				standard_term:"Interactive", 
				detail:"as you type"
			},
			data_recipient:{
				name:"Google, Inc.", 
				source_link:{
					url:"http://www.google.com"
				}, 
				citation:{
					url:"http://www.google.com/goodtoknow/data-on-google/search-logs/",
					access_date:"2012-07-25"
				}
			},
			location:{
				term:"California, United States; Finland; Belgium; Singapore; Hong Kong; Taiwan", 
				citation:{
					url:"http://www.google.com/goodtoknow/data-on-google/search-logs/",
					access_date:"2012-07-25"
				}
			},
			contact:[{
				type:"page",
				url:"http://www.google.com/contact/"
			}],
			purpose:"Recommend web pages",
			for_how_long:{
				term:"Indefinitely. Anonymized when removed.", 
				citation:{
					url:"http://www.google.com/goodtoknow/data-on-google/search-logs/",
					access_date:"2012-07-25"
				}
			},
			output_to:{
				standard_term:"Current Web Page", 
				detail:"Search Results"
			},
			revocation:{
				description:"Partially revocable. Non-revocable logs retained for analytics, auditing, and service improvement. ", 
				url:"https://www.google.com/history/", 
				citation:{
					url:"https://www.google.com/intl/en/policies/privacy/#nosharing",
					access_date:"2012-07-25"
				}
			},
			redistribution:{
				term:"External processing in confidence, to protect the public, due process, administrators, with consent. Aggregated, non-PII with partners.", 
				citation:{
					url:"https://www.google.com/intl/en/policies/privacy/#nosharing",
					access_date:"2012-07-25"
				}
			},
			access:{
				url:"https://www.google.com/dashboard/"
			},
			additional_terms: [{
													standard_term : "Statistical Aggregation",
													detail : "Search Trends" ,
													citation: {
														url : "https://www.google.com/intl/en/policies/privacy/#nosharing",
														access_date : "2012-07-25"}
												},{
													standard_term : "Promotional Offers",
													detail : "ad network optimization",
													citation: {
														url : "https://www.google.com/intl/en/policies/privacy/#infouse",
														access_date : "2012-07-25"}
												}],
			related_agreements:[{
				name:"Privacy Policy",
				citation: {
					url:"https://www.google.com/intl/en/policies/privacy/",
					access_date: "2012-07-25"
				}
			},{
				name:"Google Terms of Service",
				citation: {
					url:"https://www.google.com/intl/en/policies/terms/",
					access_date: "2012-07-25"
				}
			}],
			third_party_ratings:[{
				name:"Mozilla",
				url: "https://showmefirst.info/ratings/mozilla/google.html",
				icon:"https://wiki.mozilla.org/images/thumb/f/fb/Privacyiconslogo.png/100px-Privacyiconslogo.png"
			}],
			author:{
				service:"The Standard Crowd",
				author:"Joe Andrieu",
				url:"http://standardlabel.org/crowd/joeandrieu"
			},
			version:"http://standardlabel.org/v0.5"
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
		
	// We run every label hit test.
	
//	standardLabelSource.labels = {
//	"facebook" : [{
//  	"name": "Guardian Facebook App",
//  	"id": "facebook_guardian",
//  	"redirectRx": /^http:\/\/apps\.facebook\.com%\/theguardian/,
//  	"tests": [{
//  				      name: "Guardian Facebook App redirect",
//  							data : //"http://apps.facebook.com/theguardian/authenticated/commentisfree/2012/jul/08/andy-murray-not-miserable-just-normal?fb_source=other_multiline&fb_action_types=news.reads",
//  							isMatch : true
//              }],
//  	"labelData" : 
//		{
//      requested_data:[

		// NOTE: Eventually this should test the label data itself against a standard.

		console.log("testing label regexs");
		var success = true;
		for(i in standardLabelSource.labels) { // run through all the handlers

			// I really don't know if these are going to be different for different handlers
			// but they might be
  		switch(i) {
  			case "facebook":
  				success = standardLabel.testFacebookLabels(standardLabelSource.labels[i]) && success;
  				break;
			case "google_search":
				success = standardLabel.testDefaultLabel(standardLabelSource.labels[i]) && success;
				break;
  			default:
  				console.log("Unknown label handler in standardLabelSource.labels");
  				success = false;
  		}			
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

standardLabelTester.test();


chrome.tabs.onUpdated.addListener(standardLabel.tabUpdate);
//chrome.tabs.onUpdated.addListener(standardLabel.tabActivate);
chrome.tabs.onHighlighted.addListener(standardLabel.tabHighlight);


//http://www.google.com/#hl=en&sclient=psy-ab&q=asdfa&oq=asdfa&gs_l=hp.3..0i10j0l3.5846.6101.0.7392.5.4.0.0.0.0.227.813.0j2j2.4.0.eqn%2Crate_low%3D0-025%2Crate_high%3D0-025%2Cmin_length%3D2%2Ccconf%3D1-0%2Csecond_pass%3Dfalse%2Cnum_suggestions%3D1%2Cignore_bad_origquery%3Dtrue..0.0...1c.A5ZFqLtb-7o&pbx=1&bav=on.2,or.r_gc.r_pw.r_qf.&fp=b752d12a099bb300&biw=1110&bih=763

