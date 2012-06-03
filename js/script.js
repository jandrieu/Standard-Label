$(document).ready(function(){
    $("tr:odd").addClass("odd");

    $('#submitButton').mouseover(function(){
        console.log('hi')
    });

    $('.btn').popover()
});