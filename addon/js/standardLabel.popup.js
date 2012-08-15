// Copyright (c) 2012 Joe Andrieu
//
// Requires jquery.

$(document).ready(function() {
	var pivot;
	data = extractData(window.location.search);
	console.log(JSON.stringify(data));
	if(data)
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
	$(".highlighter").on("click",highlight);
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
	try {
	  data = JSON.parse(data);
	} catch (e) {
		// do nothing
	}
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
	if(label.version=="http://standardlabel.org/v/0.3")
		generateRequestedData(label.requested_data);	     // term has been renamed as of 0.4
	else
		generateSharedData(label.shared_data);
		
	generateDataSource(label.data_source);
	generateAvailability(label.availability);
	generateDataRecipient(label.data_recipient);
	generateLocation(label.location);
	generateContacts(label.contact);
	generatePurpose(label.purpose);
	generateForHowLong(label.for_how_long);
	generateOutputTo(label.output_to);
	generateRevocation(label.revocation);
	generateRedistribution(label.redistribution);
	generateAccess(label.access);
	generateAdditionalTerms(label.additional_terms);
	generateRelatedAgreements(label.related_agreements);
	generateThirdPartyRating(label.third_party_ratings);
//	generateRecord(label.record);  Feature removed in 0.4
	generateAuthor(label.author);
	generateVersion(label.version); // added version 0.4
	
	$("div.standard_label").css({display:"block"});
	$("#preload").css({display:"none"});
}

// This function is deprecated as of http://standardlabel.org/v0.4
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
			$("#requested_data").empty().append(data);
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

var generateSharedData = function(data) {
	var template,tmp;
//      requested_data:[
//    		"Your basic info (name, profile picture, gender, networks, user ID, list of friends, any other information you made public)",
//      	"Your e-mail address",
//      	"Your birthday",
//      	"Your location"],
// <td class="right" id="requested_data"><ol><li class="unit"></li></ol></td>

	switch(typeof data) {
		case "string":
			$("#requested_data").empty().append(data);
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
				console.log("unknown object instance in generateSharedData : " + typeof data + ":" +JSON.stringify(data));
			}
			break; 
		default:
			console.log("unknown data type in generateSharedData : " + typeof data + ":" +JSON.stringify(data));
	}
}






//      data_source:{"source":"3rd Party", "source_link":{"name":"Facebook","url":"http://facebook.com"}},
//			<td class="right" id="data_source"></td>
//      <td class="right" id="data_source"><span class="detail">3rd Party</span> (<a href='http://facebook.com'>Facebook http://facebook.com</a>)</td>
var	generateDataSource = function(data) {
  html = "<span class='detail'>"+data.source+"</span>";
debugger
	if(data.source_link) {
		switch(data.source_link.type) {
			case "url":
				html += "<span class='link'> (";
				if(data.source_link.name) {
					html += data.source_link.name;
					html += " ";
				}
				html+="<a target='_blank'";
				html += data.source_link.url
				html += "'>"; 
				html += data.source_link.url;
				html += "</a>)</span>";
				break;
			case "onpage":
				html += "<span class='link'> (";
				if(data.source_link.name) {
					html += data.source_link.name;
					html += " ";
				}
				html+="<a class='highlighter' href='' data-selector='";
				html += data.source_link.selector;
				if(data.source_link.parent_selector) {
					html += "' data-parent_selector='";
					html += data.source_link.parent_selector;
				}
				html += "' >Highlight</a>)</span>"
				break;
			default:
				console.log("UNKNOWN source_link TYPE in generateDataSource");
		}
	} 
	$("#data_source").append($(html));
}

//      availability:"On Submission",
//			<td class="right" id="availability"></td>
var	generateAvailability = function(data) {

	var html;
	switch(typeof data) {
		case "string":
			html = "<span class='availability'>";
			html += data;
			html += "</span>";
			break;
		case "object":
			if(data.standard_term) {
				html = "<span><span class='standard_term'>";
				html+= data.standard_term;
				html+="</span> (<span class='detail'>";
				html+= data.detail;
				html+= "</span>)</span>";
			}
			break;
		default:
			console.log("unknown data type in generateAvailability : " + typeof data + ":" +JSON.stringify(data));
	}
	$("#availability").append($(html));

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
	var html;
	switch(typeof data) {
		case "string":
			$("#location").append(data);
			break;
		case "object":
		  html = "<div><span class='term'>";
			html += data.term;
			html += "</span>";
			html += generateCitation(data.citation);
			html += "</div>"
			$("#location").append($(html));
			break;
		default:
			console.log("unknown data type in generateLocation : " + typeof data + ":" +JSON.stringify(data));
	}
}

