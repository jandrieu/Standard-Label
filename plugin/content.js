
    function mylog(msg) {
        output = "***************************\n";
        output += msg + "\n";
        console.log(output);
    }

    function getRequestingWebsiteData() {

        var requester = new Object;
            
        
        $appName = $("div.mts.fsxl.fwb.fcb");
        
        if(!$appName.length) {
            mylog("can't find name");
            return requester;
        }
        requester.name = $appName.text();
        
        $appIcon = $("img.logo.UIImageBlock_Image.UIImageBlock_ICON_Image.img");
        if(!$appIcon.length) {
            mylog("can't find icon");
            return requester;
        }
        
        requester.icon = encodeURIComponent($appIcon.attr("src"));
        return requester;
    }
    
     
    function launchShowMeTab(perms) {
        // set up fbIFrame
        if(!perms) perms  = "ISHAREDWHAT_NO_PERMS";
        var permString = perms ? "?perms="+perms : "";
        permString = permString.replace(/, /g,",");
        
        var requester = getRequestingWebsiteData();
        var requesterString = "&requesterName="+requester.name+"&requesterIcon="+requester.icon;
        
		var targetUrl = "http://www.showmefirst.info/permissions.html"+permString+requesterString;
		//alert(targetUrl);
		window.open(targetUrl);
            
    };
    
    function getUrlVar(name){
        return unescape(getUrlVars()[name]);
    }
    
    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = document.URL.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
   if(document.URL.indexOf("origin%3Dhttp%253A%252F%252Fwww.showmefirst.info")<0) {
	launchShowMeTab(getUrlVar("scope"));
   }
