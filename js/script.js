var label = $('<div id="standard_label" class="hide">').html('\
    <div class="standard_label">\
        <h5 class="draft">Draft Version of the Standard Information Sharing Label</h5>\
        <h1>Sharing Terms</h1>\
        <h6 class="forward">The recipient requests access to certain information for the purpose and duration below.</h6>\
        <table class="terms">\
            <tr><td class="left">	Who	</td>	<td class="right">	The Guardian (<a href="http://http://www.guardian.co.uk">http://www.guardian.co.uk</a>)	</td></tr>\
            <tr><td class="left">	Where	</td>	<td class="right">	United Kingdom	</td></tr>\
            <tr><td class="left">	Contact	</td>	<td class="right">	<a href="http://www.guardian.co.uk/help/contact-us">http://www.guardian.co.uk/help/contact-us</a>	</td></tr>\
            <tr><td class="left">	What	</td>	<td class="right">	<ol><li>Your basic info (name, profile picture, gender, networks, user ID, list of friends, any other information you made public)</li><li>Your e-mail address (label@andrieu.net)</li><li>Your birthday</li><li>Your location</li></ol>	</td></tr>\
            <tr><td class="left">	From	</td>	<td class="right">	3rd Party (Facebook <a href="http://facebook.com">http://facebook.com</a>)	</td></tr>\
            <tr><td class="left">	When	</td>	<td class="right">	On Submission	</td></tr>\
            <tr><td class="left">	Why	</td>	<td class="right">	This app may post on your behalf, including videos you watched, articles you read and more.	</td></tr>\
            <tr><td class="left">	For How Long	</td>	<td class="right">	Indefinite.	</td></tr>\
            <tr><td class="left">	Output To	</td>	<td class="right">	Posts to your Facebook wall	</td></tr>\
            <tr><td class="left">	Revocation	</td>	<td class="right">	Facebook permissions may be revoked. Data may be retained by The Guardian.	</td></tr>\
            <tr><td class="left">	Redistribution	</td>	<td class="right">	Unknown	</td></tr>\
            <tr><td class="left">	Access	</td>	<td class="right">	Unknown	</td></tr>\
            <tr><td class="left">	Additional Terms	</td>	<td class="right">		</td></tr>\
            <tr><td class="left">	Related Agreements	</td>	<td class="right">	<a href="http://www.guardian.co.uk/info/2011/sep/22/2?fb=native">http://www.guardian.co.uk/info/2011/sep/22/2?fb=native</a><br/><a href="http://www.guardian.co.uk/help/terms-of-service">http://www.guardian.co.uk/help/terms-of-service</a><br/>	</td></tr>\
            <tr><td class="left">	3rd Party Ratings	</td>	<td class="right">	<div class="mozilla">mozilla icons</div><div class="friend">Friend Warning</div>	</td></tr>\
            <tr><td class="left">	Author	</td>	<td class="right">	The Standard Crowd from Joe Andrieu (<a href="http://standardlabel.org/crowd/joeandrieu">Joe Andrieu</a>)	</td></tr>\
            </table>\
            <h6 class="afterword">More information about the Standard Information Sharing Label can be found at <a href="http://standardlabel.org">http://standardlabel.org</a></h6>\
        </div>');


$(document).ready(function(){

    $('body').append(label);
    $('body').click(function(){
        label.fadeOut();
    });

    $("tr:odd").addClass("odd");

    $('.btn').popover({
        trigger: 'manual',
        content : "<div id ='show_label'>Click to see what you're sharing</div>",
        title : "The Standard Label"
    });

    var toggle_show = 0;
    $('.btn').mouseenter(function(){
        toggle_show = !toggle_show;
        if (toggle_show ){
            $(this).popover('show');
            $('#show_label').click(function(e){
                $('.btn').popover('hide');
                label.toggleClass("hide");
                e.stopPropagation();
            })
        }
        else
            $(this).popover('hide');
    })

});
