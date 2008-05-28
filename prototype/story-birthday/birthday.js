// http://snippets.dzone.com/posts/show/2099
function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function getMousePosition (event) {
    if (document.all) {
        var x = window.event.clientX + document.documentElement.scrollLeft + $("body")[0].scrollLeft;
        var y = window.event.clientY + document.documentElement.scrollTop + $("body")[0].scrollTop;
    } else {
        var x = event.clientX + window.scrollX;
        var y = event.clientY + window.scrollY;
    }
    return [x,y];
}

var px;
var py;

$("#year").focus(function () {
    $("#birthday-picker").empty().css("top", "").css("left", "");
    var target = $(this);
    var hundred = $("<ol></ol>").addClass("year");
    for (  i = 1910; i <= 2000; i += 10) {
        var tenCon = $("<li></li>");
        var ten = $("<ol></ol>");
        for (  j = 0; j < 10; j += 1) {
            var one = $("<li>"+(i+j)+"</li>");
            if (j == 0) one.addClass("first");
            (function () {
                var val = i+j;
                one.appendTo(ten);
                one.click(function (event) {
                    target.val(val);
                    var p = getMousePosition(event);
                    px = p[0];
                    py = p[1];
                    $("#birthday-picker").hide();
                    $("#month").focus();
                });
            })();
        }
        ten.appendTo(tenCon);
        tenCon.appendTo(hundred);
    }
    $("<div class=\"head\">出生年：</div>").appendTo("#birthday-picker");
    hundred.appendTo("#birthday-picker");
    $("#birthday-picker").show();
});

$("#month").focus(function (event) {
    $("#birthday-picker").empty();
    var target = $(this);
    var all = $("<ol></ol>").addClass("month");
    for (  i = 1; i <= 12; i += 1) {
        var one = $("<li>"+i+"</li>");
        if (i%4 == 1) one.addClass("one");
        (function () {
            var val = i;
            one.appendTo(all);
            one.click(function (event) {
                target.val(val);
                var p = getMousePosition(event);
                px = p[0];
                py = p[1];
                $("#birthday-picker").hide();
                $("#day").focus();
            });
        })();
    }
    $("<div class=\"head\">出生月：</div>").appendTo("#birthday-picker");
    all.appendTo("#birthday-picker");

    var w = $("#birthday-picker").show().width();
    var h = $("#birthday-picker").show().height();
    //$("#birthday-picker").css("left", (px-w/2<0)?0:(px-w/2)+"px").css("top", (py-h/2<0)?0:(py-h/2)+"px");
});

$("#day").focus(function () {
    $("#birthday-picker").empty();
    var target = $(this);
    var all = $("<ol></ol>").addClass("day");
    for (  i = 1; i <= daysInMonth($("#month").val()-1, $("#year").val()); i += 1) {
        var one = $("<li>"+i+"</li>");
        if (i%7 == 1) one.addClass("one");
        (function () {
            var val = i;
            one.appendTo(all);
            one.click(function () {
                target.val(val);
                $("#birthday-picker").hide();
            });
        })();
    }
    $("<div class=\"head\">出生日：</div>").appendTo("#birthday-picker");
    all.appendTo("#birthday-picker");
    var w = $("#birthday-picker").show().width();
    var h = $("#birthday-picker").show().height();
    //$("#birthday-picker").css("left", (px-w/2<0)?0:(px-w/2)+"px").css("top", (py-h/2<0)?0:(py-h/2)+"px");
});
