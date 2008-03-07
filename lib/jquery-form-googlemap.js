(function($) {
    $.extend($.form.renderer, {
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

