$.fn.isInViewport = function(byOffset) {
	var elementTop = $(this).offset().top + byOffset;
	var elementBottom = elementTop + $(this).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
};

function debugLayout(){
    [].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)});
}

function gotoAnchor(id){
	var x;
	if(id == "top")
		x = 0;
	else
		x = $(id).offset().top;
	$('html,body').animate({scrollTop:x},'slow');
}

window.onbeforeunload=function(){window.scrollTo(0, 0);}

$(document).ready(function() {
	if(window.innerWidth >= 992){
		$("#title-svg").css({"stroke":"#ff9900"});
		new Vivus('title-svg', {duration: 150}, function(){
			$(".subheading").animate({"max-height":"75px"},200,function(){
				$("header,footer").addClass("shown");
				$("#title-svg").addClass("shown");
				$("section").addClass("shown");
				$(".subheading").addClass("shown").css("max-height","");
			});
		});	
	}

	$("header nav a").click(function(e){
		e.preventDefault();
		var target = $(this).attr("href");
		$("nav a").blur().removeClass("active");
		$(this).addClass("active");
		gotoAnchor(target);
	})

	$("#back-to-top").click(function(){
		gotoAnchor("top");
	})
});

$(window).scroll(function(){
	if(window.innerWidth < 768) return;
	if($(".main-section").isInViewport(0)){
		$("header img").removeClass("show");
		$("#back-to-top").removeClass("show");
	}
	else{
		$("header img").addClass("show");
		$("#back-to-top").addClass("show");
	}

	if($("#about").isInViewport(window.innerHeight/2)){
		$("nav a").blur().removeClass("active");
		$("nav a[href='#about']").addClass("active");
	}
	else if($("#projects").isInViewport(window.innerHeight/2)){
		$("nav a").blur().removeClass("active");
		$("nav a[href='#projects']").addClass("active");
	}
	else if($("#works").isInViewport(window.innerHeight/2)){
		$("nav a").blur().removeClass("active");
		$("nav a[href='#works']").addClass("active");
	}
	else{
		$("nav a").blur().removeClass("active");
	}
})

$(window).resize(function(){
	$("header,footer,section,#title-svg,.subheading").addClass("shown");
})