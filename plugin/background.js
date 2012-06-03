chrome.tabs.onUpdated.addListener(rNewTab);

function rNewTab(tabId, changeInfo, tab) 
{
	if (changeInfo.status == 'complete') 
	{
		//alert(tab.url);
	
		if (tab.url.split('oauth').length > 1)
		{
		    
		    var appName = tab.url.split('apps.facebook.com%2F')[1].split('%2F')[0];		    
		    var actions = tab.url.split('scope=').pop();
		    //alert(appName + " ; " + actions);
		    chrome.tabs.executeScript(tabId, {file: "jquery-1.7.2.min.js"});
		    chrome.tabs.executeScript(tabId, {file: "content.js"});
		    //chrome.tabs.executeScript(tabId, {file: "content_script.js"});
		}
	}
	//alert('called ' + JSON.stringify(changeInfo) + JSON.stringify(tab));
}
