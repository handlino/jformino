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

    var format_ts = function(ts) {
        return String(ts);
    };

    var padding = function(v) {
        return ( v < 10 ) ? ("0" + v) : v;
    }

    var format_datetime = function(d) {
        return d.getFullYear() + "/" +
            padding(d.getMonth()+1) + "/" +
            padding(d.getDate()) + " " +
            padding(d.getHours()) + ":" +
            padding(d.getMinutes());
    }

    var on_mouse_scroll = function(cb) {
        return function(event) {
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta/120;
                if (window.opera)
                    delta = -delta;
            } else if (event.detail) {
                delta = -event.detail/3;
            }
            cb(delta);
            return false;
        }
    }

    var max_z_index = function() {
        var z = Math.max.apply(
            Math,
            jQuery("*").map(
                function() {
                    var z = this.style.zIndex;
                    return isNaN(z) ? 0 : Number(z);
                }
            ).get()
        );
        return z + 1;
    }

    $.extend( $.form.renderer, {
        'datetime-scroll': function(params) {
            var real = $.form.renderer.hidden({ name: params.name,  values: [''] });
            var r    = $.form.renderer.text({ name: '', label: '',  values: [''] });

            var format_date = function(d) {
                return d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " "
                    + padding(d.getHours()) + ":" + padding(d.getMinutes()) + ":" + padding(d.getSeconds())
            }

            r.each(function() {
                var d = new Date();
                this.val( format_date(d) );
                real.each(function() { this.val( d.getTime() / 1000); });

                var self= this;
                var mousewheel = on_mouse_scroll(function(delta) {
                    var m = d.getSeconds();
                    m = m - delta;
                    d.setSeconds(m);
                    $(self).val( format_date(d) );

                    real.each(function() {
                        this.val( d.getTime() / 1000);
                    });

                });

                if ($.browser.mozilla)
                    this.bind("DOMMouseScroll", mousewheel);
                else
                    this.bind("mousewheel", mousewheel);

                this.bind("keyup", function() {
                    var v = $(this).val();
                    var m = new Date(Date.parse(v));
                    if (!m.toString().match(/invalid/i)) {
                        d = m;
                    }
                });
            });

            var container = $("<span />").addClass("datetime-scroll");
            r.appendTo(container);
            real.appendTo(container);
            return container;
        },

        'time-hm-scroll': function(params) {
            var elem = $.form.renderer.text({
                name: params.name,
                values: ['']
            })[0];
            return $.form.actor['time-hm-scroll'](elem, params, null);
        },

        'time-hm-select': function(params) {
            var elem = $.form.renderer.hidden({
                name: params.name,
                values: ['']
            })[0];
            return $.form.actor['time-hm-select'](elem, params, null);
        },

        'date-calendar': function(params) {
            var elem = $.form.renderer.text({
                name: params.name,
                values: ['']
            })[0];
            return $.form.actor['date-calendar'](elem, params, null);
        },

        'datetime-calendar': function(params) {
            var elem = $.form.renderer.text({
                name: params.name,
                values: ['']
            })[0];
            return $.form.actor['datetime-calendar'](elem, params, null);
        },

        'datetime': function(params) {
            var r = $("<input type='text' />").addClass("datetime").attr({
                'ts': params.ts
            }).val( format_ts(params.ts) );
            r.mousedown(datetime_picker);
            return r;
        }
    });

    $.extend( $.form.actor, {
        'time-hm-scroll' : function (elem, params, callback) {
            //var real = $.form.renderer.hidden({ name: params.name,  values: [''] });
            var real = elem.hide();
            var r    = $.form.renderer.text({ name: '', label: '',  values: [''] });

            var format_date = function(d) {
                return padding(d.getHours()) + ":" + padding(d.getMinutes()) ;
            }

            r.each(function() {
                var d = new Date();
                this.val( format_date(d) );
                real.each(function() { $(this).val( d.getTime() / 1000); });

                var self= this;
                var mousewheel = on_mouse_scroll(function(delta) {
                    var m = d.getMinutes();
                    m = m - delta;
                    d.setMinutes(m);
                    $(self).val( format_date(d) );

                    real.each(function() {
                        $(this).val( d.getTime() / 1000);
                    });

                });

                if ($.browser.mozilla)
                    this.bind("DOMMouseScroll", mousewheel);
                else
                    this.bind("mousewheel", mousewheel);

                this.bind("keyup", function() {
                    var v = $(this).val();
                    var m = new Date(Date.parse(v));
                    if (!m.toString().match(/invalid/i)) {
                        d = m;
                    }
                });
            });

            var container = $("<span />").addClass("datetime-scroll").insertAfter(real);
            real.appendTo(container);
            r.appendTo(container);
            return container;
        },

        'time-hm-select' : function (elem, params, callback) {
            var hh = [];
            var mm = [];
            var interval_m = 15;
            if (params.interval != null) {
                var matched = params.interval.match(/(\d+)m$/);
                if ( matched ) {
                    interval_m = Number(matched[1]);
                }
            }
            for ( var h = 0 ; h < 24 ; h++ ) {
                hh.push(padding(h));
            }
            var h = $.form.renderer.select({values: hh});
            for ( var m = 0 ; m < 60 ; m += interval_m ) {
                mm.push(padding(m));
            }
            var m = $.form.renderer.select({values: mm});
            //if ( params.value != null) r.val(params.value);
            var time = $("<div>");
            time.h = h.val();
            time.m = m.val();
            h.change(function () {
                time.h = $(this).val();
                elem.val(time.h+":"+time.m);
                if ($.isFunction(callback)) callback();
            }).appendTo(time);
            time.append("&nbsp;:&nbsp;");
            m.change(function () {
                time.m = $(this).val();
                elem.val(time.h+":"+time.m);
                if ($.isFunction(callback)) callback();
            }).appendTo(time);
            
            if (elem.get(0).parentNode) time.insertAfter(elem);
            elem.appendTo(time).hide();

            time.addClass("time-hm-select");

            /*
             * Public Interface: hour(), minute()
             */
            $.extend(time, {
                hour: function(value) {
                    if (typeof(value) != 'undefined')
                        h.val( padding(value) );
                    return h.val();
                },
                minute: function(value) {
                    if (typeof(value) != 'undefined')
                        m.val( padding(value) );
                    return m.val();
                }
            });

            return time;
        },

        'date-calendar' : function (elem, params, callback) {
            if (elem.pop) return;

            var real = $.form.renderer.hidden({
                name: elem.attr('name'),
                label: '',
                values: ['']
            })[0];
            
            var container = $("<div />").addClass("date-calendar");
            if (elem.get(0).parentNode) container.insertAfter(elem);
            elem.appendTo(container);

            var face = elem.attr('name', '')
            var cb2 =  function () {
                var d = cal.selectedDate;
                if (!d) return false;
                face.val( 
                    d.getFullYear() + "/" +
                        (d.getMonth()+1) + "/" +
                        d.getDate()
                );
                real.val( d.getTime()/1000 );
                elem.pop.hide();
            };

            var cal = $.form.datetime.cal_basic(new Date(), cb2);
            elem.pop = $("<div/>").appendTo(document.body).css({ position: 'absolute' });
            cal.appendTo(elem.pop);
            real.appendTo(container);
            face.focus(function() {
                var offset = $(this).offset();
                offset.top += $(this).get(0).offsetHeight;
                elem.pop.css(offset).show();
                $(this).blur();
            }).appendTo(container);

            elem.pop.css({display: 'none'});
            container.css({position: 'relative'});
            return container;
        },

        'datetime-calendar' : function (elem, params, callback) {
            if (elem.pop) return;

            var real = $.form.renderer.hidden({
                name: elem.attr('name'),
                label: '',
                values: ['']
            })[0];

            var container = $("<div />").addClass("date-calendar");
            if (elem.get(0).parentNode) container.insertAfter(elem);
            elem.appendTo(container);

            var face = elem.attr('name', '');

            var init_datetime = new Date();
            if (params.value) init_datetime.setTime(params.value * 1000);
            init_datetime.setSeconds(0);

            var time_select_option = { 
                'name': '',
                'interval': params.interval
            };

            var time = $.form.renderer['time-hm-select'](time_select_option);

            time.hour( init_datetime.getHours() );
            time.minute( init_datetime.getMinutes() );

            elem.pop = $("<div/>")
            .appendTo(document.body)
            .addClass('jquery-form-calendar-container yui-calcontainer')
            .css({
                position: 'absolute',
                'z-index': max_z_index()
            }).append(
                "<div class='hd'></div>" +
                "<div class='bd'></div>" +
                "<div class='ft'></div>"
            );

            time.prepend("<label>Time: </label>");

            var cal = $.form.datetime.cal_basic(
                init_datetime,
                elem.pop
            );
            elem.pop.find(".bd").append(time);

            real.appendTo(container);
            face.focus(function() {
                var offset = $(this).offset();
                offset.top += $(this).get(0).offsetHeight;
                elem.pop.css(offset).show();
                elem.pop.trigger("show");
                $(this).blur();
            }).appendTo(container);

            // extend public interface for this jquery object.
            // get/set with ts value
            jQuery.extend(
                face,
                {
                    '__cal': cal,
                    '__time': time,
                    // get/set with unix timestamp;
                    'ts': function(ts) {
                        if (typeof(ts) == 'undefined') return real.attr("ts");
                        var d = new Date();
                        d.setTime(ts * 1000);
                        this.date( d );
                    },

                    // get/set with Date object
                    'date': function(d) {
                        if (typeof(d) == 'undefined') {
                            var d = new Date();
                            d.setTime( real.attr("ts") * 1000);
                            return d;
                        }

                        var ts = parseInt( d.getTime()/1000 );
                        var str = "";

                        str = $.isFunction(params.render_as)
                            ? params.render_as.call(this, new Number(ts))
                            : format_datetime(d);

                        face.val(str);

                        if ( $.isFunction(params.toString) ) {
                            str = params.toString.call(this, new Number(ts));
                        }
                        else {
                            str = new String(ts);
                        }
                        real.attr("ts", ts);
                        real.val(str);

                        // Also update UI
                        time.hour( d.getHours() );
                        time.minute( d.getMinutes() );

                        cal.date(d);
                    }
                }
            );

            var cb2 =  function () {
                var d = new Date(cal.selectedDate);
                if (!d) return false;

                d.setHours(time.hour());
                d.setMinutes(time.minute());

                if ($.isFunction(callback)) {
                    var ret_ts = callback.call(face, parseInt(d.getTime()/1000));
                    if (typeof ret_ts != 'undefined')
                        d.setTime( ret_ts * 1000 );
                }

                face.date(d);

                elem.pop.hide();
                $(elem.pop).trigger("hide");

                return false;
            };

            var $buttons = jQuery("<div/>")
            .addClass("buttons")
            .appendTo(elem.pop.find(".ft"));

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
                    button.click(cb2);
                }
                else if (this.type == "cancel") {
                    button.click(function() {
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

            elem.pop.css({display: 'none'});

            /*
             * face's value is shown only when user speficiy
             * the value explicitly.
             */
            if (typeof(params.value) != 'undefined') {
                init_datetime.setTime(params.value * 1000);
                init_datetime.setSeconds(0);
                face.date(init_datetime);
            }

            return container;
        }
    });

    $.extend ( $.form, {
        'datetime': {
            'cal_basic': function ( cursor, calendar, cb) {
                if ( $.isFunction(calendar) ) {
                    cb = calendar;
                    calendar = null;
                }
                if (cursor == null) cursor = new Date();

                if (!calendar) {
                    var calendar = $("<div />")
                    .addClass('jquery-form-calendar-basic yui-calcontainer')
                    .css({
                        position: 'absolute',
                        'z-index': max_z_index()
                    });
                    $("<div></div>").addClass('hd').appendTo(calendar);
                    $("<div></div>").addClass('bd').appendTo(calendar);
                    $("<div></div>").addClass('ft').appendTo(calendar);
                }
                calendar.selectedDate = null;
                
                $.form.datetime.render_calendar_head(calendar, new Date(cursor), cb);
                $.form.datetime.render_calendar_month(calendar, new Date(cursor), cb);

                $.extend( calendar, {
                    'date': function(d) {
                        if (typeof(d) != 'undefined') {
                            this.selectedDate = new Date(d);
                            $.form.datetime.render_calendar_head(this, new Date(d));
                            $.form.datetime.render_calendar_month(this, new Date(d));
                        }
                        return this.selectedDate;
                    }
                });
                return calendar;
            },
            'render_calendar_head': function (calendar, cursor, cb) {
                if ($.isFunction(cursor)) {
                    cb = cursor;
                    cursor = new Date();
                }
                var new_cursor = new Date(cursor);

                calendar.find(".hd").addClass("yui-calendar").empty().append(
                    $('<div class="calheader"></div>').append(
                        $("<a href='#' class='calnavleft'/>").text("Previous").click(
                            function() {
                                new_cursor.setMonth( new_cursor.getMonth() - 1 );
                                $.form.datetime.render_calendar_head(calendar, new_cursor, cb);
                                $.form.datetime.render_calendar_month(calendar, new_cursor, cb);
                                return false;
                            }
                        ),
                        cursor.getFullYear() + "/" + Number(cursor.getMonth()+1),
                        $("<a href='#' class='calnavright'/>").text("Next").click(
                            function() {
                                new_cursor.setMonth( new_cursor.getMonth() + 1 );
                                $.form.datetime.render_calendar_head(calendar, new_cursor, cb);
                                $.form.datetime.render_calendar_month(calendar, new_cursor, cb);
                                return false;
                            }
                        )
                    )
                )
            },
            'render_calendar_month': function (calendar, cursor, cb) {
                if ($.isFunction(cursor)) {
                    cb = cursor;
                    cursor = new Date();
                }
                if (cursor == null) cursor = new Date();

                var elem = calendar.find(".bd .jquery-form-calendar");
                if (elem.size() == 0) {
                  calendar.find(".bd").append(
                      "<div class='jquery-form-calendar'></div>"
                  );
                  elem = calendar.find(".bd .jquery-form-calendar");
                }
                elem.find('table').remove();

                var table = $('<table />').addClass("yui-calendar y" + cursor.getFullYear());
                table.append("<thead></thead><tbody></tbody>");
                var tbody = table.find("tbody");
                var thead = table.find("thead");
                tbody.addClass("m" + (cursor.getMonth()+1) + " calbody");

                var row;

                // Row of Days
                row = $("<tr class='calweekdayrow'></tr>").appendTo(thead);
                $.map(
                    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                    function(day) {
                        $("<th class='calweekdaycell'></th>").text(day).appendTo(row);
                    }
                );

                var this_month = cursor.getMonth();

                cursor.setDate(1);
                row = $("<tr/>");
                for ( var i = 0 ; i < cursor.getDay() ; i++ ) {
                    $("<td></td>")
                    .text(" ")
                    .addClass("calcell oom wd"+i)
                    .appendTo(row);
                }

                for(var i = 1;
                    cursor.getMonth() == this_month;
                    i++, cursor.setDate(i) ) {
                    if (cursor.getDay() == 0) {
                        row.appendTo(table);
                        row = $("<tr/>");
                    }

                    var cell = $("<td></td>")
                    .html("<a href='#' class='selector'>" + i + "</a>")
                    .addClass("calcell selectable")
                    .addClass("wd"+ cursor.getDay())
                    .addClass("d"+ cursor.getDate())
                    .appendTo(row);

                    cell.get(0).d = new Date(cursor);
                }

                for(var i = cursor.getDay(); 0 < i && i < 7; i++) {
                    $("<td></td>")
                    .text(" ")
                    .addClass("calcell oom wd"+ i)
                    .appendTo(row);
                }
                row.appendTo(tbody);
                table.appendTo(elem);

                if (calendar.selectedDate) {
                    var sel = new Date(calendar.selectedDate);
                    table.find(
                        "tbody.m" + (1+ sel.getMonth()) + " td.d" + sel.getDate()
                    ).addClass("selected");
                }

                var cb2 = function(e) {
                    var evtTarget = e.target;
                    if (evtTarget.nodeType == 3)
                        evtTarget = evtTarget.parentNode;
                    if (evtTarget.nodeName.toLowerCase() == "a")
                        evtTarget = evtTarget.parentNode;
                    if (evtTarget.d == null) return;

                    calendar.selectedDate = evtTarget.d;

                    $(table).find("td").removeClass('selected');
                    $(evtTarget).addClass("selected");

                    if ($.isFunction(cb)) cb();
                    return false;
                };

                table.click(cb2);
                table.find("td.selectable").hover(
                    function() {
                        $(this).addClass("calcellhover");
                    },
                    function() {
                        $(this).removeClass("calcellhover");
                    }
                );
            }
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