//      contact:[{"type":"page","url":"http://www.guardian.co.uk/help/contact-us"}],
//			<td class="right" id="contact"></td>

var	generateContacts = function(data) {
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
					html+=generateContact(data[i]);
				}
      	html += "</div>";
			} else {
				html= generateContact(data);
      }
  		break;
		default:
    	console.log("unknown data type in generateContacts: "+ (typeof data));
	}

 	$("#contact").append($(html));
}

var	generateContact = function(contact) {
	var html = "<div class='contact'>";
	switch(contact.type) {
		case "page" : 
			html+= "<a href='"
				+contact.url
				+"' target='_blank'>"
				+contact.url
				+"</a></div>";
			break;
		default:
			console.log("unknown data type in generateContact: "+contact.type);
	}
	
	html+= "</div>";
	return html;
}



//      purpose:"This app may post on your behalf, including videos you watched, articles you read and more.",
//			<td class="right" id="purpose"></td>
var	generatePurpose = function(data) {
	var	html = "<span class='purpose'>";
	switch(typeof data) {
		case "string":
			html += data;
			break;
		case "object":
			html += "<span class='term'>";
			html += data.term;
			html += "</span>"
			html += generateCitation(data.citation);
			break;
		default:
			console.log("unknown data type in generatePurpose : " + typeof data + ":" +JSON.stringify(data));
	}
	html += "</span>"
	
	$("#purpose").append(html);
	
}

//      for_how_long:"Indefinite.",
//			<td class="right" id="for_how_long"></td>
var	generateForHowLong = function(data) {
	var	html = "<span class='forHowLong'>";
	switch(typeof data) {
		case "string":
			html += data;
			break;
		case "object":
			html += "<span class='term'>";
			html += data.term;
			html += "</span>"
			html += generateCitation(data.citation);
			break;
		default:
			console.log("unknown data type in generateForHowLong : " + (typeof data) + ":" +JSON.stringify(data));
	}
	html += "</span>"

	$("#for_how_long").append(html);
}
	
//      output_to:"Posts to your Facebook wall",
//			<td class="right" id="output_to"></td>
var	generateOutputTo = function(data) {
	var html;

	switch(typeof data) {
		case "string":
			html = "<span class='outputTo'>";
			html += data;
			html += "</span>";
			break;
		case "object":
			if(data.standard_term) {
				html += generateStandardTerm(data);
			}
			break;
		default:
			console.log("unknown data type in generateOutputTo : " + typeof data + ":" +JSON.stringify(data));
	}
	$("#output_to").append($(html));
			
}


var generateStandardTerm = function(data) {
	var html;
	html = "<span class='outputTo'><span class='standard_term'>";
	html+= data.standard_term;
	html+="</span> (<span class='detail'>";
	html+= data.detail;
	html+= "</span>)</span>";
	return html;
}

//      revocation:"Facebook permissions may be revoked. Data may be retained by The Guardian.",
//			<td class="right" id="revocation"></td>
var	generateRevocation = function(data) {
	var html;
	switch(typeof data) {
		case "string":
			html = data;
			break;
		case "object":
			html = "<span class='revocation'><span class='description'>";
			html += data.description;
			html += "</span> ";
			html += "<a target='_blank' href='";
			html += data.url;
			html += "'>";
			html += data.url;
			html += "</a>";
			html += generateCitation(data.citation);
			break;
		default:
			console.log("unknown data type in generateRevocation : " + typeof data + ":" +JSON.stringify(data));
	}
	
	$("#revocation").append(html);
}


