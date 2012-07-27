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
			generateLabel(data.label);
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

//      requested_data:[
//    		"Your basic info (name, profile picture, gender, networks, user ID, list of friends, any other information you made public)",
//      	"Your e-mail address",
//      	"Your birthday",
//      	"Your location"],
//      data_source:{"source":"3rd Party", "source_link":{"name":"Facebook","url":"http://facebook.com"}},
//      availability:"On Submission",
//      data_recipient:{"name":"The Guardian", "source_link":{"url":"http://www.guardian.co.uk"}},
//      location:"United Kingdom",
//      contact:[{"type":"page","data":"http://www.guardian.co.uk/help/contact-us"}],
//      purpose:"This app may post on your behalf, including videos you watched, articles you read and more.",
//      for_how_long:"Indefinite.",
//      output_to:"Posts to your Facebook wall",
//      revocation:"Facebook permissions may be revoked. Data may be retained by The Guardian.",
//      redistribution:"Unknown",
//      access:"Unknown",
//      related_agreements:[
//    		{"name":"The Guardian Facebook app terms of service","url":"http://www.guardian.co.uk/info/2011/sep/22/2?fb=native"},{"name":"The Guardian Website Terms of Service","url":"http://www.guardian.co.uk/help/terms-of-service"}],
//      third_party_ratings:[
//    		{"name":"Mozilla",
//    			"url":"http://mozilla.com/privacyIcons/Guardian",
//    			"icon":"https://wiki.mozilla.org/images/thumb/f/fb/Privacyiconslogo.png/100px-Privacyiconslogo.png"}],
//      record:"This agreement will not be stored.",
//      author:{"service":"The Standard Crowd","author":"Joe Andrieu","url":"http://standardlabel.org/crowd/joeandrieu"}
 

var generateLabel = function(label) {
	generateRequestedData(label.requested_data);	
	generateDataSource(label.data_source);
	generateAvailability(label.availability);
	generateDataRecipient(label.data_recipient);
	generateLocation(label.location);
	generateContact(label.contact);
	generatePurpose(label.purpose);
	generateForHowLong(label.for_how_long);
	generateOutputTo(label.output_to);
	generateRevocation(label.revocation);
	generateRedistribution(label.redistribution);
	generateAccess(label.access);
	generateAdditionalTerms(label.additional_terms);
	generateRelatedAgreements(label.related_agreements);
	generateThirdPartyRating(label.third_party_ratings);
	generateRecord(label.record);
	generateAuthor(label.author);
	$("div.standard_label").css({display:"block"});
	$("#preload").css({display:"none"});
}

