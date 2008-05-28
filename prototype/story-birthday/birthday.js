// http://snippets.dzone.com/posts/show/2099
function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

$("#year").focus(function () {
    $("#birthday-picker").empty();
    var target = $(this);
    var hundred = $("<ol>").addClass("year");
    for (i = 1910; i <= 2000; i += 10) {
        var tenCon = $("<li>");
        var ten = $("<ol>");
        for (j = 0; j < 10; j += 1) {
            var one = $("<li>"+(i+j)+"</li>");
            if (j == 0) one.addClass("first");
            (function () {
                var val = i+j;
                one.appendTo(ten);
                one.click(function () {
                    target.val(val);
                    $("#birthday-picker").hide();
                    $("#month").focus();
                });
            })();
        }
        ten.appendTo(tenCon);
        tenCon.appendTo(hundred);
    }
    $("<div>出生年：</div>").addClass("head").appendTo("#birthday-picker");
    hundred.appendTo("#birthday-picker");
    $("#birthday-picker").show();
});

$("#month").focus(function () {
    $("#birthday-picker").empty();
    var target = $(this);
    var all = $("<ol>").addClass("month");
    for (i = 1; i <= 12; i += 1) {
        var one = $("<li>"+i+"</li>");
        if (i%4 == 1) one.addClass("one");
        (function () {
            var val = i;
            one.appendTo(all);
            one.click(function () {
                target.val(val);
                $("#birthday-picker").hide();
                $("#day").focus();
            });
        })();
    }
    $("<div>出生月：</div>").addClass("head").appendTo("#birthday-picker");
    all.appendTo("#birthday-picker");
    $("#birthday-picker").show();
});

$("#day").focus(function () {
    $("#birthday-picker").empty();
    var target = $(this);
    var all = $("<ol>").addClass("day");
    for (i = 1; i <= daysInMonth($("#month").val()-1, $("#year").val()); i += 1) {
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
    $("<div>出生日：</div>").addClass("head").appendTo("#birthday-picker");
    all.appendTo("#birthday-picker");
    $("#birthday-picker").show();
});