//      redistribution:"Unknown",
//			<td class="right" id="redistribution"></td>
var	generateRedistribution = function(data) {
	var	html = "<span class='redistribution'>";
	switch(typeof data) {
		case "string":
			html += data;
			break;
		case "object":
			html += "<span class='term'>";
			html += data.term;
			html += "</span>"
			html += generateCitation(data.citation);
			break;
		default:
			console.log("unknown data type in generateRedistribution : " + typeof data + ":" +JSON.stringify(data));
	}
	html += "</span>"

	$("#redistribution").append(html);

}

//      access:"Unknown",
//			<td class="right" id="access"></td>
var	generateAccess = function(data) {
	var html;
	switch(typeof data) {
		case "string":
			html = data;
			break;
		case "object":
		  if(data.url) {
				html = "<a target=_blank href='";
				html += data.url;
				html += "'>";
				html += data.url;
				html += "</a>";
			}
			break;
		default:
			console.log("unknown data type in generateAccess : " + typeof data + ":" +JSON.stringify(data));
	}
	
	$("#access").append(html);
}

//      additional_terms: undefined,
//			<td class="right" id="additional_terms"></td>

//object:{"term":[{"standard_term":"Statistical Aggregation","detail":"Search Trends"},{"standard_term":"Promotional Offers","detail":"ad network optimization"}],"citation":{"url":"https://www.google.com/intl/en/policies/privacy/#nosharing","access_date":"2012-07-25"}} 

var generateAdditionalTerms = function(data) {
	var html = "";
	switch(typeof data) {
		case "string":
		  html = data;
			break;
		case "object":
			if (data instanceof Array) {
				html = "<ol>";
				for(i=0;i<data.length;i++) {
						term = data[i];
						if(term.standard_term) {
							html += "<li>";
							html += generateStandardTerm(term);
							if(term.citation) {
								html+=generateCitation(term.citation);
							}
							html += "</li>";
						} else {
							html += "<li class='term'>";
							html += term;
							if(term.citation) {
								html+=generateCitation(term.citation);
							}
							html += "</li>";
						}
				} 
				html += "</ol>";
			} else {
					if(data.standard_term) {
						html += generateStandardTerm(data);
						if(data.citation) {
							html+=generateCitation(data.citation);
						}
					} else {
						console.log("unknown object type in generateAdditionalTerms : " + (typeof data) + ":" +JSON.stringify(data));
					}
			}
		
			break;
		case "undefined" :
		  html = "not available";
			break;
		default:
			console.log("unknown data type in generateAdditionalTerms : " + typeof data + ":" +JSON.stringify(data));
	}
	
	$("#additional_terms").append(html);

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
				html += "<ol class='related_agreements'>";
  			for(i=0;i<data.length;i++) {
				  agreement = data[i];
					html += "<li class='related_agreement'><span class='related_agreement'>";
					html += agreement.name;
					html += "</span>";
  				html += generateCitation(agreement.citation);
					html += "</li>";
  			}
			} else {
					html = "<span class='related_agreement'>";
					html += data.name;
					html += "</span>";
  				html += generateCitation(data.citation);
			}
			break;
		default:
			console.log("unknown data type in related_agreements : " + typeof data + ":" +JSON.stringify(data));
	}
	$("#related_agreements").append($(html));
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

var generateCitation = function(data) {
	html = "";
	if(data) {
		html = " <a class='citation' target='_blank' title='";
		html += data.url + " (" + data.access_date + ")";
		html += "' href='";
		html += data.url;
		html += "'>&#187;</a>";
	} 
	
	return html;
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

var generateVersion = function(data) {
	var html = "<a href='"
	+data
	+"' target='_blank'>"
  +data
	+"</a>";
	$("#version").append($(html));
}


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
  $("#clicker").click(testReading);
});

var string_min = 6;
var string_max = 60;
var string_length = string_max-string_min;
var prop_chars = "0987654321abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_:/"

var buildTestDB = function(db_size) {
	console.log("starting building db size "+ db_size);
	var start = (new Date).getTime();
	var end;
	var db = {};
	var string_min = 6;
	var string_max = 60;
	var string_length = string_max-string_min;

	var cur_length;
	var cur_property;
	var cur_char;
	
	for (i=0; i<db_size;i++) {
		cur_property = "";
		cur_length = Math.floor(Math.random() * string_length) + string_min;
		for(j=0;j<cur_length;j++) {
			cur_char = Math.floor(Math.random() * prop_chars.length)
			cur_property += prop_chars[cur_char];
		}
		db[cur_property] = "This is a label! key="+cur_property;
	}
	end = (new Date).getTime();
	console.log("done building db of size "+db_size);
	console.log("time to build = "+ String(end-start));
	return db;
}

