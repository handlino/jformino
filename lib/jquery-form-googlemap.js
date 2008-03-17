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
    $.extend($.form.actor, {
        "googlemap": function(params) {
            var $lat = $("<input type='text' />").attr({
                name: params["name_for_latitude"] || 'latitude'
            }).val(
                params["value_for_latitude"] || ""
            );

            var $lng = $("<input type='text' />").attr({
                name: params["name_for_longitude"] || 'latitude'
            }).val (
                params["value_for_longitude"] || ""
            );
			
            if ( !( _ && typeof _ == "function") ) {
                var _ = function(str) { return str; };
            }

            var m = $("<div></div>")
            .addClass("googlemap").text(_("Loading Google Map..."))
            .append("<br>").appendTo("body");

            var initGoogleMap = function() {
                jQuery(window).bind("unload", function() { GUnload() });

                var el = m.get(0);

                var center = new GLatLng( $lat.val(), $lng.val() );

                var map = new GMap2(el);
                map.setCenter( center );

                if (params.zlevel) map.setZoom(params.zlevel);

                map.addMapType(G_PHYSICAL_MAP);

                map.addControl(new GSmallMapControl());
                map.addControl(new GMapTypeControl());

                map.enableContinuousZoom(); 

                var marker = new GMarker(center, { draggable: true, bouncy: true });

                map.addOverlay(marker);
                GEvent.addListener(marker, 'dragend', function() {
                    var p = marker.getLatLng();

                    $lat.val( p.lat() );
                    $lng.val( p.lng() );

                    map.panTo(p);
                });

                setTimeout(function() {
                    map.checkResize();
                }, 1000);

            };
            setTimeout(initGoogleMap,1);

            return $([
                $("<span></span>").addClass("label").text( params["label_for_latitude"] || "Latitude"),
                $lat,
                $("<span></span>").addClass("label").text( params["label_for_longitude"] || "Longitude"),
                $lng,
                $("<br/>"),
                m
            ]);
        }
    });

})(jQuery);

// Local Variables:
// major-mode: javascript-mode
// javascript-indent-level: 4
// End:

