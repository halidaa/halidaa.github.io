/*parameters*/
var board = [[0,0,1,0,0,0,1,0],
		   [0,0,0,0,1,0,0,1],
		   [1,1,0,0,0,0,0,0],
		   [0,0,0,0,0,1,0,0],
		   [0,0,0,0,0,0,0,0],
		   [0,0,0,1,1,1,0,0],
		   [0,0,0,0,0,0,0,1],
		   [1,1,1,0,0,0,0,0],
		   [0,0,0,0,0,0,0,1],
		   [0,0,0,0,0,0,1,0]];
var boardHeight = 5;
var boardWidth = 5;
var tileSize = 100;
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
var gameInterval;
var position = 0;
var _data = [];

function drawRow(row){
	$(".board").prepend("<div class='row'></div>");
	for (var j = 0; j < boardWidth; j++){
		var charID = Math.floor((Math.random() * 4) + 1);
		if(row[j] > 0){
			$(".board .row").eq(0).append('<span class="char char-'+charID+'"></span>');
		}
		else{
			$(".board .row").eq(0).append('<span></span>');
		}
	}
}

function checkCollide(){
	var posX = parseInt($("#player").css("left"))/tileSize;
	var xState = $(".board .row").eq(boardHeight-1).find("span").eq(posX).hasClass("char");
	return xState;
}

function eatKid(){
	var posX = parseInt($("#player").css("left"))/tileSize;
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

function callServer(_data){
	$.ajax({
		url: "http://codingthecrowd.com/counter.php",
		//url: "http://utakutik.us/crowdprogramming/crowdcounter.php",
		dataType: "jsonp",
		data: {
			key: "garfield",
			data: JSON.stringify(_data)
		},
		success: function( response ) {
			var count = parseInt(response["count"]);
			var result = response["results"];
			var total = 0;
			for(var i = 0; i < result.length; i++){
				total += parseInt(JSON.parse(result[i]["data"]).ship);
			}
			idle++;
			
			if(offset != parseInt(response["time"]%board.length)){
				offset = parseInt(response["time"])%board.length;
				var nextRow = [];
				var nextIdx = board.length - boardHeight - offset;
				if (nextIdx < 0) nextIdx += board.length;
				nextRow = board[nextIdx];
				$(".board").children(".row").last().remove();
				drawRow(nextRow);
			}
			
			position = Math.floor(total/count) * 100;
			$("#player").css("left",position);
			if(isAlive){
				var position = parseInt($("#highlighter").css("left"))/100;
				var _data = {ship:position,alive:isAlive,idle:idle,interaction:interaction};
				callServer(_data);
			}
		}
	})
}

var gameInterval = setInterval(function(){
	if (isAlive){			
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
	var position = parseInt($("#highlighter").css("left"));
	if(e.keyCode==37) {
		position-=tileSize;
	} else if(e.keyCode == 39) {
		position+=tileSize;
	}
	if(position < 0) position = (boardWidth - 1) * tileSize;
	if(position > ((boardWidth - 1)*tileSize)) position = 0;
	$("#highlighter").css("left",position+"px");
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
	_data = {ship:2,alive:true,idle:idle,interaction:interaction};
	$.ajax({
		url: "http://codingthecrowd.com/counter.php",
		//url: "http://utakutik.us/crowdprogramming/crowdcounter.php",
		dataType: "jsonp",
		data: {
			key: "garfield",
			data: JSON.stringify(_data)
		},
		success: function( response ) {
			$("#intro").hide();
			//draw the board
			offset = parseInt(response["time"])%board.length;
			
			for (var i = 4; i >= 0; i--){
				var nextRow = [];
				var nextIdx = board.length - boardHeight - offset + i;
				if (nextIdx < 0) nextIdx += board.length;
				if (nextIdx > (board.length - 1)) nextIdx = 0;
				nextRow = board[nextIdx];
				drawRow(nextRow);
				//drawRow(board[i]);
			}
			
			//set player/highlighter position
			var count = parseInt(response["count"]);
			var total = 0;
			var result = response["results"];
			for(var i = 0; i < result.length; i++){
				total += parseInt(JSON.parse(result[i]["data"]).ship);
			}
			position = Math.floor(total/count) * 100;
			$("#player,#highlighter").css("left",position);
			
			//fade the board in
			$("#game").fadeIn(400,function(){
				isAlive = true;
				position = parseInt($("#highlighter").css("left"))/100;
				_data = {ship:position,alive:isAlive,idle:idle,interaction:interaction};
				callServer(_data);
			});
		}
	})
	interaction++;
})
$(".quit-btn").click(function(){
	endGame();
	interaction++;
})