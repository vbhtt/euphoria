// JavaScript Document
/*$(document).ready(function(e) {
	//$("div.desc").hide();
    //$("div.img").hover(function(e) {
        //$("div.desc").show();}, function() {
			//$("div.desc").hide();
			//});
			
			$("#accordion").accordion({
				collapsible: true
			});
});*/

$(document).ready(function() {
    function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');//.slideUp('slow');
        $('.accordion .accordion-section-content').slideUp('slow').removeClass('open');
    }
 
    $('.accordion-section-title').click(function(e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');
 
        if($(e.target).is('.active')) {
            close_accordion_section();
        }else {
            close_accordion_section();
 
            // Add active class to section title
            $(this).addClass('active');
            // Open up the hidden content panel
            $('.accordion ' + currentAttrValue).slideDown('slow').addClass('open'); 
        }
 
        e.preventDefault();
    });
});