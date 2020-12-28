'use strict';

/* total time in seconds */
let time = 0;

const secondsMax = 59;
const minutesMax = 59;
const hoursMax = 99;

/**
 * Variables for main page:
 * ------------------------
 */
const htmlTimerTime = document.getElementById('timerTime');
const htmlTimerSeconds = document.getElementById('timerSeconds');
const htmlTimerMinutes = document.getElementById('timerMinutes');
const htmlTimerHours = document.getElementById('timerHours');

const btnEdit = document.getElementById('btnEdit');
const btnStartOrPause = document.getElementById('btnStartOrPause');
const btnReset = document.getElementById('btnReset');

/**
 * Variables for modal: Edit Timer:
 * --------------------------------
 */
const modalEditTimer = document.getElementById('modalEditTimer');
const modalClosableAreaOfEditTimer = document.getElementById('closableAreaOfEditTimer');
const modalMessage = document.getElementById('modalMessage');
const modalClosableAreaOfMessage = document.getElementById('closableAreaOfModalMessage');

const btnCloseModal = document.getElementById('btnCancelModalEditTimer');
const btnStornoModal = document.getElementById('btnStornoModalEditTimer');
const btnSaveModal = document.getElementById('btnSaveModalEditTimer');
const btnSubmitMessage = document.getElementById('btnSubmitMessage');

const btnSecondsIncrement = document.getElementById('seconds-increment');
const btnSecondsDecrement = document.getElementById('seconds-decrement');
const btnMinutesIncrement = document.getElementById('minutes-increment');
const btnMinutesDecrement = document.getElementById('minutes-decrement');
const btnHoursIncrement = document.getElementById('hours-increment');
const btnHoursDecrement = document.getElementById('hours-decrement');

/**
 * @type {HTMLInputElement}
 */
const modalSeconds = document.getElementById('modalSeconds');

/**
 * @type {HTMLInputElement}
 */
const modalMinutes = document.getElementById('modalMinutes');

/**
 * @type {HTMLInputElement}
 */
const modalHours = document.getElementById('modalHours');

/**
 * @type {HTMLSelectElement}
 */
const modalSelectAlarm = document.getElementById('modalSelectAlarm');
const btnPlayAlarm = document.getElementById('btnPlayAlarm');
const btnBrowseAlarm = document.getElementById('btnBrowseAlarm');

const alarms = { 'iron': new Audio('./dist/audio/alarm_iron.mp3') };

/* FUNCTIONS */

// setters:
const setTimerTimeout = () => {

    sessionStorage.setItem("timerSeconds", Number(modalSeconds.value));
    sessionStorage.setItem("timerMinutes", Number(modalMinutes.value));
    sessionStorage.setItem("timerHours", Number(modalHours.value));

}



// getters:
/**
 * Returns set timeout in seconds
 * ------------------------------
 */
const getTimerTimeout = () => {
    
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let timeInSeconds = 0;

    if (sessionStorage.getItem('timerSeconds') != null 
        && sessionStorage.getItem('timerMinutes') != null
        && sessionStorage.getItem('timerHours') != null)
    {

        seconds = Number(sessionStorage.getItem('timerSeconds'));
        minutes = Number(sessionStorage.getItem('timerMinutes'));
        hours = Number(sessionStorage.getItem('timerHours'));

        timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    }

    return timeInSeconds;
}

const getStatusOfTimerTimeout = () => {

    let timeoutStatus = {isSet: false}; // Default: Timer Timeout is not set

    if (sessionStorage.getItem('timerSeconds') != null 
        && sessionStorage.getItem('timerMinutes') != null
        && sessionStorage.getItem('timerHours') != null)
    {

        timeoutStatus.isSet = true; // Timer Timeout is set

    }

    return timeoutStatus;

}

/**
 * Returns current time of timer in seconds
 * ----------------------------------------
 */
const getTimerCurrentTime = () => {
    
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let timeInSeconds = 0;

    seconds = Number(htmlTimerSeconds.innerText);
    minutes = Number(htmlTimerMinutes.innerText);
    hours = Number(htmlTimerHours.innerText);

    timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    return timeInSeconds;

}



/**
 * Countdown of Timer's set time
 * ------------------------------
 * 
 * @param {Event} ev
 */
