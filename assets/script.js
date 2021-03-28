/**
 * Returns style of the background color
 * @param {*} time Time slot that is being drawn
 * @param {*} currentTime Current time
 * @returns classname: present, future or past
 */
const getBackgroundColour = (time, currentTime) => {
    const nextHour = time.clone().add(1, 'h');

    if(time.valueOf() <= currentTime.valueOf() && currentTime.valueOf() < nextHour.valueOf()) {
        return "present";
    } else if(currentTime.valueOf() < time.valueOf()) {
        return "future";
    } else {
        return "past";
    }
}

/**
 * Checks if time has passed
 * @param {*} time the time slot
 * @param {*} currentTime  the current time
 * @returns true if time slot being drawn has passed
 */
const isPast = (time, currentTime) => {
    return time.clone().add(1, 'h').valueOf() < currentTime.valueOf();
}

/**
 * When add button is clicked, add the input value into the local store
 * @param event the triggered event
 */
var addScheduledItem = (event) => {
    const btnID = event.target.id;
    const timeID = btnID.substr(4, btnID.length);

    const inputValue = document.getElementById(timeID).value;
    window.localStorage.setItem(timeID, inputValue);
    alert(inputValue + " added to the schedule");
}

/**
 * Returns the value that was previously saved
 * @param time the time slot
 * @returns the value that have previous been saved
 */
var getScheduledItem = (time) => {
    const scheduledItem = window.localStorage.getItem(time.valueOf());
    return (scheduledItem === 'undefined' || scheduledItem == null) ? "" : scheduledItem
}

/**
 * Draws the time work day schedule.
 */
var drawScheduleTable = () => {
    const currentTime = moment();
    
    const startTime = moment().hour(9).minutes(0).seconds(0).milliseconds(0);
    const endTime = moment().hour(17).minutes(0).seconds(0).milliseconds(0);;
    for(; startTime <= endTime; startTime.add(1, 'hours')) {
        //Add Row
        var row = document.createElement("div");
        row.classList.add("row", "align-items-center");

        //Add time label
        var timeLabel = document.createElement("div");
        timeLabel.classList.add("col-3", "col-sm-2", "col-lg-2", "text-right");
        timeLabel.innerHTML = startTime.format("h:mm a");
        row.append(timeLabel);

        //Add div for text area
        var textAreaDiv = document.createElement("div");
        textAreaDiv.classList.add("col-6", "col-sm-8", "col-lg-9");
        row.append(textAreaDiv);

        //Add text area within div
        var textArea = document.createElement("textarea");
        textArea.setAttribute("id", startTime.format("x"));
        textArea.classList.add("form-control", getBackgroundColour(startTime, currentTime));
        textArea.value = getScheduledItem(startTime);
        if(isPast(startTime, currentTime)) {
            textArea.disabled = true;
        }
        textAreaDiv.append(textArea);

        //Add button div
        var buttonAddDiv = document.createElement("div");
        buttonAddDiv.classList.add("col-3", "col-sm-2", "col-lg-1", "text-left");
        row.append(buttonAddDiv);

        //Add button within div only if present or in future
        if(!isPast(startTime, currentTime)) {
            var buttonAdd = document.createElement("button");
            buttonAdd.setAttribute("type", "button");
            buttonAdd.setAttribute("id", "btn-" + startTime.format("x"));
            buttonAdd.classList.add("btn", "btn-primary");
            buttonAdd.innerHTML = "ADD"
            buttonAddDiv.append(buttonAdd);
            buttonAdd.addEventListener("click", addScheduledItem);
        }
        
        //Add row to the container
        $(".container").append(row);
    }

}

//Sets current time within jumbotron
var currentDateTime = () => {
    return moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
};

$("#currentDay").text(currentDateTime());
drawScheduleTable();