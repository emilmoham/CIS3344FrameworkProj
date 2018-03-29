function calendarFW (){
    var calendar = {}

    //Calculation info
    var day_count = 31;
    var offset = 0;

    //Styling info (Class Names / Element IDs)
    // Base Calendar
    var tableHeaderClass = " day_names"
    var tableDayClass = "day";
    var activeDayID = "activeDay";
    var spacerClass = "spacer";
    var spacerBaseID = "spacer_week_";
    var itemChecked = "checked";

    // To Do List
    var todoListULID = "itemList";
    var toDoListHeaderID = "todoListHeader";


    calendar.makeCalendar = function(container){
        //params:
        //container --> target element to insert Calendar

        //TODO input validation
        var output_container = my$(container);

        //Create Table Head (Columns)
        var calendar = createTable();

        //Populate days (Rows)
        addDays(calendar);

        //Append Calendar Table to page
        output_container.appendChild(calendar);

        var days = document.getElementsByClassName("day");
        for(var i = 0; i < days.length; i++){
            days[i].onclick = clickDay;
        }
    }

    function createTable(){
        //TODO variable name length ("Sun" vs "Sunday" vs "S");
        var day_names = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
        var calendar_table = document.createElement("table");

        //Add weekdays_header
        var weekday_header = document.createElement("tr")
        weekday_header.className = tableHeaderClass;
        for(i = 0; i < day_names.length; i++){
            var th = document.createElement("th");
            th.innerHTML= day_names[i];
            weekday_header.appendChild(th);
        }
        //Append to table
        calendar_table.appendChild(weekday_header);

        //Return table
        return calendar_table;
    }

    function addDays(calendar){
        var counter = 0;
        var weeks_needed = Math.ceil((day_count + offset)/7)

        for(i = 0; i < weeks_needed; i++){
            var week = document.createElement("tr");

            for(j = 1; j <= 7; j++){
                //Exit condition if full week is not needed
                if ((counter-offset+1) > day_count)
                break;

                //Create Individual Day Element
                var td = document.createElement("td");

                //Define innerHTML
                if( counter < offset){
                    // Pad beginning of month if necessary
                    td.innerHTML = "0" ;
                }else{
                    td.innerHTML = "" + (counter-offset+1);
                    td.className= tableDayClass;
                }

                //Append Individual day to Row
                week.appendChild(td);
                counter += 1;
            }
            //Append Row to Table
            calendar.appendChild(week);

            //Create and Append Spacer for expansion functionality.
            var spacer = document.createElement("tr");
            var spanning_col = document.createElement("td");
            spanning_col.setAttribute("colspan","7"); //TODO Fix this hardcoding
            spanning_col.className = spacerClass;
            spanning_col.id = spacerBaseID+i;
            spacer.appendChild(spanning_col);

            calendar.appendChild(spacer);
        }
    }

    var clickDay = function (){
        //Unset any elements we will be needing
        switchActiveDay();
        clearSpacers();

        //Set this day to active
        this.id=activeDayID;

        //Find spacer
        var day_no = Number(this.innerText);
        var member_of_week = Math.floor((day_no+offset-1)/7)

        //Modify Spacer
        var list = createToDoList(day_no);
        my$((spacerBaseID+member_of_week)).appendChild(list);


        if(getCookie("CFW")===""){
            return;
        }
        var listData = JSON.parse(getCookie("CFW"));
        if(listData[day_no] && listData[day_no].length > 0){
            for(var i = 0; i < listData[day_no].length; i++){
                loadElement(listData[day_no][i]);
            }
        }


        //TODO Style?
    }

    function switchActiveDay() {
        //Get active element
        var activeDay = my$(activeDayID);

        //active day is not defined --> return
        if (activeDay == null)
        return;

        //Save list on new day selected
        saveDayList();

        //Clears current element with id="activeDay"
        activeDay.removeAttribute("id");
    }

    function clearSpacers(){
        //Clear all spacer elements of eontent
        spacers = document.getElementsByClassName(spacerClass);
        for (var i = 0; i < spacers.length; i++){
            spacers[i].innerHTML ="";
        }
    }

    function createToDoList(day){
        var header_div = document.createElement("div");
        header_div.className ="header";
        header_div.id ="myDIV";

        //Title
        var title = document.createElement("h4");
        title.innerText = day;
        header_div.appendChild(title);

        //Input Field
        var input = document.createElement("input");
        input.type="text";
        input.id="myInput";
        input.placeholder="New Item...";
        header_div.appendChild(input);

        //Button
        var button = document.createElement("span");
        button.onclick = newElement;
        button.class = "addBtn";
        button.innerText = "\u002B";
        header_div.appendChild(button);

        //List
        var list = document.createElement("ul");
        list.id = todoListULID;
        header_div.appendChild(list);
        list.addEventListener('click', function(ev){
            if(ev.target.tagName==='LI'){
                ev.target.classList.toggle(itemChecked);
                //save on item checked
                // this is probably slow
                saveDayList();
            }
        }, false);

        return header_div;
    }

    function newElement() {
        var li = document.createElement("li");
        var inputValue = document.getElementById("myInput").value;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        if (inputValue === '') {
            alert("You must write something!");
        } else {
            document.getElementById("itemList").appendChild(li);
        }
        document.getElementById("myInput").value = "";

        var span = document.createElement("span");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);

        var close = document.getElementsByClassName("close");
        for (i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                var list = my$(todoListULID);
                list.removeChild(this.parentElement);
                //Save on List item deleted
                saveDayList();
            }
        }

        //Save on List item added
        saveDayList();
    }

    function loadElement(obj){
        //TODO data validation
        //Obj should be a single list item with properties:
        //  name, class
        var li = document.createElement("li");
        var t = document.createTextNode(obj["name"]);
        li.appendChild(t);
        li.className = obj["class"];
        document.getElementById("itemList").appendChild(li);

        var span = document.createElement("span");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
        

        var close = document.getElementsByClassName("close");
        for (i = 0; i < close.length; i++) {
            close[i].onclick = function() {
                var list = my$(todoListULID);
                list.removeChild(this.parentElement);
                //Save on List item deleted
                saveDayList();
            }
        }
    }

    function saveDayList(){
        //Saves a list of the strings in the todo list for the day it is called on
        var dayObj = [];
        /* Design:
         *  each list item is stored as {name:"item", state: "checked"/"" }
         * 
         *  ex of dayObj:
         *  {day_no: 0:{name, state}, 1:{name, state}...}
         */


        var activeDay = my$(activeDayID);
        var list = my$(todoListULID);
        var items = list.getElementsByTagName("li");

        for (var i = 0; i < items.length; i++){
            var itemObj = {}
            var itemText = items[i].innerText;
            
            //Strip the 'X' character from the end of list item
            itemText = itemText.substring(0,itemText.length-1);

            itemObj["name"] = itemText;
            itemObj["class"] = items[i].className;

            dayObj[i] = itemObj;
        }

        calendar[activeDay.innerText] = dayObj;
        setCookie("CFW",JSON.stringify(calendar),28);
    }

    function setCookie(cname, cvalue, day_length){
        var d = new Date();
        d.setTime(d.getTime() + (day_length*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname){
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    calendar.clear = function (){
        document.cookie = "CFW"+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    }

    function my$(id) {
        return document.getElementById(id)
    }


    return calendar;

}