const timerCountdown = (ev) => {
    
    let seconds = Number(htmlTimerSeconds.innerText);
    let minutes = Number(htmlTimerMinutes.innerText);
    let hours = Number(htmlTimerHours.innerText);
    // total time in seconds:
    let currentTime = seconds + (minutes * 60) + (hours * 60 * 60);

    let interval = setInterval(() => {

        if (!btnStartOrPause.classList.contains('isPaused') && currentTime > 0) {

            currentTime--;

            // seconds to render:
            htmlTimerSeconds.innerText = getLeadingZerosNumber(currentTime % 60);
            // minutes to render:
            htmlTimerMinutes.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 % 60));
            // hours to render:
            htmlTimerHours.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 / 60));

        } 
        
        if (currentTime === 0) {

            alarms[modalSelectAlarm.selectedOptions[0].value].play();
            btnStartOrPause.classList.add('isPaused');
            btnStartOrPause.innerText = "START";
            btnStartOrPause.disabled = true;
            btnReset.disabled = false;
            btnEdit.disabled = false;
            htmlTimerTime.classList.add('disabled');
            openOrCloseModal(modalMessage);
        
        }


        if (btnStartOrPause.classList.contains('isPaused')) {
            
            ev.preventDefault();
            clearInterval(interval);
        
        }

    }, 1000);

}

/**
 * Insert timeout values [hh:mm:ss] into html for both modal and timer
 * -------------------------------------------------------------------
 */
const insertTimeoutIntoHtml = () => {

    let status;

    status = insertTimeoutIntoHtmlForTimer();
    insertTimeoutIntoHtmlForModal();

    if (getTimerCurrentTime() === 0) {
        htmlTimerTime.classList.add('disabled');
    } else {
        htmlTimerTime.classList.remove('disabled');
    }

    return status;

}

/**
 * Insert timeout values [hh:mm:ss] into html only for timer
 * ---------------------------------------------------------
 */
const insertTimeoutIntoHtmlForTimer = () => {
    
    let status = {isSet: false}; // Default: Timer Timeout is not set

    if (sessionStorage.getItem('timerSeconds') != null 
        && sessionStorage.getItem('timerMinutes') != null
        && sessionStorage.getItem('timerHours') != null)
    {

        htmlTimerSeconds.innerText = getLeadingZerosNumber(sessionStorage.getItem('timerSeconds'));
        htmlTimerMinutes.innerText = getLeadingZerosNumber(sessionStorage.getItem('timerMinutes'));
        htmlTimerHours.innerText = getLeadingZerosNumber(sessionStorage.getItem('timerHours'));

        status.isSet = true; // Timer Timeout is set

    }

    return status;

}

/**
 * Insert timeout values [hh:mm:ss] into html only for modal
 * ---------------------------------------------------------
 */
const insertTimeoutIntoHtmlForModal = () => {
    
    let status = {isSet: false}; // Default: Timer Timeout is not set

    if (sessionStorage.getItem('timerSeconds') != null 
        && sessionStorage.getItem('timerMinutes') != null
        && sessionStorage.getItem('timerHours') != null)
    {
        
        modalSeconds.value = getLeadingZerosNumber(sessionStorage.getItem('timerSeconds'));
        modalMinutes.value = getLeadingZerosNumber(sessionStorage.getItem('timerMinutes'));
        modalHours.value = getLeadingZerosNumber(sessionStorage.getItem('timerHours'));

        status.isSet = true; // Timer Timeout is set

    }

    return status;

}


/**
 * Enables or disables buttons (edit, start/pause, reset) depending on time
 */
const enableOrDisableTimerButtons = () => {
    
    let statusOfTimerTimeout = getStatusOfTimerTimeout();
    let currentTime = getTimerCurrentTime();
    let timerTimeout = getTimerTimeout();

    if (currentTime === 0) {

        btnStartOrPause.classList.add('isPaused');
        btnStartOrPause.innerText = "START";
        btnStartOrPause.disabled = true;
        btnEdit.disabled = false;
        (statusOfTimerTimeout.isSet) ? btnReset.disabled = false : btnReset.disabled = true;

    } else if ( (currentTime > 0) && (currentTime < timerTimeout) ) {

        btnStartOrPause.disabled = false;
        btnEdit.disabled = false;
        btnReset.disabled = false;

    } else if (currentTime === timerTimeout) {
        
        btnStartOrPause.disabled = false;
        btnEdit.disabled = false;
        btnReset.disabled = true;
        
    }

    // || !statusOfTimerTimeout.isSet
}

const handleMessageModal = () => {
    
    openOrCloseModal(modalMessage);

}

//--------------------------------------------------------------------------------------------------------------------
/**
 * 
 * EVENT HANDLERS:
 * ------------------------------------
 */

/**
 * FRONT PAGE BUTTONS:
 * -------------------
 */
btnEdit.onclick = () => {
    openOrCloseModal(modalEditTimer);
}

/**
 * Hanles click event on btnStartOrPause
 * --------------------------------------
 * 
 * Exception: enables or disables buttons other way than enableOrDisableTimerButtons() 
 * Control text of button: 'START' or 'PAUSE'
 * 
 * @param {Event} ev 
 */
