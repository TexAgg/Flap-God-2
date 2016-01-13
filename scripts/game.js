function remove_title()
{
	$("#title_menu").hide();
	//console.log("Removing title");

	$("#difficulty").show();
	//console.log("Showing difficulty");

	$("#exit_to_screen").show();
	//console.log("Showing \"return\" button");

	//$("#pepe-id").hide();
};

function begin_game()
{
	$("#difficulty").hide();
	$("#actual_game").show();
	//$("#myCanvas").show();

	create_pancakes();
};

function return_to_screen()
{
	//http://stackoverflow.com/questions/1535331/how-to-hide-all-elements-except-one-using-jquery
	$("body>*").hide();
	$("#title_menu").show();
	//$("#pepe-id").show();
	//$("#actual_game").empty();

	/*Remove dropdown menu
	http://stackoverflow.com/questions/19885788/removing-every-child-element-except-first-child*/
	var dum =  document.getElementById("actual_game");
	while (dum.lastChild.id !== 'myCanvas')
		dum.removeChild(dum.lastChild);
};

function create_pancakes()
{
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0,0,canvas.width,canvas.height);

	var num_cakes = document.getElementById("diff_num").value;
	positions = [];	//The current postions of the pancakes
	ordered_ints = [];	//Literally just the natural numbers 1-num_cakes

	/*
	There is no 'var' in front of 'positions'
	This is a bad hack to make 'positions'
	accessable to 'flip_time()'
	*/

	//Populate the arrays
	for(var i = 0; i < num_cakes; i++)
	{
		positions[i] = i;
		ordered_ints[i] = i;
	}

	//Shuffle the positions
	while (positions.equals(ordered_ints))
	{
		shuffle(positions);
		//console.log(positions);
	}

	var t = document.createTextNode("Flip!");

	//Dropdown list to flip pancakes
	//Buttons would be ideal if i can figure them out
	var dropdown_list = document.createElement("select");
	dropdown_list.setAttribute("id","dropdown_list");
	//dropdown_list.setAttribute("onchange", "flip_time(this.value)");
	var optionStr = '';

	var flip_button = document.createElement("button");
	flip_button.setAttribute("id", "flip_button");
	flip_button.setAttribute("onclick","flip_time(dropdown_list.value)");
	flip_button.appendChild(t);

	//dropdown_list.appendChild(t);

	for(var i = 0; i < positions.length; i++)
	{
		ctx.fillStyle = "brown";
		ctx.beginPath();
		ctx.ellipse(300,25+55*i,75+25*positions[i],25,0,0,2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		//ctx.fillStyle = "brown";

		optionStr+="<option value="+i+">"+i+"</option>";
	}

	dropdown_list.innerHTML = optionStr;
	var ag = document.getElementById("actual_game");
	ag.appendChild(dropdown_list);
	ag.appendChild(flip_button);

	/*
	function flip_time(n)
	{
		//var canvas = document.getElementById("myCanvas");
		//var ctx = canvas.getContext("2d");

		ctx.clearRect(0,0,canvas.width,canvas.height);

		reverse(positions,0,n);

		for(var i = 0; i < positions.length; i++)
		{
			ctx.beginPath();
			ctx.ellipse(300,25+55*i,75+25*positions[i],25,0,0,2 * Math.PI);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
			ctx.fillStyle = "brown";
		}
	};
	*/
};

/*Doesn't call if you try to flip the same pancake twice*/
function flip_time(n)
{
	console.log("Calling flip_time()");

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0,0,canvas.width,canvas.height);

	//parseInt so it doesn't concatenate
	reverse(positions,0,parseInt(n)+1);

	for(var i = 0; i < positions.length; i++)
	{
		ctx.beginPath();
		ctx.ellipse(300,25+55*i,75+25*positions[i],25,0,0,2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "brown";
	}

	/*
	if(positions.equals(ordered_ints))
	{
		console.log("before pause");
		//http://www.sean.co.uk/a/webdesign/javascriptdelay.shtm
		setTimeout(return_to_screen(),1500);
		//return_to_screen();
		console.log("After pause");
	}
	*/
};

//lol probably never gonna use this
function point(xx,yy)
{
	this.x = xx;
	this.y = yy;
};

//Bad function for reversing an array
function reverse(arr, start, stop)
{
	stop=stop.valueOf();

	console.log("start="+start);
	console.log("stop="+stop);
	console.log(arr);

	if (start >= stop || stop>arr.length)
	{
		console.log("Error");
		return;
	}

	/*
	for(var i = start; i<stop; i++)
	{
		var dum;

		dum = arr[i];
		arr[i] = arr[stop-i];
		arr[stop-i] = dum;
	}
	*/

	//http://www.cplusplus.com/reference/algorithm/reverse/
	while(start!=stop && start!=--stop)
	{
		console.log("Swapping " + start + " and " + stop);

		var dum;

		dum = arr[start];
		arr[start] = arr[stop];
		arr[stop] = dum;

		++start;
	}

	console.log(arr);

	return(arr);
};

//http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(o)
{
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
