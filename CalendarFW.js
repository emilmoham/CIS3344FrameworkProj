function my$(id) {
    return document.getElementById(id)
}

function calendarFW (){
    var calendar = {}

    var day_count = 31;
    var offset = 0;

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
        weekday_header.className += " weekdays";
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
                    td.className="day";
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
            spanning_col.className = "spacer";
            spanning_col.id = "spacer_week_"+i;
            spacer.appendChild(spanning_col);

            calendar.appendChild(spacer);
        }
    }

    var clickDay = function (){
        //Unset any elements we will be needing
        unsetActiveDay();
        clearSpacers();

        //Set this day to active
        this.id="activeDay";

        //Find spacer
        var day_no = Number(this.innerText);
        var member_of_week = Math.floor((day_no+offset-1)/7)

        //Modify Spacer
        var list = createToDoList(day_no);
        my$(("spacer_week_"+member_of_week)).appendChild(list);

        //TODO Style?
    }

    function unsetActiveDay() {
        //Clears current element with id="activeDay"
        activeDay = document.getElementById("activeDay");
        if (activeDay != null)
            activeDay.removeAttribute("id");
    }

    function clearSpacers(){
        //Clear all spacer elements of eontent
        spacers = document.getElementsByClassName("spacer");
        for (var i = 0; i < spacers.length; i++){
            spacers[i].innerHTML ="";
        }
    }

    function createToDoList(day){
        var header_div = document.createElement("div");
        header_div.className ="header";
        header_div.id ="myDIV";

        //Title
        var title = document.createElement("h2");
        title.innerText = day;
        header_div.appendChild(title);

        //Input Field
        var input = document.createElement("input");
        input.type="text";
        input.id="myInput";
        input.placeholder="New Item...";
        header_div.appendChild(input);

        //List
        var list = document.createElement("ul");
        list.id = "itemList";
        header_div.appendChild(list);

        return header_div;
    }

    function addStyle(){


    }

    return calendar;

}
