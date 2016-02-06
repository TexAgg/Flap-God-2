//game.js

function test_diff(){
	if(parseInt(document.getElementById("diff_num").value)<=9 & parseInt(document.getElementById("diff_num").value)>=2)
		begin_game();
	else
		alert("Please enter a valid input!");
}

function muting()
{
 	var mute = document.getElementById('mutebox').checked;
 	//console.log(mute);
	var em = document.getElementById('em');
 	
	if(mute) em.muted = true;
	else em.muted = false;	
}

function remove_title(){
	$("#title_menu").hide();

	$("#difficulty").show();

	$("#exit_to_screen").show();
	
	player_initials = document.getElementById('initials').value;
};

function show_rules(){
	//remove_title();
	$('#title_menu').hide();
	$("#exit_to_screen").show();
	
	var rules = document.createElement("IMG");
	rules.setAttribute("id","rules");
	rules.setAttribute("src","media/rules.png");
	
	document.body.appendChild(rules);
}

/*Doesn't show up on all browsers.
Shows up on Chrome for sure*/
function show_scores(){
	$('#title_menu').hide();
	$("#exit_to_screen").show();
	
	var score_show = document.createElement("DIV");
	score_show.setAttribute('id','score_show');
	var tp = document.createElement("P");
	tp.setAttribute('id','tp');
	var temp_str = '';
	
	var temp_array = SortLocalStorage();
	
	//Doesn't always work if more than one player gets the same score
	for(var i = 0; i < localStorage.length; i++){
		//temp_str += (i+1) + ": " + localStorage.key(i) + ", " + localStorage.getItem(localStorage.key(i)) + "<br>";
		temp_str += temp_array[i] + ',' + localStorage.getItem(temp_array[i]) + '<br>';
	}
	tp.innerHTML = temp_str;
	score_show.appendChild(tp);
	
	var delete_scores = document.createElement("BUTTON");
	delete_scores.setAttribute("id","delete_scores");
	delete_scores.setAttribute("onclick","(function(){var r = confirm('Are you sure you want to do this?');if(r==true)localStorage.clear();})();");
	delete_scores.appendChild(document.createTextNode("Delete scores"));
	score_show.appendChild(delete_scores);
	
	document.body.appendChild(score_show);
};

function begin_game(){
	$("#difficulty").hide();
	$("#actual_game").show();

	create_pancakes();
};

function return_to_screen(){
	document.location.reload();
	
	/*
	//http://stackoverflow.com/questions/1535331/how-to-hide-all-elements-except-one-using-jquery
	$("body>*").hide();
	$("#title_menu").show();

	//http://stackoverflow.com/questions/19885788/removing-every-child-element-except-first-child
	var dum =  document.getElementById("actual_game");
	while (dum.lastChild.id !== 'myCanvas'&&dum.lastChild.id!=='current_turn'&&dum.lastChild.id!=='current_score')
		dum.removeChild(dum.lastChild);
	*/
};

function create_pancakes(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0,0,canvas.width,canvas.height);

	var num_cakes = parseInt(document.getElementById("diff_num").value);
	positions = [];	//The current postions of the pancakes
	ordered_ints = [];	//Literally just the natural numbers 1-num_cakes
	turn_number = 0;
	document.getElementById("current_score").value = 0;
	
	/*
	There is no 'var' in front of 'positions'
	This is a bad hack to make 'positions'
	accessable to 'flip_time()'
	*/
	
	document.getElementById("current_turn").value = turn_number;

	//Populate the arrays
	for(var i = 0; i < num_cakes; i++){
		positions[i] = i;
		ordered_ints[i] = i;
	}

	//Shuffle the positions
	while (positions.equals(ordered_ints)){
		shuffle(positions);
		//console.log(positions);
	}
	
	var posit = [];
	for (var i = 0; i < positions.length;i++){
		posit[i] = positions[i];
	}
	min_flips = pancake_sort(posit);
	
	//alert("Can be done in " + min_flips + " flips");
	
	print_labels();
	
	var optionStr = "";

	var ag = document.getElementById("actual_game");
	var dumb = document.createElement("div");
	dumb.setAttribute("id","dumb");
	ag.appendChild(dumb);
	
	for(var i = 0; i < positions.length; i++){
		ctx.fillStyle = "brown";
		ctx.beginPath();
		ctx.ellipse(300,25+55*i,75+25*positions[i],25,0,0,2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		
		optionStr+="<button onclick=flip_time("+i+")>"+(i+1)+"</button>";
	}
	
	dumb.innerHTML += optionStr;
	
	alert("Can be done in " + min_flips + " flips");
	
	//want the buttons vertical and to the right
};

function flip_time(n){
	turn_number++;
	document.getElementById("current_turn").value = turn_number;

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	print_labels();

	//parseInt so it doesn't concatenate
	reverse(positions,0,parseInt(n)+1);

	for(var i = 0; i < positions.length; i++){
		ctx.beginPath();
		ctx.ellipse(300,25+55*i,75+25*positions[i],25,0,0,2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "brown";
	}
	
	current_score = (100 - 10*(turn_number - min_flips)) * positions.length;
	document.getElementById("current_score").value = current_score;
	var ls = localStorage;
	
	if(positions.equals(ordered_ints)){
		alert("Congratulations! You won!");
		return_to_screen();
		
		localStorage.setItem(current_score,player_initials);
	}
};

function print_labels(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	for (var  i = 0; i < positions.length; i++)
		ctx.fillText(i,500,25+55*i);
};

//Bad function for reversing an array
function reverse(arr, start, stop){
	stop=stop.valueOf();

	if (start >= stop || stop>arr.length)
		return arr;

	//http://www.cplusplus.com/reference/algorithm/reverse/
	while(start!=stop && start!=--stop){
		var dum;

		dum = arr[start];
		arr[start] = arr[stop];
		arr[stop] = dum;

		++start;
	}

	return arr;
};

//http://stackoverflow.com/questions/3959817/html5-local-storage-sort
function SortLocalStorage(){
   if(localStorage.length > 0){
      var len = localStorage.length;
	  var localStorageArray = new Array();
      for (i=0;i<localStorage.length;i++){
          localStorageArray[len - i] = localStorage.key(i);//+localStorage.getItem(localStorage.key(i));
      }
   }
   var sortedArray = localStorageArray.sort(function(a, b){return b-a});
   return sortedArray;
};

//http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(o){
    //console.log("shuffling");
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

/*
Compare two arrays by element
http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
*/

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
