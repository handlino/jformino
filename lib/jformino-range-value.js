// vim: set sw=4 tabstop=4 expandtab :
/*

LICENSE
=======

The MIT License

Copyright (c) 2007,2008 Handlino, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject
to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function($) {

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

    $.extend( $.formino.renderer, {
        'range-value': function(params) {
            var elem = $.formino.renderer.text({
                name: params.name,
                values: ['']
            })[0];
            return $.formino.actor['range-value'](elem, params, null);
        }
    });

    $.extend( $.formino.actor, {
        'range-value' : function (elem, params, callback) {
            var real = elem;

            if (!params.max) params.max = 100;
            if (!params.min) params.min = 0;

            real.each(function() {
                var target = jQuery(this);
                if (!target.get(0).pop) {
                    target.get(0).pop = jQuery("<div class=\"range-field-wrap\" style=\"display: none; position: absolute; left: 8px; top: 8px;\"><input/><div class=\"range-minus-button\"><img alt=\"minus\" src=\"minus-20.png\"/></div><div class=\"range-plus-button\"><img alt=\"plus\" src=\"plus-20.png\"/></div><div class=\"range-scroll-bar\"><div class=\"range-scroller\" style=\"left: 128px; top: 2px;\"/><div class=\"range-scroll-line\" style=\"top: 9px; left: 8px; width: 176px;\"/></div></div>");
                    var plus = target.get(0).pop.find(".range-plus-button");
                    var minus = target.get(0).pop.find(".range-minus-button");
                    var scroller = target.get(0).pop.find(".range-scroller");
                    var scrollbar = target.get(0).pop.find(".range-scroll-bar");
                    var scrollline = target.get(0).pop.find(".range-scroll-line");
                    var input = target.get(0).pop.find("input");
                    jQuery("body").append(target.get(0).pop);
                    var wrap = target.get(0).pop;
                    target.val(0);

                    plus.bind("click", function () {
                        var val = parseInt(target.val()) + 1;
                        if (val > params.max) val = params.max;
                        target.val(val);
                        input.val(val);
                        scroller.move(val);
                    });
                    minus.bind("click", function () {
                        var val = parseInt(target.val()) - 1;
                        if (val < params.min) val = params.min;
                        target.val(val);
                        input.val(val);
                        scroller.move(val);
                    });
                    scroller.move = function (val) {
                        var pos = ((val - params.min)/(params.max - params.min) * (scroller.range.max - scroller.range.min) + scroller.range.min); 
                        scroller.css({left: parseInt(pos) + 'px'});
                    };
                    scroller.bind("mousedown", function (event) {
                        scroller.mouseInit = getMousePosition(event);
                        scroller.init = parseInt(scroller.css("left"));
                        wrapmm = function (event) {
                            var pos = getMousePosition(event);
                            var posNow = scroller.init + pos[0] - scroller.mouseInit[0];
                            if (posNow > scroller.range.max) posNow = scroller.range.max;
                            if (posNow < scroller.range.min) posNow = scroller.range.min;
                            scroller.css({left: posNow + 'px'});
                            target.val(parseInt((posNow - scroller.range.min)/(scroller.range.max - scroller.range.min) * (params.max-params.min) + params.min));
                            input.val(parseInt((posNow - scroller.range.min)/(scroller.range.max - scroller.range.min) * (params.max-params.min) + params.min));
                        };
                        wrap.bind("mousemove", wrapmm);
                        document.onmouseup = function (event) {
                            wrap.unbind("mousemove", wrapmm);
                        };
                    });

                    scroller.range = {min: parseInt(scroller.css("left")), max: parseInt(scrollline.css("left")) + scrollline.width() - scroller.width()};
                    wrap.adjust = function () {
                        wrap.css({position: 'absolute', left: target.offset().left +'px', top: target.offset().top +'px'});
                        scrollline.css({width: (scrollbar.width() - 24) +'px', left: '8px', top: (scrollbar.height()/2 - 2) +'px'});
                        scroller.css({left: '8px', top: ((scrollbar.height() - scroller.height()) / 2 - 1) +'px'});
                        scroller.range = {min: parseInt(scroller.css("left")), max: parseInt(scrollline.css("left")) + scrollline.width() - scroller.width()};
                    }

                    target.bind("focus", function() {
                        wrap.show();
                        input.val(target.val());
                        wrap.adjust();
                        scroller.move(input.val());
                        wrap.bind("click", function () {
                            wrap.focus = true;
                        });
                        document.onclick = function() {
                            wrap.onmousemove = null;
                            if (!wrap.focus) {
                                wrap.hide();
                                document.onclick = null;
                                wrap.focus = true;
                            }
                            else wrap.focus = false;
                        };
                    });
                }
            });

            return real;
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
