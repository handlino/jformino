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

    var format_date = function(d) {
        return d.getFullYear() + "/" +
            padding(d.getMonth()+1) + "/" +
            padding(d.getDate())
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
        },
    });

    $.extend( $.formino.actor, {
        'date-to-date' : function (elem, params, callback) {
            if (elem.pop) return;
            if (elem.size() != 2) return;

            var face = elem.attr('name', '').focus(function() {
                var offset = elem.eq(0).offset();
                offset.top += elem.eq(0).get(0).offsetHeight;
                elem.pop.css(offset).show();
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
            
            var cb2 =  function () {
                var d = cal.selectedDate;
                var calmouseover;
                if (!d) return false;
                if (!d1 || (d1 && d2)) {
                    cal.find("td").each(function () {
                        $(this).removeClass("inrange");
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
                        var dhover = evtTarget.d;

                        cal.find("td").each(function () {
                            if (this.d) {
                                if (this.d.getTime() >= d1.getTime() && this.d.getTime() <= dhover.getTime())
                                    $(this).addClass("inrange");
                                else if (this.d.getTime() >= dhover.getTime() && this.d.getTime() <= d1.getTime())
                                    $(this).addClass("inrange");
                                else
                                    $(this).removeClass("inrange");
                                    $(this).removeClass("selected");
                            }
                        });
                    };
                    cal.bind("mouseover", calmouseover);
                }
                else d2 = d;
                if (d1 && d2) {
                    cal.unbind("mouseover", calmouseover);
                    if (d1.getTime() > d2.getTime()) {
                        face.eq(0).val( format_date(d2) );
                        face.eq(1).val( format_date(d1) );
                        real.eq(0).val( d2.getTime()/1000 );
                        real.eq(1).val( d1.getTime()/1000 );
                    }
                    else {
                        face.eq(0).val( format_date(d1) );
                        face.eq(1).val( format_date(d2) );
                        real.eq(0).val( d1.getTime()/1000 );
                        real.eq(1).val( d2.getTime()/1000 );
                    }
                    elem.pop.hide();
                }
            };

            var container = $("<div />").addClass("date-to-date");
            var cal = $.formino.datetime.cal_basic(new Date(), cb2);
            if (elem.get(0).parentNode) container.insertAfter(elem);
            elem.pop = $("<div/>").appendTo(document.body).css({ position: 'absolute' });
            elem.appendTo(container);
            real.appendTo(container);
            face.eq(0).appendTo(container);
            $("<span> ~ </span>").appendTo(container)
            face.eq(1).appendTo(container);
            cal.appendTo(elem.pop);

            elem.pop.css({display: 'none'});
            container.css({position: 'relative'});
            return container;
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