btnStartOrPause.onclick = (ev) => {
    
     if (btnStartOrPause.classList.contains('isPaused')) {

        btnStartOrPause.innerText = 'PAUSE';
        btnEdit.disabled = true;
        btnReset.disabled = true;

    } else {

        btnStartOrPause.innerText = 'START';
        btnEdit.disabled = false;
        if (getTimerCurrentTime() != getTimerTimeout()) {
            btnReset.disabled = false;
        }

    }

    btnStartOrPause.classList.toggle('isPaused');


    timerCountdown(ev);

}

btnReset.onclick = (ev) => {
    
    insertTimeoutIntoHtml();

    btnStartOrPause.disabled = false;
    if (getTimerCurrentTime() === getTimerTimeout()) {
        
        btnReset.disabled = true;

    }

}


/* EDIT TIMER: */

/**
 * Close modal without setting a time
 */
btnCloseModal.onclick = () => {

    openOrCloseModal(modalEditTimer);
    insertTimeoutIntoHtmlForModal();

}

/**
 * Close modal without setting a time
 */
btnStornoModal.onclick = () => {
    
    openOrCloseModal(modalEditTimer);
    insertTimeoutIntoHtmlForModal();

}

/**
 * Close modal and set a time
 */
btnSaveModal.onclick = () => {

    let seconds = Number(modalSeconds.value);
    let minutes = Number(modalMinutes.value);
    let hours = Number(modalHours.value);
    let timeInSeconds = 0;

    timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    if (timeInSeconds > 0) {

        setTimerTimeout();
        insertTimeoutIntoHtml();
        openOrCloseModal(modalEditTimer);

    } else {

        // inserts previously set timeout if exists into modal
        insertTimeoutIntoHtmlForModal();
        alert("Timeout could not be set. Only time more than 0.");
        
    }
    
    // if (getTimerCurrentTime() > 0) {

    //     btnStartOrPause.disabled = false;

    // }
        
    // btnReset.disabled = true;

    enableOrDisableTimerButtons();

}

modalClosableAreaOfEditTimer.onclick = () => {

    openOrCloseModal(modalEditTimer);
    insertTimeoutIntoHtmlForModal();

}

modalClosableAreaOfMessage.onclick = () => {

    handleMessageModal();

}

btnSubmitMessage.onclick = () => {

    handleMessageModal();

}

btnSecondsIncrement.onclick = () => {
    if (modalSeconds.value < secondsMax) {
        modalSeconds.value++;
        leadingZeros(modalSeconds);
    }
};

btnSecondsDecrement.onclick = () => {
    if (modalSeconds.value > 0) {
        modalSeconds.value--;
        leadingZeros(modalSeconds);
    }
}

btnMinutesIncrement.onclick = () => {
    if (modalMinutes.value < minutesMax) {
        modalMinutes.value++;
        leadingZeros(modalMinutes);
    }
};

btnMinutesDecrement.onclick = () => {
    if (modalMinutes.value > 0) {
        modalMinutes.value--;
        leadingZeros(modalMinutes);
    }
}

btnHoursIncrement.onclick = () => {
    if (modalHours.value < hoursMax) {
        modalHours.value++;
        leadingZeros(modalHours);
    }
};

btnHoursDecrement.onclick = () => {
    if (modalHours.value > 0) {
        modalHours.value--;
        leadingZeros(modalHours);
    }
}

modalSeconds.oninput = () => {

    if (modalSeconds.value > secondsMax) {
        modalSeconds.value = secondsMax;
    }

}

modalMinutes.oninput = () => {

    if (modalMinutes.value > minutesMax) {
        modalMinutes.value = minutesMax;
    }
    
}

modalHours.oninput = () => {

    if (modalHours.value > hoursMax) {
        modalHours.value = hoursMax;
    }
    
}

btnPlayAlarm.onclick = () => {

    alarms[modalSelectAlarm.selectedOptions[0].value].play();

}

btnBrowseAlarm.onchange = () => {
    
    var fReader = new FileReader();
    fReader.readAsDataURL(btnBrowseAlarm.files[0]);
    fReader.onloadend = (event) => {
        alarms[clearFileSuffix(btnBrowseAlarm.files[0].name)] = new Audio(event.target.result);
    }

    // alarms['custom1'] = btnBrowseAlarm.value;
    console.log(alarms);
}

const updateAlarmList = () => {

    for (let i = 0; i < Object.keys(alarms).length; i++) {

        let option = document.createElement('option');
        // option.value = 


    }

}

// loads alarms into modal 'Edit timer'
// modalSelectAlarm.