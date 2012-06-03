
    function mylog(msg) {
        output = "***************************\n";
        output += msg + "\n";
        output += "***************************\n";
        console.log(output);
    }

    function getRequestingWebsiteData() {

        var requester = new Object;
            
        
        $appName = $("div.mts.fsxl.fwb.fcb");
        if(!$appName.length)
            $appName = $("div.perms_primaryTitle div.mts");
        
        if(!$appName.length) {
            mylog("can't find name");
            return requester;
        }
        requester.name = $appName.text();
        
        $appIcon = $("img.logo.UIImageBlock_Image.UIImageBlock_ICON_Image.img");
        if(!$appIcon.length)
            $appIcon = $("img.perms_logo");
        if(!$appIcon.length) {
            mylog("can't find icon");
            return requester;
        }
        
        requester.icon = encodeURIComponent($appIcon.attr("src"));
        return requester;
    }
    
     
    function addShowMeFrame(perms) {
        // set up fbIFrame
        if(!perms) perms  = "ISHAREDWHAT_NO_PERMS";
        var permString = perms ? "?perms="+perms : "";
        permString = permString.replace(/, /g,",");
        
        var requester = getRequestingWebsiteData();
        var requesterString = "&requesterName="+requester.name+"&requesterIcon="+requester.icon;
        
        $ShowMeDiv = $("<div><a id='showmelink'>Show Me First</a></div>");
        
        divCSS = {display:"inline-block",
        width: "auto",//"99px",
        height:"22px",
        overflow:"hidden",
        "border-width":"1px",
        "border-style":"solid",
        "border-color":"#999999",
        "margin-right":"4px",
        "background-color": "#ff5a11",
        "padding-top": "1px",
        "padding-right": "1px",
        "padding-bottom": "1px",
        "padding-left": "0px"};
        
        if($("div.tosPane .perms_rightContent.rfloat").length) { // we are in the Go To App interface
            divCSS["margin-top"] = "30px";
        }

        $ShowMeDiv.css(divCSS);
        

	var targetUrl = "http://www.showmefirst.info/permissions.html"+permString+requesterString;
	//alert(targetUrl);
	window.open(targetUrl);
            
        $ShowMeLink = $ShowMeDiv.find("#showmelink");
        $ShowMeLink.attr("href","http://www.showmefirst.info/permissions.html"+permString+requesterString);
        $ShowMeLink.attr("target","_blank");
        
        
        $ShowMeLink.css( {
            border: "none",
            cursor: "pointer",
            "font-size": "13px",
            "text-decoration": "none",
            color: "#FFFFFF",
            "background-color": "none",
            "font-family": "'Lucida Grande',Tahoma,Verdana,Arial,sans-serif",
            "font-weight": "bold",
            outline: "medium none",
            padding: "3px 5px 2px 6px",
            overflow: "hidden",
            display: "block",
            "text-align": "center"
        });
        
        
        $ShowMeLink.hover(
            function(){
                $(this).css({ "color":"#bf1e2d"});
            },
            function() {
                $(this).css({ "color":"white"});
            });

    //    #showmeLink:hover {
    //        font-weight:bold;
    //    }
        
        
//        FBIframe = $("<iframe style='width:99px;height:23px;overflow:hidden;border-width:1px;border-style:solid;border-color:#999999;margin-right:4px;padding:0;'></iframe>");
//        FBIframe.attr("src","http://www.showmefirst.info/showme.html"+permString+requesterString);
        
        var $container = $("#platform_dialog_bottom_bar div.platform_dialog_buttons");
                
        if(!$container.length) {
            $container = $("table.platform_dialog_bottom_bar_table div.platform_dialog_buttons");
        }
        
        if(!$container.length) {
            $container = $("#uiserver_form .uiInterstitial .uiInterstitialBar .clearfix .rfloat");
        }
        
        if(!$container.length) {
            $container = $("div.tosPane .perms_rightContent.rfloat");
        }
        
        if(!$container.length) {
            alert("no container");
            return;
        }

        $container.prepend($ShowMeDiv).css("width","300px");
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
    addShowMeFrame(getUrlVar("scope"));
   }
