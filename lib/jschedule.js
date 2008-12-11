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

var jschedule = jschedule || function (target, params) {

var s = this;

var arrayToJSON = function (arr) {
    var str = '[';
    for ( var i = 0; i < arr.length; i += 1) {
        str += arr[i].toJSON();
        str += (arr.length-i == 1)?'':', ';
    }
    return str + ']';
};

var arrayInsert = function (arr, input, index) {
    return arr.slice(0, index-1).concat([input], arr.slice(index, arr.length));
};

var padding = function (digit) {
    digit += "";
    return digit.length == 1 ? "0"+digit :  digit;
};

var formatTime = function (input) {
    var hour = parseInt( input/(60*60) );
    var minute = parseInt( (input%(60*60))/60 );
    return padding(hour)+":"+padding(minute);
};

var escape = function (input) {
    input = input.replace(/</g, "&lt;");
    input = input.replace(/>/g, "&gt;");
    input = input.replace(/&/g, "&amp;");
    input = input.replace(/"/g, "&quot;");
    return input;
};

var nl2br = function (input) {
    return input.replace(/\n/g, "<br>");
}

var br2nl = function (input) {
    return input.replace(/<br>/g, "\n");
}

var button = document.createElement('span');
button.appendChild( document.createTextNode('edit') );
button.className = "edit";

var expand = document.createElement('span');
expand.appendChild( document.createTextNode('expand') );
expand.className = "expand";

var contract = document.createElement('span');
contract.appendChild( document.createTextNode('contract') );
contract.className = "contract";

var timeForm = document.createElement('form');
var timeFormInputS = document.createElement('input');
var timeFormInputE = document.createElement('input');
var timeFormSub = document.createElement('div');
var timeFormSubmit = document.createElement('input');
var timeFormCancel = document.createElement('a');
timeForm.id = 'jformino-timeForm';
timeFormSub.className = 'sub';
timeFormSubmit.type = 'submit';
timeFormSubmit.value = 'UPDATE';
timeFormCancel.appendChild( document.createTextNode('cancel') );
timeFormCancel.href = 'javascript://';
timeFormCancel.onclick = function () {
    if (timeForm.err) {
        timeForm.removeChild(timeForm.err);
        timeForm.err = undefined;
    }
    timeForm.hide();
    return false;
};
timeForm.appendChild(timeFormInputS);
timeForm.appendChild( document.createTextNode(' ~ ') );
timeForm.appendChild(timeFormInputE);
timeFormSub.appendChild(timeFormSubmit);
timeFormSub.appendChild( document.createTextNode(' or ') );
timeFormSub.appendChild( timeFormCancel );
timeForm.appendChild( timeFormSub );
$(timeFormInputS).formino({act_as: 'time-picker'}, function (api) {
    timeFormInputS.val = api.getTime();
});
$(timeFormInputE).formino({act_as: 'time-picker'}, function (api) {
    timeFormInputE.val = api.getTime();
});
timeForm.show = function () {
    timeForm.style.display = 'block';
};
timeForm.hide = function () {
    timeForm.style.display = 'none';
};

var inlineForm = document.createElement('form');
var inlineFormInput = document.createElement('input');
var inlineFormSub = document.createElement('div');
var inlineFormSubmit = document.createElement('input');
var inlineFormCancel = document.createElement('a');
inlineForm.id = 'jformino-inlineForm';
inlineFormSub.className = 'sub';
inlineFormSubmit.type = 'submit';
inlineFormSubmit.value = 'UPDATE';
inlineFormCancel.appendChild( document.createTextNode('cancel') );
inlineFormCancel.href = 'javascript://';
inlineFormCancel.onclick = function () {
    inlineForm.hide();
    return false;
};
inlineForm.appendChild(inlineFormInput);
inlineFormSub.appendChild(inlineFormSubmit);
inlineFormSub.appendChild( document.createTextNode(' or ') );
inlineFormSub.appendChild( inlineFormCancel );
inlineForm.appendChild( inlineFormSub );
inlineForm.show = function () {
    inlineForm.style.display = 'block';
    inlineFormInput.focus();
};
inlineForm.hide = function () {
    inlineForm.style.display = 'none';
};

var blockForm = document.createElement('form');
var blockFormSub = document.createElement('div');
var blockFormInput = document.createElement('textarea');
var blockFormSubmit = document.createElement('input');
var blockFormCancel = document.createElement('a');
blockForm.id = 'jformino-blockForm';
blockFormSub.className = 'sub';
blockFormSubmit.type = 'submit';
blockFormSubmit.value = 'UPDATE';
blockFormCancel.appendChild( document.createTextNode('cancel') );
blockFormCancel.href = 'javascript://';
blockFormCancel.onclick = function () {
    blockForm.hide();
    return false;
};
blockForm.appendChild(blockFormInput);
blockFormSub.appendChild(blockFormSubmit);
blockFormSub.appendChild( document.createTextNode(' or ') );
blockFormSub.appendChild( blockFormCancel );
blockForm.appendChild( blockFormSub );
blockForm.show = function () {
    blockForm.style.display = 'block';
    blockFormInput.focus();
};
blockForm.hide = function () {
    blockForm.style.display = 'none';
};

var htmlField = document.createElement('textarea');
htmlField.name = target.name + "_html";

var init = function (cb) {
    var notracks;
    var notimes;
    var nodays;
    var step3 = function () {
        var form = document.createElement('form');
        form.id = "jformino-init";
        form.appendChild(document.createTextNode("# of talks per track : "));
        var input = document.createElement('input');
        form.appendChild(input);
        var submit = document.createElement('input');
        submit.type = "submit";
        submit.value = "NEXT";
        form.appendChild(submit);
        form.onsubmit = function () {
            notimes = input.value;
            if (isNaN(parseInt(notimes))) {
            	//error();
            } else {
                form.parentNode.removeChild(form);
                cb(nodays, notracks, notimes);
            }
            return false;
        };
        target.parentNode.insertBefore(form, target);
        input.focus();
    };
    var step2 = function () {
        var form = document.createElement('form');
        form.id = "jformino-init";
        form.appendChild(document.createTextNode("# of tracks per day : "));
        var input = document.createElement('input');
        form.appendChild(input);
        var submit = document.createElement('input');
        submit.type = "submit";
        submit.value = "NEXT";
        form.appendChild(submit);
        form.onsubmit = function () {
            notracks = input.value;
            if (isNaN(parseInt(notracks))) {
            	//error();
            } else {
                form.parentNode.removeChild(form);
                step3();
            }
            return false;
        };
        target.parentNode.insertBefore(form, target);
        input.focus();
    };
    var step1 = function () {
        var form = document.createElement('form');
        form.id = "jformino-init";
        form.appendChild(document.createTextNode("# of days : "));
        var input = document.createElement('input');
        form.appendChild(input);
        var submit = document.createElement('input');
        submit.type = "submit";
        submit.value = "NEXT";
        form.appendChild(submit);
        form.onsubmit = function () {
            nodays = input.value;
            if (isNaN(parseInt(nodays))) {
            	//error();
            } else {
                form.parentNode.removeChild(form);
                step2();
            }
            return false;
        };
        target.parentNode.insertBefore(form, target);
        input.focus();
    };
    step1();
};

var day = function (params, s) {
    var that;
    var title;
    var tracks = [];
    var times = [];
    var atitle = function (input) {
        if (input) title = input;
        return title;
    };
    var addTime = function (input) {
        times[timesLength()] = new time(input, that, tracks);
    };
    var addTrack = function (input) {
        tracks[tracksLength()] = new track(input, that, times);
    };
    var getTime = function (index) {
        return times[index];
    };
    var getTrack = function (index) {
        return tracks[index];
    };
    var insertTime = function (index, input) {
        input.d(that);
        times.splice(index, 0, input);
    };
    var insertTrack = function (index, input) {
        input.d(that);
        tracks.splice(index, 0, input);
        for ( var i = 0; i < timesLength(); i += 1) {
            times[i].insertTalk(index, input.getTalk(i));
        }
        
    };
    var removeTrack = function (index) {
        tracks.splice(index, 1);
        for ( var i = 0; i < times.length; i += 1) {
            times[i].removeTalk(index);
        }
    };
    var removeTime = function (index) {
        times.splice(index, 1);
        for ( var i = 0; i < tracks.length; i += 1) {
            tracks[i].removeTalk(index);
        }
    };
    var shiftTime = function (index) {
        if (index > 0) {
            var start = times[index].start();
            for ( var i = index-1; i >= 0; i -= 1 ) {
                var itemEnd = times[i].end();
                if (itemEnd > start) {
                    times[i].end(start);
                    var itemStart = times[i].start();
                    if (itemStart > start) {
                        times[i].start(start);
                    }
                    else break;
                }
                else break;
            }
        }
        if (index < timesLength() - 1) {
            var end = times[index].end();
            var itemStart = times[index+1].start();
            if (itemStart < end) {
            	var shift = end - itemStart;
            	for ( var i = index+1; i < timesLength(); i += 1 ) {
            		times[i].start( times[i].start()*1 + shift );
            		times[i].end( times[i].end()*1 + shift );
                }
            }
        }
    };
    var tracksLength = function () {
        return tracks.length;
    };
    var timesLength = function () {
        return times.length;
    };
    var toJSON = function () {
    	return  '{' +
                '"title": "'+title+'", ' +
    	        '"tracks": ' + arrayToJSON(tracks) + ', ' +
    	        '"times": ' + arrayToJSON(times) + '' +
    	        '}';
    };
    var attachEvent = function (elem, index) {
        var caption = elem.getElementsByTagName('div')[0]; //caption div
        var b = button.cloneNode(true);
        b.className = 'edit day';
        b.atitle = atitle;
        caption.appendChild(b);
        if (s.daysLength() > 1) {
            var removeDayButton = document.createElement('a');
            removeDayButton.appendChild( document.createTextNode('remove Day') );
            removeDayButton.className = "removeDay";
            removeDayButton.onclick = function () {
                if (!confirm('This will delete some data, and can\'t be restore. Are you sure?')) return;
                s.removeDay(index);
                s.update();
            };
            caption.appendChild( removeDayButton );
        }
        //add track
        var editCell = document.createElement('td');
        var addTrackButton = document.createElement('a');
        var div = document.createElement('div');
        editCell.className = 'editCell';
        addTrackButton.appendChild( document.createTextNode('add track') );
        addTrackButton.className = "addTrack";
        addTrackButton.onclick = function () {
            addTrack({"title": "TRACK " + (tracks.length+1)}, tracksLength());
            for ( var i = 0; i < times.length; i += 1) {
                times[i].addTalk({"content": ""});   
            }
            s.update();
        };
        div.appendChild( addTrackButton );
        editCell.appendChild( div );
        elem.getElementsByTagName('tr')[0].appendChild( editCell );
        //add time
        var foot = document.createElement('tfoot');
        var footerRow = document.createElement('tr');
        var editCell = document.createElement('td');
        var addTimeButton = document.createElement('a');
        var div = document.createElement('div');
        editCell.className = "editCell";
        addTimeButton.onclick = function () {
            var start = times[timesLength()-1].end();
            var end = parseInt(start) + (60*60);
            addTime({"start": start, "end": end, "talks": genTalks(tracksLength())}, timesLength());
            s.update();
        };
        addTimeButton.appendChild( document.createTextNode('add time') );
        addTimeButton.className = "addTime";
        div.appendChild( addTimeButton );
        editCell.appendChild( div );
        footerRow.appendChild( editCell );
        for ( var i = 0; i < tracksLength(); i += 1) {
            footerRow.appendChild( document.createElement('td') );
        }
        foot.appendChild( footerRow );
        elem.insertBefore( foot, elem.getElementsByTagName('tbody')[0] );
    };
    var toHTML = function (edit, index) {
    	var dayTable = document.createElement('table');
    	var caption = document.createElement('caption');
        var dayTitle = document.createElement('div');
    	dayTitle.appendChild(document.createTextNode(title));
    	caption.appendChild(dayTitle);
    	var head = document.createElement('thead');
    	var headRow = document.createElement('tr');
    	headRow.appendChild(document.createElement('td'));
    	for (var i = 0; i < tracks.length; i++ ) {
    	    headRow.appendChild(tracks[i].toHTML(edit, i));
    	}
    	head.appendChild(headRow);
    	var body = document.createElement('tbody');
    	for (var i = 0; i < times.length; i++ ) {
    	    body.appendChild(times[i].toHTML(edit, i));
    	}
    	dayTable.appendChild(caption);
    	dayTable.appendChild(head);
    	dayTable.appendChild(body);

        if (edit) attachEvent(dayTable, index);
    	return dayTable;
    };

    var that =  {
        "title": atitle,
        "addTrack": addTrack,
        "removeTrack": removeTrack,
        "getTrack": getTrack,
        "insertTrack": insertTrack,
        "removeTime": removeTime,
        "shiftTime": shiftTime,
        "getTime": getTime,
        "insertTime": insertTime,
        "toHTML": toHTML,
        "toJSON": toJSON,
        "tracksLength": tracksLength,
        "timesLength": timesLength
    };

    //constructor
    atitle(params.title);
    for (var i = 0; i < params.tracks.length; i++) {
        addTrack(params.tracks[i]);
    }
    for (var i = 0; i < params.times.length; i++) {
        addTime(params.times[i]);
    }

    return that;

};

var time = function (params, d, tracks) {
    var that;
    var start = 0;
    var end = 0;
    var global = false;
    var talks = [];
    var astart = function (input) {
        if (input) start = input > 86400 ? 86400 : input;
        return start;
    };
    var aend = function (input) {
        if (input) end = input > 86400 ? 86400 : input;
        return end;
    };
    var ad = function (input) {
        if (input) d = input;
        return d;
    }
    var switchGlobal = function (input) {
        if (input) global = input;
        else global = !global;
    };
    var addTalk = function (input) {
        talks[talks.length] = new talk(input, that);
    };
    var removeTalk = function (index) {
        talks.splice(index, 1);
    };
    var getTalk = function (index) {
        return talks[index];
    };
    var setTalk = function (index, input) {
        input.t(that);
        talks.splice(index, 1, input);
    };
    var insertTalk = function (index, input) {
        input.t(that);
        talks.splice(index, 0, input);
    };
    var toJSON = function () {
        return  '{' +
                '"start": "'+start+'", ' +
                '"end": "'+end+'", ' + 
                '"global": '+global+', ' +
                '"talks": ' + arrayToJSON(talks) + '' +
                '}';
    };
    var attachEvent = function (elem, row, index) {
        elem.d = d;
        elem.index = index;
        var b = button.cloneNode(true);
        b.className = "edit time";
        b.astart = astart;
        b.aend = aend;
        elem.appendChild(b);
        if (d.timesLength() > 1) {
            var removeTimeButton = document.createElement('a');
            removeTimeButton.appendChild( document.createTextNode('remove Time') );
            removeTimeButton.className = "removeTime";
            removeTimeButton.onclick = function () {
                if (!confirm('This will delete some data, and can\'t be restore. Are you sure?')) return;
                d.removeTime(index);
                s.update();
            };
            elem.appendChild( removeTimeButton );
        }
        if (d.tracksLength() > 1) {
            var firstCell = row.firstChild.nextSibling;
            if (global) {
                var b = contract.cloneNode(true);
                firstCell.firstChild.appendChild(b);
                $(b).click(function () {
                    switchGlobal(false);
                    update();
                });
            } else {
                var b = expand.cloneNode(true);
                firstCell.firstChild.appendChild(b);
                $(b).click(function () {
                    switchGlobal(true);
                    update();
                });
            }
        }
    };
    var toHTML = function (edit, index) {
    	var row = document.createElement("tr");
    	var time = document.createElement("div");
        time.appendChild(document.createTextNode(formatTime(astart())+" ~ "+formatTime(aend())));
    	var timeCell = document.createElement("th");
    	timeCell.appendChild(time);
    	row.appendChild(timeCell);
        if (global === true) {
            row.appendChild(talks[0].toHTML(edit, 0, d.tracksLength()));
        } else {
            for (var i = 0; i < talks.length; i++) {
                row.appendChild(talks[i].toHTML(edit, i));
            }
        }
        if (edit) attachEvent(time, row, index);
    	return row;
    };

    var that = {
        "addTalk": addTalk,
        "removeTalk": removeTalk,
        "insertTalk": insertTalk,
        "start": astart,
        "end": aend,
        "d": ad,
        "toHTML": toHTML,
        "toJSON": toJSON,
        "getTalk": getTalk,
        "setTalk": setTalk
    };

    //constructor
    astart(params.start);
    aend(params.end);
    if (params.global) switchGlobal(params.global);
    //d.addTalk(talks[i]);
    for (var i = 0; i < params.talks.length; i++) {
        addTalk(params.talks[i], i, that);
        tracks[i].appendTalk(getTalk(i));
    }
    
    return that;

};

var track = function (params, d, times) {
    var that = this;
    var title;
    var talks = [];
    var atitle = function (input) {
        if (input !== undefined) title = input;
        return title;
    };
    var ad = function (input) {
        if (input) d = input;
        return d;
    }
    var appendTalk = function (input) {
        talks[talks.length] = input;
    };
    var getTalk = function (index) {
        return talks[index];
    };
    var removeTalk = function (index) {
        talks.splice(index, 1);
    };
    var toJSON = function () {
    	return "{\"title\": \""+title+"\"}";
    };
    var attachEvent = function (elem, index) {
        elem.d = d;
        elem.index = index;
        var b = button.cloneNode(true);
        b.className = "edit track";
        b.atitle = atitle;
        elem.appendChild(b);
        if (d.tracksLength() > 1) {
            var removeTrackButton = document.createElement('a');
            removeTrackButton.appendChild( document.createTextNode('remove track') );
            removeTrackButton.className = "removeTrack";
            removeTrackButton.onclick = function () {
                if (!confirm('This will delete some data, and can\'t be restore. Are you sure?')) return;
                d.removeTrack(index);
                s.update();
            };
            elem.appendChild( removeTrackButton );
        }
    };
    var toHTML = function (edit, index) {
    	var cell = document.createElement("th");
    	var track = document.createElement("div");
        track.appendChild( document.createTextNode(title) );
    	cell.appendChild( track );
        if (edit) attachEvent( track, index );
        return cell;
    };

    //constructor
    atitle(params.title);

    return {
        "title": atitle,
        "d": ad,
        "appendTalk": appendTalk,
        "getTalk": getTalk,
        "removeTalk": removeTalk,
        "toHTML": toHTML,
        "toJSON": toJSON
    };

};
var talk = function (params, t) {
    var content;
    var acontent = function (input) {
        if (input !== undefined) content = input;
    	return content;
    };
    var at = function (input) {
        if (input !== undefined) t = input;
    	return t;
    };
    var toJSON = function () {
        return "{\"content\": \""+nl2br(acontent())+"\"}";
    };
    var attachEvent = function (elem, index) {
        elem.t = t;
        elem.index = index;
        var b = button.cloneNode(true);
        b.acontent = acontent;
        b.className = "edit talk"
        elem.appendChild(b);
    };
    var toHTML = function (edit, index, colspan) {
        var cell = document.createElement('td');
        var block = document.createElement('div');
        var content = nl2br(acontent());
        block.innerHTML = (content == "") ? "&nbsp;" : content;
        //block.appendChild(document.createTextNode(acontent()));
        cell.appendChild(block);
        if (colspan) cell.setAttribute("colSpan", colspan);
        if (edit) attachEvent(block, index);
        return cell;
    };

    //constructor
    acontent(br2nl(params.content));

    return {
        "content": acontent,
        "t": at,
        "toHTML": toHTML,
        "toJSON": toJSON
    };
};
s.addDay = function (input) {
    days[days.length] = new day(input, s);
};
s.removeDay = function (index) {
    days.splice(index, 1);
};
s.daysLength = function () {
    return days.length;
};
s.toJSON = function () {
    return '{"days": '+ arrayToJSON(days) +'}';
};
s.attachEvent = function (elem) {
    $(elem).click(function (e) {
        if (e.target.className == 'edit talk') {
            $(blockForm).css($(e.target.parentNode).offset());
            blockForm.show();
            blockFormInput.value = e.target.acontent();
            blockForm.onsubmit = function () {
                e.target.acontent(blockFormInput.value);
                e.target.parentNode.removeChild( e.target.parentNode.firstChild );
                e.target.parentNode.insertBefore( document.createTextNode(e.target.acontent()), e.target.parentNode.firstChild );
                blockForm.hide();
                return false;
            };
        } else if (e.target.className == 'edit track'
                || e.target.className == 'edit day') {
            $(inlineForm).css($(e.target.parentNode).offset());
            inlineForm.show();
            inlineFormInput.value = e.target.atitle();
            inlineForm.onsubmit = function () {
                e.target.atitle(inlineFormInput.value);
                e.target.parentNode.removeChild( e.target.parentNode.firstChild );
                e.target.parentNode.insertBefore( document.createTextNode(e.target.atitle()), e.target.parentNode.firstChild );
                inlineForm.hide();
                return false;
            };
        } else if (e.target.className == 'edit time') {
            $(timeForm).css($(e.target.parentNode).offset());
            timeForm.show();
            timeFormInputS.value = formatTime(e.target.astart());
            timeFormInputE.value = formatTime(e.target.aend());
            timeFormInputS.val = e.target.astart();
            timeFormInputE.val = e.target.aend();
            timeForm.onsubmit = function () {
                if (timeFormInputE.val > timeFormInputS.val) {
                    e.target.astart(timeFormInputS.val);
                    e.target.aend(timeFormInputE.val);
                    if (timeForm.err) {
                        timeForm.removeChild(timeForm.err);
                        timeForm.err = undefined;
                    }
                    timeForm.hide();
                    e.target.parentNode.d.shiftTime( e.target.parentNode.index );
                    s.update();
                } else if (!timeForm.err) {
                    err = document.createe.targetent('div');
                    err.appendChild( document.createTextNode('End time should after start time.') );
                    err.className = "error";
                    timeForm.insertBefore(err, timeFormSub);
                    timeForm.err = err;
                }
                return false;
            };
        }
    });
    if ($.ui !== undefined && $.ui.draggable !== undefined && $.ui.droppable !== undefined) {
        $("thead th div", elem).draggable({
            "zIndex": 300,
            "revert": true,
            "scroll": true,
            "opacity": 0.6,
            "start": function () {
                $(this).addClass('selected trackSelected');
            },
            "stop": function () {
                $(this).removeClass('selected trackSelected');
            }
        }).droppable({
            "accept": ".trackSelected",
            "hoverClass": "hover",
            "tolerance": "pointer",
            "over": function (e, ui) {
                $(this.parentNode).addClass('insert');
            },
            "out": function (e, ui) {
                $(this.parentNode).removeClass('insert');
            },
            "drop": function (e, ui) {
                var drag = ui.draggable[0].d.getTrack(ui.draggable[0].index);
                if (this.index > ui.draggable[0].index) {
                    this.d.insertTrack(this.index, drag);
                    ui.draggable[0].d.removeTrack(ui.draggable[0].index);
                } else {
                    ui.draggable[0].d.removeTrack(ui.draggable[0].index);
                    this.d.insertTrack(this.index, drag);
                }
                s.update();
            }
        });
        $("tbody th div", elem).draggable({
            "zIndex": 300,
            "revert": true,
            "scroll": true,
            "opacity": 0.6,
            "start": function () {
                $(this).addClass('selected timeSelected');
            },
            "stop": function () {
                $(this).removeClass('selected timeSelected');
            }
        }).droppable({
            "accept": ".timeSelected",
            "tolerance": "pointer",
            "over": function () {
                $(this.parentNode).addClass('insert');
             },
            "out": function () {
                $(this.parentNode).removeClass('insert');
             },
            "drop": function (e, ui) {
                var drop = this;
                var drag = ui.draggable[0].d.getTime(ui.draggable[0].index);
                if (drop.index == 0) {
                    drag.start(drop.d.getTime(drop.index).start());
                    drag.end(drop.d.getTime(drop.index).start());
                } else {
                    drag.start(drop.d.getTime(drop.index-1).end());
                    drag.end(drop.d.getTime(drop.index).start());
                }
                if (drop.index > ui.draggable[0].index) {
                    drop.d.insertTime(drop.index, drag);
                    ui.draggable[0].d.removeTime(ui.draggable[0].index);
                } else {
                    ui.draggable[0].d.removeTime(ui.draggable[0].index);
                    drop.d.insertTime(drop.index, drag);
                }
                s.update();
            }
        });
        $("tbody td div", elem).draggable({
            "zIndex": 300,
            "revert": true,
            "scroll": true,
            "opacity": 0.6,
            "start": function () {
                $(this).addClass('selected talkSelected');
            },
            "stop": function () {
                $(this).removeClass('selected talkSelected');
            }
        }).droppable({
            "accept": ".talkSelected",
            "hoverClass": "hover",
            "tolerance": "pointer",
            "drop": function (e, ui) {
                var temp = this.t.getTalk(this.index);
                this.t.setTalk(this.index, ui.draggable[0].t.getTalk(ui.draggable[0].index));
                ui.draggable[0].t.setTalk(ui.draggable[0].index, temp)
                s.update();
            }
        });
    }
};
s.toHTML = function (edit) {
    s.division = document.createElement('div');
    division.id = 'jformino-schedule';
    for (var i = 0; i < days.length; i++ ) {
    	division.appendChild(days[i].toHTML(edit, i));
    }
    if (edit) {
        division.className = "editable";
        var addDayButton = document.createElement('a');
        addDayButton.appendChild( document.createTextNode('Add One Day') );
        addDayButton.href = "#";
        addDayButton.className = "addDay";
        addDayButton.onclick = function () {
            var notracks = days[daysLength()-1].tracksLength();
            var notimes = days[daysLength()-1].timesLength();
            addDay({"title": "DAY " + (daysLength()+1), "tracks": genTracks(notracks, notimes), "times": genTimes(notracks, notimes)}, daysLength());
            var html = days[days.length-1].toHTML(edit);
            s.division.insertBefore(html, addDayButton);
            s.attachEvent(html);
            //s.update();
        };
        division.appendChild( addDayButton );
    }
    if (edit) s.attachEvent(division);
    return division;
};
var days = [];
var genDays = function(nodays, notracks, notimes) {
    var data = [];
    for (var i = 0; i < nodays; i++) {
        data[i] = {"title": "DAY "+(i+1), "tracks": genTracks(notracks, notimes), "times": genTimes(notracks, notimes)};
    }
    return data;
};
var genTracks = function(notracks, notimes) {
    var data = [];
    for (var i = 0; i < notracks; i++) {
        data[i] = {"title": "TRACK "+(i+1)};
    }
    return data;
};
var genTimes = function(notracks, notimes) {
    var data = [];
    for (var i = 0; i < notimes; i++) {
        data[i] = {"start": (i+9)*3600, "end": (i+10)*3600, "talks": genTalks(notracks)};
    }
    return data;
};
var genTalks = function(notracks) {
    var data = [];
    for (var i = 0; i < notracks; i++) {
        data[i] = {"content": ""};
    }
    return data;
};
var initGenerate = function (nodays, notracks, notimes) {
    genData({"days": genDays(nodays, notracks, notimes)});
    target.value = s.toJSON();
};
var genData = function (data) {
    for (var i = 0; i < data.days.length; i++) {
        addDay(data.days[i], i);
    }
    genUI();
};
var genUI = function () {
    target.parentNode.insertBefore(htmlField, target);
    target.parentNode.insertBefore(inlineForm, target);
    target.parentNode.insertBefore(blockForm, target);
    target.parentNode.insertBefore(timeForm, target);
    target.style.display = 'none';
    htmlField.style.display = 'none';
    //s.table = s.toHTML(true);
    //target.parentNode.insertBefore(s.table, target);
    s.update();
};
s.update = function () {
    try {
        target.innerHTML = s.toJSON();
        htmlField.innerHTML = escape(s.toHTML(false).innerHTML);
    } catch (e) {
        target.value = s.toJSON();
        htmlField.value = escape(s.toHTML(false).innerHTML);
    }
    if (s.table) target.parentNode.removeChild(s.table);
    s.table = s.toHTML(true);
    target.parentNode.insertBefore(s.table, target);
};

if (target.value == '') {
    init(initGenerate);
} else {
    genData(JSON.parse(target.value));
}

//target.style.display = 'none';

return {
    "toJSON": toJSON
};

};
