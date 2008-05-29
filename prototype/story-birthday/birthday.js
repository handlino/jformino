(function () {

// http://snippets.dzone.com/posts/show/2099
function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

$(".birthday").each(function (params) {
    
    var yearLabel = (params.yearLabel)?params.yearLabel:"/";
    var monthLabel = (params.monthLabel)?params.monthLabel:"/";
    var dayLabel = (params.dayLabel)?params.dayLabel:"";
    var seperate = (params.seperate)?params.seperate:"-";

    var target = $(this).hide();
    var container = $("<span>");
    var year = $("<input>").attr("readonly", "readonly");
    var month = $("<input>").attr("readonly", "readonly");
    var day = $("<input>").attr("readonly", "readonly");
    var picker = $("<div>").addClass("birthday-picker").hide();

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
    $("<span>"+yearLabel+"</span>").addClass("seperate").appendTo(container);
    month.appendTo(container);
    $("<span>"+monthLabel+"</span>").addClass("seperate").appendTo(container);
    day.appendTo(container);
    $("<span>"+dayLabel+"</span>").addClass("seperate").appendTo(container);
    container.insertAfter(target);
    picker.appendTo($("body")[0]);

    year.focus(function () {
        picker.empty();;
        var hundred = $("<ol>").addClass("year");
        for (i = 1910; i <= 2000; i += 10) {
            var tenCon = $("<li>");
            var ten = $("<ol>");
            for (j = 0; j < 10; j += 1) {
                var one = $("<li>"+(i+j)+"</li>");
                if (j == 0) one.addClass("first");
                if (i+j == parseInt(year.val())) one.addClass("checked");
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
        $("<div>出生年：</div>").addClass("head").appendTo(picker);
        hundred.appendTo(picker);
        $(picker).show();
        setPos();
    });

    month.focus(function () {
        picker.empty();
        var all = $("<ol>").addClass("month");
        for (i = 1; i <= 12; i += 1) {
            var one = $("<li>"+i+"</li>");
            if (i%4 == 1) one.addClass("one");
            if (i == parseInt(month.val())) one.addClass("checked");
            (function () {
                var val = i;
                one.appendTo(all);
                one.click(function () {
                    month.val(val);
                    setVal();
                    picker.hide();
                    day.focus();
                });
            })();
        }
        $("<div>出生月：</div>").addClass("head").appendTo(picker);
        all.appendTo(picker);
        picker.show();
        setPos();
    });

    day.focus(function () {
        picker.empty();
        var all = $("<ol>").addClass("day");
        for (i = 1; i <= daysInMonth(month.val()-1, year.val()); i += 1) {
            var one = $("<li>"+i+"</li>");
            if (i%7 == 1) one.addClass("one");
            if (i == parseInt(day.val())) one.addClass("checked");
            (function () {
                var val = i;
                one.appendTo(all);
                one.click(function () {
                    day.val(val);
                    setVal();
                    picker.hide();
                });
            })();
        }
        $("<div>出生日：</div>").addClass("head").appendTo(picker);
        all.appendTo(picker);
        $(picker).show();
        setPos();
    });
});

})();
