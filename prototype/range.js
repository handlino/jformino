(function () {
	var body = document.getElementsByTagName('body')[0];
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].className != 'range') continue;
		inputs[i].readOnly = true;
		inputs[i].range = {min: 0, max: 100};
		var wrap = document.createElement('div');
		var input = document.createElement('input');
		wrap.className = 'range-field-wrap';
		body.appendChild(wrap);
		target =inputs[i];
		wrap.appendChild(input);
		input.value = target.value;
		var plus = document.createElement('div');
		var plusimg = document.createElement('img');
		plusimg.alt = 'plus';
		plusimg.src = 'plus-20.png';
		plus.appendChild(plusimg);
		plus.className = 'range-plus-button';
		plus.onclick = function () {
			var val = parseInt(target.value) + 1;
			if (val > target.range.max) val = target.range.max;
			target.value = val;
			input.value = val;
			scroller.move(val);
		}
		var minus = document.createElement('div');
		var minusimg = document.createElement('img');
		minusimg.alt = 'minus';
		minusimg.src = 'minus-20.png';
		minus.appendChild(minusimg);
		minus.className = 'range-minus-button';
		minus.onclick = function () {
			var val = parseInt(target.value) - 1;
			if (val < target.range.min) val = target.range.min;
			target.value = val;
			input.value = val;
			scroller.move(val);
		}
		var scrollbar = document.createElement('div');
		scrollbar.className = 'range-scroll-bar';
		var scroller = document.createElement('div');
		scroller.className = 'range-scroller';
		var scrollline = document.createElement('div');
		scrollline.className = 'range-scroll-line';
		wrap.style.display = 'none';
		wrap.appendChild(minus);
		wrap.appendChild(plus);
		scrollbar.appendChild(scroller);
		scrollbar.appendChild(scrollline);
		wrap.appendChild(scrollbar);
		scroller.range = {min: parseInt(scroller.style.left), max: parseInt(scrollline.style.left) + scrollline.offsetWidth - scroller.offsetWidth};
		function asjust() {
            wrap.style.position = 'absolute';
            wrap.style.left = pageX(target) + 'px';
            wrap.style.top = pageY(target) + 'px';
			scrollline.style.top = (scrollbar.offsetHeight/2 -2) + 'px';
			scrollline.style.left = '8px';
			scrollline.style.width = (scrollbar.offsetWidth - 24) + 'px';
			scroller.style.left = '8px';
			scroller.style.top = ((scrollbar.offsetHeight - scroller.offsetHeight) / 2 - 1) + 'px';
			scroller.range = {min: parseInt(scroller.style.left), max: parseInt(scrollline.style.left) + scrollline.offsetWidth - scroller.offsetWidth};
		}
		scroller.move = function (val) {
			var pos = ((val - target.range.min)/(target.range.max - target.range.min) * (scroller.range.max - scroller.range.min) + scroller.range.min); 
			scroller.style.left = parseInt(pos) + 'px';
		};
		scroller.onmousedown = function (event) {
			scroller.mouseInit = getMousePosition(event);
			scroller.init = parseInt(scroller.style.left);
			wrap.onmousemove = function (event) {
				var pos = getMousePosition(event);
                var posNow = scroller.init + pos[0] - scroller.mouseInit[0];
                if (posNow > scroller.range.max) posNow = scroller.range.max;
                if (posNow < scroller.range.min) posNow = scroller.range.min;
                scroller.style.left = posNow + 'px';
                target.value = parseInt((posNow - scroller.range.min)/(scroller.range.max - scroller.range.min) * 100 + 0);
                input.value = parseInt((posNow - scroller.range.min)/(scroller.range.max - scroller.range.min) * 100 + 0);
			};
			document.onmouseup = function (event) {
				wrap.onmousemove = null;
			};
		};
		target.onfocus = function () {
            wrap.style.display = 'block';
			asjust();
			wrap.onclick = function () {
				wrap.focus = true;	
			};
			document.onclick = function (event) {
				wrap.onmousemove = null;
				if (!wrap.focus) {
					wrap.style.display = 'none';
                    document.onclick = null;
                    wrap.focus = true;
				}
				else wrap.focus = false;
			};
			scroller.move(target.value);
		};
	}

	function getMousePosition (event)
	{
		if (document.all) {
			x = window.event.clientX + document.documentElement.scrollLeft + $("body")[0].scrollLeft;
			y = window.event.clientY + document.documentElement.scrollTop + $("body")[0].scrollTop;
		} else {
			x = event.clientX + window.scrollX;
			y = event.clientY + window.scrollY;
		}
		return [x,y];
	}

        function pageX (elem) {
            return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft;    
        }
        function pageY (elem) {
            return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop;    
        }
        function parentX (elem) {
            return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode);
        }
        function parentY (elem) {
            return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode);
        }

})();
