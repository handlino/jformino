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

    var padding = function(v) {
        return ( v < 10 ) ? ("0" + v) : v;
    };

    var format_date = function(d) {
        return d.getFullYear() + "/" +
            padding(d.getMonth()+1) + "/" +
            padding(d.getDate())
    };

    var max = function (a, b) {
        return (a>b)?a:b;
    };

    $.extend( $.formino.renderer, {
        'date-to-date': function(params) {
            var elem = $.formino.renderer.text({
                name: params.name + '-start',
                values: ['']
            })[0].add( $.formino.renderer.text({
                name: params.name + '-end',
                values: ['']
            })[0]);
            return $.formino.actor['date-to-date'](elem, params, null);
        }
    });

    $.extend( $.formino.actor, {
        'date-to-date' : function (elem, params, callback) {
            if (elem.pop) return;
            if (elem.size() != 2) return;

            var face = elem.attr('name', '').focus(function() {
                var offset = elem.eq(0).offset();
                offset.top += elem.eq(0).get(0).offsetHeight;
                elem.pop.css(offset).show().css({'width': (cal1.width()+cal2.width()+parseInt(elem.pop.css('padding-left'))+parseInt(elem.pop.css('padding-right'))+16)+'px',
                    height: (max(cal1.height(), cal2.height())+parseInt(elem.pop.css('padding-top'))+parseInt(elem.pop.css('padding-bottom')))+'px'});
                cal2.get(0).style.left = (parseInt(cal1.width()) + 16) + "px"; // for an unknow reason, css() is not working
                cal.find("td").each(function () { calcellcheck(this); });
                $(this).blur();
            });
            var real = $.formino.renderer.hidden({
                name: params.name + '-start',
                label: '',
                values: ['']
            })[0].add( $.formino.renderer.hidden({
                name: params.name + '-end',
                label: '',
                values: ['']
            })[0]);

            var d1 = false;
            var d2 = false;
            var calmouseover;
            var calcellcheck = function (target, hoverDate) {
                if (target.d) {
                    if (d1 && d2) hoverDate = d2;
                    if (target.d.getTime() >= d1.getTime() && target.d.getTime() <= hoverDate.getTime())
                        $(target).addClass("inrange");
                    else if (target.d.getTime() >= hoverDate.getTime() && target.d.getTime() <= d1.getTime())
                        $(target).addClass("inrange");
                    else 
                        $(target).removeClass("inrange").removeClass("selected");
                }
            };
            
            var cb2 =  function (e, calendar, info) {
                if (info == 'next') {
                    calendar.api.previousMonth();
                    cal1.api.nextMonth();
                    cal2.api.nextMonth();
                    cal1.find(".calnavright").hide();
                    cal2.find(".calnavleft").hide();
                    cal.find("td").each(function () { calcellcheck(this, (d2)?null:d1); });
                }
                else if (info == 'previous') {
                    calendar.api.nextMonth();
                    cal1.api.previousMonth();
                    cal2.api.previousMonth();
                    cal1.find(".calnavright").hide();
                    cal2.find(".calnavleft").hide();
                    cal.find("td").each(function () { calcellcheck(this, (d2)?null:d1); });
                }
                else {
                    var d = calendar.selectedDate;
                    if (!d) return false;
                    if (!d1 || (d1 && d2)) {
                        cal.find("td").each(function () {
                            $(this).removeClass("inrange").removeClass("selected");
                        });
                        d1 = d;
                        d2 = false;
                        calmouseover = function (e) {
                            var evtTarget = e.target;
                            if (evtTarget.nodeType == 3)
                                evtTarget = evtTarget.parentNode;
                            if (evtTarget.nodeName.toLowerCase() == "a")
                                evtTarget = evtTarget.parentNode;
                            if (evtTarget.d == null) return;

                            cal.find("td").each(function () { calcellcheck(this, evtTarget.d); });
                        };
                        cal.bind("mouseover", calmouseover);
                    }
                    else d2 = d;
                    if (d1 && d2) {
                        face.eq(0).val( format_date(d1) );
                        face.eq(1).val( format_date(d2) );
                    }
                }
            };

            var container = $("<div />").addClass("date-to-date").css({position: 'relative'});
            var cursor = new Date() 
            var cal1 = $.formino.datetime.cal_basic(cursor, cb2);
            var cal2 = $.formino.datetime.cal_basic(cursor.setMonth( cursor.getMonth() + 1 ), cb2);
            var cal = cal1.add(cal2).css('border-color', 'transparent');
            cal1.find(".calnavright").hide();
            cal2.find(".calnavleft").hide();
            if (elem.get(0).parentNode) container.insertAfter(elem);
            elem.pop = $("<div/>").appendTo(document.body).css({ position: 'absolute', width: '0px' }).addClass('yui-calcontainer');
            elem.appendTo(container);
            real.appendTo(container);
            face.eq(0).appendTo(container);
            $("<span> " + ((params.tilde)?params.tilde:"~") + " </span>").appendTo(container)
            face.eq(1).appendTo(container);
            cal.appendTo(elem.pop);

            var $buttons = jQuery("<div/>")
            .addClass("buttons")
            .appendTo(elem.pop.find(".ft").eq(0));

            if (params.buttons == null) {
                params.buttons = [
                    { type: "submit", label: "OK" },
                    { type: "cancel", label: "Cancel" }
                ];
            }
            $.each(params.buttons, function() {
                var button = $("<a href='#' class='button'></a>")
                .text(this.label)
                .appendTo( $buttons );
                if (this.type == "submit") {
                    button.click(function () {
                        if (d1 && d2) {
                            cal.unbind("mouseover", calmouseover);
                            if (d1.getTime() > d2.getTime())
                                d = d2, d2 = d1, d1 = d;
                            real.eq(0).val( d1.getTime()/1000 );
                            real.eq(1).val( d2.getTime()/1000 );
                            if ($.isFunction(callback)) callback();
                        }
                        elem.pop.hide();
                    });
                }
                else if (this.type == "cancel") {
                    button.click(function() {
                        face.eq(0).val("");
                        face.eq(1).val("");
                        if (real.eq(0).val() != "") {
                            d1.setTime(parseInt(real.eq(0).val()*1000));
                            face.eq(0).val(format_date(d1));
                            d2.setTime(parseInt(real.eq(1).val()*1000));
                            face.eq(1).val(format_date(d2));
                        }
                        var real_ts = real.attr("ts");
                        if ( real_ts != null ) {
                            face.ts( real_ts );
                        }
                        else {
                            elem.pop.find("td").removeClass("selected")
                        }

                        elem.pop.hide();
                        elem.pop.trigger("hide");
                        return false;
                    });
                }
                else if ( $.isFunction(this.click) ) {
                    var handler = this.click;
                    button.click(function() {
                        handler.call(face, face.__cal.selectedDate);
                    });
                }
            });

            elem.pop.hide();
            return container;
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
