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
    var $VERSION = "0.12";

    var to_titlecase = function(str) {
        return str
        .replace(/^\s*(.)/, function(m,l){return l.toUpperCase()})
        .replace(/[\-\_](.)/g, function(m, l){return " " + l.toUpperCase()});
    };

    var normalize = function(f, k, v) {
        var field_name;
        var label;
        var values;

        var f_param_is_array = f.params instanceof Array;

        if (typeof v == 'undefined') {
            label = k;
            values = "";
            v = { type: 'text' };
        }
        else if (typeof v == 'string') {
            if( f_param_is_array ) {
                field_name = v;
                label = to_titlecase(v);
                values = [''];
            }
            else {
                field_name = k;
                label = to_titlecase(k);
                values = [v];
            }

            v = {
                type: 'text',
                name: field_name,
                label: label,
                values: values
            };
        }

        if (v.name == null) v.name = k;
        if (v.label == null) v.label = v.name;
        if (v.type == null) v.type = 'text';
        if (v.values == null)
            v.values = [v.value || ''];


        return v;
    }

    var make_input = function(type, multi) {
        return function(params, value) {
            if ( value != null) {
                if (multi) {
                    var $div = $("<div></div>")
                    .append($("<input type='" + type + "'/>").attr('name', params.name).val( value ))
                    .append( $("<span></span>").text( value ).addClass("vlabel") );

                    return $( $div.html() );
                }
                else {
                    return $("<input type='" + type + "'/>").attr({ name: params.name }).val( value );
                }
            }
            return $($.map(
                params.values,
                function( v ) {
                    return $.formino.renderer[type](params, v);
                }
            ));
        }
    };

    $.fn.extend({
        'formino': function() {
            if (this.get(0).nodeName.toLowerCase() == "input") {
                var p = arguments[0];
                var q = arguments[1];

                var actor = $.formino.actor[ p.act_as ];
                if (!$.isFunction(actor)) return this;

                var self = this;
                if (this.size() > 1) {
                    // Bind multiple elements to the same actor all at once.
                    // But, Actor API can't work in this case. Because "this"
                    // jQuery object is not extended in this case.

                    this.each(function() {
                        if(this.nodeName.toLowerCase() == "input") {
                            actor( $(this), p, q);
                        }
                    });
                }
                else {
                    // Allow actor to extend "this" jQuery object with its own API.
                    actor(this, p, q);
                }
                return this;
            }

            if (this.get(0).nodeName.toLowerCase() != "div")
                return this;

            var f = arguments[0];
            var fields = this.html(
                "<form><div><fieldset><legend></legend></fieldset></div></form>"
            )
            .find("legend").text(f.legend || "").end()
            .find("form").addClass("simple").end()
            .find("fieldset");

            $.each(
                f.params,
                function(k, v) {
                    v = normalize(f, k, v);
                    if (v.type != "hidden")
                        $("<label></label>").text( v.label ).appendTo(fields);

                    if ( $.isFunction($.formino.renderer[v.type]) )
                        $.formino.renderer[v.type](v).appendTo(fields)
                    else
                        $("<span></span>").text(v.values).appendTo(fields);

                    $("<br/>").appendTo(fields);
                }
            );
            
            if (f.buttons) {
                $.each(
                    f.buttons ||[],
                    function(i, v) {
                        if(v["type"] == null) v["type"] = 'submit';
                        
                        $("<input type='" + v["type"] + "'></input>")
                        .val(v.value || v.label)
                        .addClass("submit").appendTo(fields);
                    }
                )
            }

            return this.find("form");
        }
    });

    $.extend({
        "formino": {
            "renderer": {
                "hidden": make_input("hidden"),
                "text": make_input("text"),
                "radio": make_input("radio", true),
                "checkbox": make_input("checkbox", true),
                "select": function(params, value) {
                    if (value != null) {
                        return $("<option></option>").attr({"value": value}).text( value );
                    }
                    var s = $("<select></select>").attr({ "name": params.name });
                    $.map(
                        params.values,
                        function(v) {
                            s.append( $.formino.renderer.select(name, v) );
                        }
                    );
                    return s;
                }
            },
            "actor": {}
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:
