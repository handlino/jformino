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

    var daysInMonth = function (iMonth, iYear) {
	    return 32 - new Date(iYear, iMonth, 32).getDate();
    };

    var padding = function (v) {
        return ( v < 10 ) ? ("0" + v) : v;
    };

    $.extend( $.formino.renderer, {
        'birthday': function(params) {
            var elem = $.formino.renderer.hidden({
                name: params.name,
                values: ['']
            })[0];
            return $.formino.actor['birthday'](elem, params, null);
        }
    });

    $.extend( $.formino.actor, {
        'birthday' : function (elem, params, callback) {
            var real;

            var yearLabel = (params.yearLabel)?params.yearLabel:"/";
            var monthLabel = (params.monthLabel)?params.monthLabel:"/";
            var dayLabel = (params.dayLabel)?params.dayLabel:"";
            var yearPickerLabel = (params.yearPickerLabel)?params.yearPickerLabel:"Birth Year";
            var monthPickerLabel = (params.monthPickerLabel)?params.monthPickerLabel:"Birth Month";
            var dayPickerLabel = (params.dayPickerLabel)?params.dayPickerLabel:"Birth Day";
            var seperate = (params.seperate)?params.seperate:"-";

            elem.each(function () {
                var target = $(this).hide();
                var container = $("<span/>").addClass("jFormino-birthday");
                var year = $("<input/>").attr("readonly", "readonly").addClass("jFormino-birthday-year");
                var month = $("<input/>").attr("readonly", "readonly").addClass("jFormino-birthday-month");
                var day = $("<input/>").attr("readonly", "readonly").addClass("jFormino-birthday-day");
                var picker = $("<div/>").addClass("jFormino-birthday-picker").hide();

                if (target.val() != "" && target.val().split(seperate).length == 3) {
                    var vals = target.val().split(seperate);
                    year.val(vals[0]);
                    month.val(vals[1]);
                    day.val(vals[2]);
                }
                var setVal = function () {
                    var val = Array();
                    if (year.val() != "" && month.val() != "" && day.val() != "")
                        target.val(year.val() + seperate + month.val() + seperate + day.val());
                };
                var setPos = function () {
                    var offset = year.offset();
                    picker.css("left", offset.left);
                    picker.css("top", offset.top + year.get(0).offsetHeight);
                };

                year.appendTo(container);
                $("<span>"+yearLabel+"</span>").addClass("jFormino-birthday-seperate").appendTo(container);
                month.appendTo(container);
                $("<span>"+monthLabel+"</span>").addClass("jFormino-birthday-seperate").appendTo(container);
                day.appendTo(container);
                $("<span>"+dayLabel+"</span>").addClass("jFormino-birthday-seperate").appendTo(container);
                if (target.get(0).parentNode) {
                    container.insertAfter(target);
                    target.appendTo(container);
                }
                picker.appendTo($("body")[0]);
                real = container;

                year.focus(function () {
                    picker.empty();;
                    var hundred = $("<ol>").addClass("jFormino-birthday-year");
                    for (i = 1910; i <= 2000; i += 10) {
                        var tenCon = $("<li>");
                        var ten = $("<ol>");
                        for (j = 0; j < 10; j += 1) {
                            var one = $("<li>"+(i+j)+"</li>");
                            if (j == 0) one.addClass("jFormino-birthday-first");
                            if (i+j == parseInt(year.val())) one.addClass("jFormino-birthday-checked");
                            (function () {
                                var val = i+j;
                                one.appendTo(ten);
                                one.click(function () {
                                    year.val(val);
                                    setVal();
                                    picker.hide();
                                    month.focus();
                                });
                            })();
                        }
                        ten.appendTo(tenCon);
                        tenCon.appendTo(hundred);
                    }
                    $("<div>"+yearPickerLabel+"</div>").addClass("jFormino-birthday-head").appendTo(picker);
                    hundred.appendTo(picker);
                    $(picker).show();
                    setPos();
                });

                month.focus(function () {
                    picker.empty();
                    var all = $("<ol>").addClass("jFormino-birthday-month");
                    for (i = 1; i <= 12; i += 1) {
                        var one = $("<li>"+i+"</li>");
                        if (i%4 == 1) one.addClass("jFormino-birthday-one");
                        if (i == parseInt(month.val())) one.addClass("jFormino-birthday-checked");
                        (function () {
                            var val = i;
                            one.appendTo(all);
                            one.click(function () {
                                month.val(padding(val));
                                setVal();
                                picker.hide();
                                day.focus();
                            });
                        })();
                    }
                    $("<div>"+monthPickerLabel+"</div>").addClass("jFormino-birthday-head").appendTo(picker);
                    all.appendTo(picker);
                    picker.show();
                    setPos();
                });

                day.focus(function () {
                    picker.empty();
                    var all = $("<ol>").addClass("jFormino-birthday-day");
                    for (i = 1; i <= daysInMonth(month.val()-1, year.val()); i += 1) {
                        var one = $("<li>"+i+"</li>");
                        if (i%7 == 1) one.addClass("jFormino-birthday-one");
                        if (i == parseInt(day.val())) one.addClass("jFormino-birthday-checked");
                        (function () {
                            var val = i;
                            one.appendTo(all);
                            one.click(function () {
                                day.val(padding(val));
                                setVal();
                                picker.hide();
                            });
                        })();
                    }
                    $("<div>"+dayPickerLabel+"</div>").addClass("jFormino-birthday-head").appendTo(picker);
                    all.appendTo(picker);
                    $(picker).show();
                    setPos();
                });
            });
            return real;
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
