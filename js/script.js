var lastFocus = $("body");

$.fn.isInViewport = function(byOffset) {
	var elementTop = $(this).offset().top + byOffset;
	var elementBottom = elementTop + $(this).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
};

// function debugLayout(){
//     [].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)});
// }

function gotoAnchor(id){
	var x;
	var forceFocus;
	if(id == "top"){
		x = 0;
		forceFocus = $("nav a:first-child");
	}
	else{
		x = $(id).offset().top - 30;
		forceFocus = $(id+" a").eq(0);
	}
	$('html,body').animate({scrollTop:x},'slow',function(){
		forceFocus.focus()
	});
}

window.onbeforeunload=function(){$("body").css("opacity",0);window.scrollTo(0, 0);}

window.addEventListener('load', function(){
	$("img").each(function(){
		if($(this).attr("data-src")){
			var _src = $(this).data("src");
			$(this).attr("src", _src);
			if($(this).data("width"))
				$(this).attr("width", $(this).data("width"));
			if($(this).data("height"))
				$(this).attr("height", $(this).data("height"));
			$(this).removeAttr("data-src");
			$(this).removeAttr("data-width");
			$(this).removeAttr("data-height");
		}
	})

	if(!$){
		document.getElementById("title-svg").classList.add("shown");
		document.getElementsByTagName("header").classList.add("shown");
		document.getElementsByTagName("footer").classList.add("shown");
		document.getElementsByTagName("section").classList.add("shown");
		document.getElementsByClassName("subheading").classList.add("shown");
	}
})

$(document).ready(function() {
	$("html").css("opacity",1);
	if(window.innerWidth >= 992){
		$("#title-svg").css({"stroke":"#ff6200"});
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
		if($(this).hasClass("linked")) return;
		e.preventDefault();
		var target = $(this).attr("href");
		$("nav a").blur().removeClass("active");
		$(this).addClass("active");
		gotoAnchor(target);
	})

	$("#back-to-top").click(function(){
		gotoAnchor("top");
	})

	$(".project-list img").click(function(){
		var img = $(this);
		$("#zoom img").attr("src",img.attr("src"));
		$("#zoom img").attr("alt",img.attr("alt"));
		$("#zoom").fadeIn();
	})
	$(".project-list img").keydown(function(e){
	    if(e.which === 13){
			var img = $(this);
			lastFocus = img;
			$("#zoom img").attr("src",img.attr("src"));
			$("#zoom img").attr("alt",img.attr("alt"));
			$("#zoom").fadeIn().focus();
	    }
	});

	$("#zoom").click(function(){
		$(this).fadeOut();
	})
	$("#zoom").keydown(function(e){
	    if(e.which === 13){
			$("#zoom").fadeOut();
			lastFocus.focus();
	    }
	})

	$("#zoom img").click(function(e){
		e.stopPropagation();
		e.preventDefault();
	})
	$(document).keyup(function(e){
	    if(e.keyCode === 27){
	        $("#zoom").fadeOut();
			lastFocus.focus();	
	    }
	});
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
	else if($("#features").isInViewport(window.innerHeight/2)){
		$("nav a").blur().removeClass("active");
		$("nav a[href='#features']").addClass("active");
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