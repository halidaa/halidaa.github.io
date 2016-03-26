function drawRow(row){
	$(".board").prepend("<div class='row'><span></span><span></span><span></span><span></span><span></span></div>");
	for (var j = 0; j < boardHeight; j++){
		var charID = Math.floor((Math.random() * 4) + 1);
		if(row[j] > 0){
			$(".board .row").eq(0).find("span").eq(j).addClass("char char-"+charID);
		}
	}
}

function checkCollide(){
	var posX = parseInt($("#player").css("left"))/100;
	var xState = $(".board .row").eq(boardHeight-1).find("span").eq(posX).hasClass("char");
	return xState;
}

function eatKid(){
	var posX = parseInt($("#player").css("left"))/100;
	$(".board .row").eq(boardHeight-1).find("span").eq(posX).removeClass("char");
	$("#player").addClass("nyam");
	bonus+= 0.001;
	thisIsTheActualBonusValue+= 0.001;
	setTimeout(function(){
		$("#player").removeClass("nyam");
	},300)
	
	if(bonus >= 1.5){
		endGame();
	}
}

function endGame(){
	isAlive = false;
	clearInterval(gameInterval);
	$("#bonus-input").val(thisIsTheActualBonusValue.toFixed(3));
	$("#offset-input").val(miliseconds-gameStart);
	$("#interaction-input").val(interaction);
	$("#idle-input").val(maxIdle);
	$("#same-input").val((thisIsTheActualBonusValue == bonus));
	$("#game").hide();
	$("#quit").fadeIn(400, function(){
		setTimeout(function(){
			$("#mturk_form").submit();
		},3000);
	});
}

/*game setup*/
var board = [[0,0,1,0,0],
		   [0,0,0,0,0],
		   [0,0,0,1,1],
		   [0,0,0,0,0],
		   [1,1,1,0,0],
		   [0,0,0,0,0],
		   [0,0,0,0,0]];
var boardHeight = 5;
var boardWidth = 5;
var bonus = 0.000;
var thisIsTheActualBonusValue = 0.000;
var isAlive = false;
var randomize = true;
var miliseconds = new Date().getTime();
var gameStart = new Date().getTime();
var offset = Math.floor(miliseconds/1000)%board.length;
var mode = 0;
var idle = 0;
var maxIdle = 0;
var interaction = 0;

for (var i = board.length-1; i >= board.length - boardHeight; i--){
	drawRow(board[i]);
}
var gameInterval = setInterval(function(){
	if(isAlive){
		$(".board").children(".row").last().remove();
		var nextRow = [];
		if(randomize){
			for(var i = 0; i < boardWidth; i++){
				nextRow.push(Math.floor(Math.random()+0.15));
			}
		}else{
			var nextIdx = board.length - boardHeight - offset;
			if (nextIdx < 0) nextIdx += board.length;
			nextRow = board[nextIdx];
		}
		drawRow(nextRow);
		miliseconds = new Date().getTime();
		offset = Math.floor(miliseconds/1000)%board.length;
		idle++;
		if (mode == 0){
			if (checkCollide()){
				endGame();
			}
			else{
				bonus+= 0.001;
				thisIsTheActualBonusValue+= 0.001;
				if(bonus >= 2){
					endGame();
				}
			}
		}
		else{
			if(checkCollide()){
				eatKid();
			}
		}
		$(".bonus").text(bonus.toFixed(3));
	}
},1000)

/*event handlers*/
$(document).keydown(function(e) {
	if(!isAlive) return;
	if(idle > maxIdle) maxIdle = idle;
	idle = 0;
	var position = parseInt($("#player").css("left"));
	if(e.keyCode==37) {
		position-=100;
	} else if(e.keyCode == 39) {
		position+=100;
	}
	if(position < 0) position = 400;
	if(position > ((boardWidth - 1)*100)) position = 0;
	$("#player").css("left",position+"px");
	if(mode == 1){
		if(checkCollide()) eatKid();
	}
	interaction++;
});
$(".characters li").click(function(){
	var character = $(this).attr("class");
	var type = $(this).parent().attr("class").split(" ")[1];
	$(".characters li").removeClass("selected");
	$(this).addClass("selected");
	$("#player").removeClass().addClass(character+" "+type);
	interaction++;
})
$(".mode-btn").click(function(){
	mode = (mode+1)%2;
	if (mode == 0){
		$("#intro p.kid").show();
		$("#intro p.monster").hide();
		$(".board").removeClass("kid").addClass("monster");
		$(".characters,#player").removeClass("monster").addClass("kid");
	}
	else{
		$("#intro p.kid").hide();
		$("#intro p.monster").show();
		$(".characters,#player").removeClass("kid").addClass("monster");
		$(".board").removeClass("monster").addClass("kid");
	}
	interaction++;
})
$(".start-btn").click(function(){
	if($(this).hasClass("disabled")) return;
	$("#intro").hide();
	$("#game").fadeIn(400,function(){
		isAlive = true;
	});
	interaction++;
})
$(".quit-btn").click(function(){
	endGame();
	interaction++;
})