var testTestDB = function(db) {
	
	// first set up some stat counters
	var total_time = 0;
	var total_accesses = 0;
	var start,end, duration;
	
	var num_test_cycles = 20;
	var tests_per_cycle = 100000;
	var key_array = new Array(tests_per_cycle);

	var db_size = (Object.keys(db)).length
	console.log("***************************************");
	console.log("testing DB size "+db_size);
	console.log("***************************************");
	

	// first test ones we know exist
	console.log("testing existing keys");
	for(i=0;i<num_test_cycles;i++) {
		var test_out="";
		// first, build an array of valid keys;
		key_array = getTestSet(db,tests_per_cycle);
		start = (new Date).getTime();
		for(j=0;j<tests_per_cycle;j++) {
			test_out += (key_array[j] in db) ? "#" : ".";
		}
		end = (new Date).getTime();
		duration = end-start;		
		console.log("time to test one cycle of "+tests_per_cycle+" = "+ duration);
		console.log("average time to access = "+(duration/tests_per_cycle));
		total_time += duration;
		total_accesses += tests_per_cycle;
	}

	console.log("***************************************");
	console.log("done testing guaranteed reads db size:"+ db_size);
	console.log("***************************************");
	
	console.log("total_time = "+total_time);
	console.log("total_accesses = "+total_accesses);
	console.log("average time to access = "+(total_time/total_accesses));
	
	// clear out
	total_time = 0;
	total_accesses = 0;
	// then test ones we know don't exist
	for(i=0;i<num_test_cycles;i++) {
		var test_out="";
		// first, build an array of valid keys;
		key_array = getTestSet(undefined,tests_per_cycle);
		start = (new Date).getTime();
		for(j=0;j<tests_per_cycle;j++) {
			test_out += (key_array[j] in db) ? "#" : ".";
		}
		end = (new Date).getTime();
		duration = end-start;		
		console.log("time to test "+tests_per_cycle+" = "+ duration);
		total_time += duration;
		total_accesses += tests_per_cycle;
	}

	console.log("***************************************");
	console.log("done testing empty reads db size:"+ db_size);
	console.log("***************************************");
	
	console.log("total_time = "+total_time);
	console.log("total_accesses = "+total_accesses);
	console.log("average time to access = "+(total_time/total_accesses));


}

var getTestSet = function(db, count) {
	var arr = new Array(count);
	var db_len;
	var r;
	var key;
	if(db) {
		var all_keys = Object.keys(db);
		db_len = all_keys.length;
		for(i = 0; i<count;i++) {
			r = Math.floor(db_len*Math.random()); 
			key = all_keys[r];
			arr[i] = key;
		}
	} else {
		var cur_char="";
		var cur_property;
		for(i=0; i<count;i++) {
			cur_property = "";
			cur_length = Math.floor(Math.random() * string_length) + string_min;
			for(j=0;j<cur_length;j++) {
				cur_char = Math.floor(Math.random() * prop_chars.length)
				cur_property += prop_chars[cur_char];
			}
			arr[i] = cur_property;
		}
	}
	
	return arr;
}

var testReading = function() {
	testTestDB(buildTestDB(1000));
	testTestDB(buildTestDB(5000));
	testTestDB(buildTestDB(10000));
	testTestDB(buildTestDB(50000));
	testTestDB(buildTestDB(100000));
	testTestDB(buildTestDB(500000));
	testTestDB(buildTestDB(1000000));
	testTestDB(buildTestDB(5000000));
	return false;
}

var highlight = function(e) {
//	e.preventDefault();
	var selector = $(this).data("selector");
	var parent_selector = $(this).data("parent_selector");
	
  chrome.tabs.getSelected(null, function(tab){
		chrome.tabs.sendMessage(tab.id, { method:'highlight', "selector": { "item": selector, "parent": parent_selector}}, function(a){
			 alert("send replied "+a);
		});																				 
	});

	e.stopPropagation();
	return false;
}