var generateRequestedData = function(data) {
	var template,tmp;
//      requested_data:[
//    		"Your basic info (name, profile picture, gender, networks, user ID, list of friends, any other information you made public)",
//      	"Your e-mail address",
//      	"Your birthday",
//      	"Your location"],
// <td class="right" id="requested_data"><ol><li class="unit"></li></ol></td>

	switch(typeof data) {
		case "string":
			$("#requested_data").append(data);
			break;
		case "object":
			if (data instanceof Array) {
  			template = $("#requested_data li.unit").clone();
  			$("#requested_data ol").empty();
  			for(i=0;i<data.length;i++) {
  				tmp = template.clone().append(data[i]);
  				$("#requested_data ol").append(tmp);
  			}
			} else {
				console.log("unknown object instance in generateRequestedData : " + typeof data + ":" +JSON.stringify(data));
			}
			break;
		default:
			console.log("unknown data type in generateRequestedData : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      data_source:{"source":"3rd Party", "source_link":{"name":"Facebook","url":"http://facebook.com"}},
//			<td class="right" id="data_source"></td>
//      <td class="right" id="data_source"><span class="detail">3rd Party</span> (<a href='http://facebook.com'>Facebook http://facebook.com</a>)</td>
var	generateDataSource = function(data) {
  html = "<span class='detail'>"+data.source+"</span>";
	if(data.source_link) {
		html += "<span class='link'> (<a target='_blank' href='";
		html += data.source_link.url
		html += "'>"; 
		if(data.source_link.name) {
  		html += data.source_link.name;
			html += " ";
		}
		html += data.source_link.url;
		html += "</a>)</span>";
	} 
	$("#data_source").append($(html));
}

//      availability:"On Submission",
//			<td class="right" id="availability"></td>
var	generateAvailability = function(data) {
	switch(typeof data) {
		case "string":
			$("#availability").append(data);
			break;
		default:
			console.log("unknown data type in generateAvailability : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      data_recipient:{"name":"The Guardian", "source_link":{"url":"http://www.guardian.co.uk"}},
//			<td class="right" id="data_recipient"><span class="name"></name> (<a class="url"></a>)</td>
var	generateDataRecipient = function(data) {
  html = "<span class='detail'>"+data.name+"</span>";
	if(data.source_link) {
		html += "<span class='link'> (<a target='_blank' href='";
		html += data.source_link.url
		html += "'>"; 
		if(data.source_link.name) {
  		html += data.source_link.name;
			html += " ";
		}
		html += data.source_link.url;
		html += "</a>)</span>";
	} 
	$("#data_recipient").append($(html));
}

//      location:"United Kingdom",
//			<td class="right" id="location"></td>
var	generateLocation = function(data) {
	switch(typeof data) {
		case "string":
			$("#location").append(data);
			break;
		default:
			console.log("unknown data type in generateLocation : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      contact:[{"type":"page","url":"http://www.guardian.co.uk/help/contact-us"}],
//			<td class="right" id="contact"></td>
var	generateContact = function(data) {
  var html;
	var contact;
	
  switch(typeof data) {
    case "string":
    	$("#contact").append(data);
    	break;
    case "object":
    	if (data instanceof Array) {
    		html = "<div class='contacts'>";
  			for(i=0;i<data.length;i++) {
  				contact = data[i];
        	switch(contact.type) {
        		case "page" : 
              html+= "<div class='contact'><a href='"
        				+contact.url
        				+"' target='_blank'>"
        				+contact.url
        				+"</a></div>";
        			break;
        		default:
        			console.log("unknown data type in generateContact: "+contact.type);
        	}
				}
      	html += "</div>";
      	$("#contact").append($(html));
      } else {
       	console.log("unknown object type in generateContact: "+data);
      }
  		break;
		default:
    	console.log("unknown data type in generateContact: "+data.type);
	}
}

//      purpose:"This app may post on your behalf, including videos you watched, articles you read and more.",
//			<td class="right" id="purpose"></td>
var	generatePurpose = function(data) {
	switch(typeof data) {
		case "string":
			$("#purpose").append(data);
			break;
		default:
			console.log("unknown data type in generatePurpose : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      for_how_long:"Indefinite.",
//			<td class="right" id="for_how_long"></td>
var	generateForHowLong = function(data) {
	switch(typeof data) {
		case "string":
			$("#for_how_long").append(data);
			break;
		default:
			console.log("unknown data type in generateForHowLong : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      output_to:"Posts to your Facebook wall",
//			<td class="right" id="output_to"></td>
var	generateOutputTo = function(data) {
	switch(typeof data) {
		case "string":
			$("#output_to").append(data);
			break;
		default:
			console.log("unknown data type in generateOutputTo : " + typeof data + ":" +JSON.stringify(data));
	}
}


//      revocation:"Facebook permissions may be revoked. Data may be retained by The Guardian.",
//			<td class="right" id="revocation"></td>
var	generateRevocation = function(data) {
	switch(typeof data) {
		case "string":
			$("#revocation").append(data);
			break;
		default:
			console.log("unknown data type in generateRevocation : " + typeof data + ":" +JSON.stringify(data));
	}
}


//      redistribution:"Unknown",
//			<td class="right" id="redistribution"></td>
var	generateRedistribution = function(data) {
	switch(typeof data) {
		case "string":
			$("#redistribution").append(data);
			break;
		default:
			console.log("unknown data type in generateRedistribution : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      access:"Unknown",
//			<td class="right" id="access"></td>
var	generateAccess = function(data) {
	switch(typeof data) {
		case "string":
			$("#access").append(data);
			break;
		default:
			console.log("unknown data type in generateAccess : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      additional_terms: undefined,
//			<td class="right" id="additional_terms"></td>
var generateAdditionalTerms = function(data) {
	switch(typeof data) {
		case "string":
			$("#additional_terms").append(data);
			break;
		case "undefined" :
		  $("#additional_terms").append("not available");
			break;
		default:
			console.log("unknown data type in generateAdditionalTerms : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      related_agreements:[
//    		{"name":"The Guardian Facebook app terms of service","url":"http://www.guardian.co.uk/info/2011/sep/22/2?fb=native"},{"name":"The Guardian Website Terms of Service","url":"http://www.guardian.co.uk/help/terms-of-service"}],
//			<td class="right" id="related_agreements"><span class="page_template"><span class="name"></name> (<span class="link_name"></span> <a class="link_url"></a>)</span></td>
var	generateRelatedAgreements = function(data) {
	var html,agreement;
	switch(typeof data) {
		case "string":
			$("#related_agreements").append(data);
			break;
		case "object":
			if (data instanceof Array) {
  			for(i=0;i<data.length;i++) {
				  agreement = data[i];
  				html = "<a class='related_agreement' href='"+agreement.url+"'>"
						+agreement.name +" ("
						+agreement.url+")</a>";
  				$("#related_agreements").append($(html));
  			}
			} else {
				console.log("unknown object instance in related_agreements : " + typeof data + ":" +JSON.stringify(data));
			}
			break;
		default:
			console.log("unknown data type in related_agreements : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      third_party_ratings:[
//    		{ "name":"Mozilla",
//          "id" : "mozilla_privacy",
//    			"url":"http://standardlabel.org/privacyIcons/Guardian",
//    			"icon":"https://wiki.mozilla.org/images/thumb/f/fb/Privacyiconslogo.png/100px-Privacyiconslogo.png"}],
//			<td class="right" id="third_party_ratings">
//				<div class="services">
//					<div class="third_party"><a href="#id"><img src="icon" alt="name" title="name"/></a></div>
//				</div>
//				<div class="ratings">
//					<iframe id="mozilla_privacy" class="rating hidden" src="url"></iframe>
//				</div>
//			</td>
var	generateThirdPartyRating = function(data) {
	var rating;
	var services,ratings;
	var serviceHTML,ratingHTML;	

	switch(typeof data) {
		case "string":
			$("#third_party_ratings").append(data);
			break;
		case "object":
			if (data instanceof Array) {
				services = $("<div class='services'></div>");
				ratings = $("<div class='ratings'></div>");
				
  			for(i=0;i<data.length;i++) {
					rating = data[i];
  				serviceHTML = "<div class='third_party' data-rating_selector='#"
												+rating.id
												+"'><img class='service' src='"
												+rating.icon
												+"' alt='"+rating.name
												+"' title='"+rating.name+"'/></div>"
					services.append($(serviceHTML));
					
					ratingHTML = "<iframe id='"
												+rating.id
												+"' class='rating' src='"
												+rating.url
												+"'></iframe>";
					ratings.append($(ratingHTML));
  			}
				$("#third_party_ratings}").append(services).append(ratings);
			} else {
				console.log("unknown object instance in generateThirdPartyRating : " + typeof data + ":" +JSON.stringify(data));
			}
			break;
		default:
			console.log("unknown data type in generateThirdPartyRating : " + typeof data + ":" +JSON.stringify(data));
	}
}


//      record:"This agreement will not be stored.",
//			<td class="right" id="record"></td>
var	generateRecord = function(data) {
	switch(typeof data) {
		case "string":
			$("#record").append(data);
			break;
		default:
			console.log("unknown data type in generateRecord : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      author:{"service":"The Standard Crowd","author":"Joe Andrieu","url":"http://standardlabel.org/crowd/joeandrieu"}
//			<td class="right" id="author"></td>
var	generateAuthor = function(data) {

	var html = "<div class='author'><div class='service'>"
					+data.service
					+"</div>(<a href='"
					+data.url
					+"'>"
					+data.author
					+"</a>)</div>";
	$("#author").append($(html));
}

/* set hover events for rating iframes */
// we do this by showing it immediately, but delaying the hide
// we attach to both the service icon and the iframe, so that any mouse activity over either will 
// keep the frame active.
//
// With one variation: showing a *different* rating will immediately hide the old rating

// Display classes (iframe.rating is already hidden)
// show/hide: active
// keep/relase: over

var ratingHideDelay = 500; // milliseconds

var showRating = function(eventObject) {
	var selector = $(this).attr("data-rating_selector");
	console.log($(this).html());
	$("iframe.rating").not(selector).removeClass("active").removeClass("over");
	$(selector).addClass("active");
	console.log("show rating:"+selector);
}

var hideRating = function(eventObject) {
	console.log("hide rating");
	var selector = $(this).attr("data-rating_selector");
	setTimeout(function(){$(selector).removeClass("active");},ratingHideDelay);
}
	
var keepRating = function(eventObject) {
	console.log("keep rating");
  $(this).addClass("over");
}

var releaseRating = function(eventObject) {
	console.log("release rating");
	var me=$(this);
	setTimeout(function(){me.removeClass("over");},ratingHideDelay);
}
$(document).ready(function(){
  $("div.third_party").on("mouseenter",showRating).on("mouseleave", hideRating);
  $("iframe.rating").on("mouseenter", keepRating).on("mouseleave",releaseRating);
});