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
            if (!params.imagePath) params.imgPath = "../images/";
            if (!params.plusImage) params.plusImage = "jFormino-range-value-plus-20.png";
            if (!params.minusImage) params.minusImage = "jFormino-range-value-minus-20.png";
            if (!$.isFunction(params.toFace)) params.toFace = function (val) { return val; };
            if (!$.isFunction(params.toValue)) params.toValue = function (val) {return val;};
            if (!$.isFunction(callback)) callback = function () {};
            //if (!$.isFunction(params.toString)) params.toString = function (val) {return val;};

            real.each(function() {
                var target = jQuery(this);
                if (!target.pop) {
                    target.pop = jQuery("<div class=\"range-field-wrap\" style=\"display: none; position: absolute; \"><input/><div class=\"range-minus-button\"><img alt=\"minus\" src=\""+params.imgPath+params.minusImage+"\"/></div><div class=\"range-plus-button\"><img alt=\"plus\" src=\""+params.imgPath+params.plusImage+"\"/></div><div class=\"range-scroll-bar\"><div class=\"range-scroller\" style=\"left: 128px; top: 2px;\"/><div class=\"range-scroll-line\" style=\"top: 9px; left: 8px;\"/></div></div>");
                    var plus = target.pop.find(".range-plus-button");
                    var minus = target.pop.find(".range-minus-button");
                    var scroller = target.pop.find(".range-scroller").css({position: 'absolute'});
                    var scrollbar = target.pop.find(".range-scroll-bar");
                    var scrollline = target.pop.find(".range-scroll-line").css({position: 'absolute'});
                    var face = target.pop.find("input");
                    jQuery("body").append(target.pop);
                    var wrap = target.pop;
                    if (target.val() < params.min) target.val(params.min);
                    if (target.val() > params.max) target.val(params.max);

                    var updateValue = function (val) {
                        if (val > params.max) val = params.max;
                        else if (val < params.min) val = params.min;
                        target.val(params.toValue(val));
                        face.val(params.toFace(val));
                        //face.val(params.toString(val));
                        scroller.move(val);
                    };

                    plus.bind("click", function () {
                        updateValue(parseInt(target.val()) + 1);
                    });

                    minus.bind("click", function () {
                        updateValue(parseInt(target.val()) - 1);
                    });

                    face.bind("change", function () {
                        updateValue(parseInt(face.val()));
                        target.pop.hide();
                    });

                    scroller.move = function (val) {
                        var pos = ((val - params.min)/(params.max - params.min) * (scroller.range.max - scroller.range.min) + scroller.range.min); 
                        scroller.css({left: parseInt(pos) + 'px'});
                    };

                    scroller.bind("mousedown", function (event) {
                        scroller.mouseInit = getMousePosition(event);
                        scroller.init = parseInt(scroller.css("left"));
                        var onWrapMouseMove = function (event) {
                            var pos = getMousePosition(event);
                            var posNow = scroller.init + pos[0] - scroller.mouseInit[0];
                            if (posNow > scroller.range.max) posNow = scroller.range.max;
                            if (posNow < scroller.range.min) posNow = scroller.range.min;
                            scroller.css({left: posNow + 'px'});
                            updateValue(parseInt((posNow - scroller.range.min)/(scroller.range.max - scroller.range.min) * (params.max-params.min) + params.min));
                        };
                        wrap.bind("mousemove", onWrapMouseMove);
                        document.onmouseup = function (event) {
                            wrap.unbind("mousemove", onWrapMouseMove);
                        };
                    });

                    wrap.adjust = function () {
                        wrap.css({position: 'absolute', left: target.offset().left - 4 +'px', top: target.offset().top - 4 +'px'});
                        scrollline.css({width: (scrollbar.width() - 20) +'px', left: '8px', top: (scrollbar.height()/2 - 1) +'px'});
                        scroller.css({left: '8px', top: ((scrollbar.height() - scroller.height()) / 2 - 1) +'px'});
                        //scroller.range = {min: parseInt(scroller.offset().left) - 4, max: parseInt(scrollline.offset().left) + scrollline.width() - scroller.width() + 4};
                        scroller.range = {min: parseInt(scroller.css("left")) - 4, max: parseInt(scrollline.css("left")) + scrollline.width() - scroller.width() + 4};
                    };

                    target.bind("focus", function() {
                        $(".range-field-wrap").hide();
                        wrap.show();
                        face.val(target.val());
                        wrap.adjust();
                        scroller.move(face.val());
                        wrap.bind("click", function () {
                            wrap.focus = true;
                        });
                        face.focus().get(0).select();
                        target.pop.onDocClick = function() {
                            wrap.onmousemove = null;
                            if (!wrap.focus) {
                                wrap.hide();
                                wrap.focus = true;
                                $(document).unbind("click", target.pop.onDocClick);
                                callback();
                            }
                            else wrap.focus = false;
                        };
                        $(document).bind("click", target.pop.onDocClick);
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
