/**
 * TIMER
 * --------------------------------------------------------------
 * 
 * Setting of the Timer are accessible in a modal EDIT TIMER
 * which opens after clicking a button "EDIT" on the main page of Timer.
 * Values set by user are stored in Local Storage of user's browser.
 * 
 * by "render" in code I mean "render HTML" or "render into HTML" 
 * 
 */

'use strict';

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
const btnPlayOrPauseAlarm = document.getElementById('btnPlayOrPauseAlarm');
const btnBrowseAlarm = document.getElementById('btnBrowseAlarm');

const iconPlayAlarm = document.getElementById('iconPlayAlarm');
const iconPauseAlarm = document.getElementById('iconPauseAlarm');

const checkboxRepeatAlarm = document.getElementById('checkboxRepeatAlarm');

const alarms = { 'iron': new Audio('./dist/audio/alarm_iron.mp3'),
                 'air': new Audio('./dist/audio/alarm_air.mp3') };

/**
 * Alarm audios user imported into a browser in the modal EDIT TIMER
 * 
 * @type {Object}
 */
const customAlarms = (isJsonObject(localStorage.getItem('customAlarms'))) ? JSON.parse(localStorage.getItem('customAlarms')) : {};

/**
 * Alarm preview audio (used in the modal EDIT TIMER)
 * 
 * @type {HTMLAudioElement}
 */                 
let testAlarm = alarms[modalSelectAlarm.selectedOptions[0].value];

/**
 * Currently set alarm audio
 * 
 * @type {HTMLAudioElement}
 */                 
let currentAlarm = alarms[modalSelectAlarm.selectedOptions[0].value];

let repeatAlarmInterval = false;

/* FUNCTIONS */

// setters:
const setTimerTimeout = () => {

    localStorage.setItem('timerSeconds', Number(modalSeconds.value));
    localStorage.setItem('timerMinutes', Number(modalMinutes.value));
    localStorage.setItem('timerHours', Number(modalHours.value));

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

    if (localStorage.getItem('timerSeconds') != null 
        && localStorage.getItem('timerMinutes') != null
        && localStorage.getItem('timerHours') != null)
    {

        seconds = Number(localStorage.getItem('timerSeconds'));
        minutes = Number(localStorage.getItem('timerMinutes'));
        hours = Number(localStorage.getItem('timerHours'));

        timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    }

    return timeInSeconds;
}

const getStatusOfTimerTimeout = () => {

    let timeoutStatus = {isSet: false}; // Default: Timer Timeout is not set

    if (localStorage.getItem('timerSeconds') != null 
        && localStorage.getItem('timerMinutes') != null
        && localStorage.getItem('timerHours') != null)
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

            currentAlarm = alarms[modalSelectAlarm.selectedOptions[0].value];

            /* Plays once an alarm.
               Also intended for interval playing an alarm repeatedly,
               becouse interval plays first audio after elapsed interval duration */
            currentAlarm.play();

            // plays an alarm repeatedly in intervals
            if (checkboxRepeatAlarm.checked) {

                repeatAlarmInterval = setInterval(() => {

                    currentAlarm.play();
                    
                }, (currentAlarm.duration * 1000) + 800);

            }

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
 * Renders timeout values [hh:mm:ss] into HTML for both modal and timer
 * -------------------------------------------------------------------
 */
const renderTimeout = () => {

    let status;

    status = renderTimeoutForTimer();
    renderTimeoutForModal();

    if (getTimerCurrentTime() === 0) {
        htmlTimerTime.classList.add('disabled');
    } else {
        htmlTimerTime.classList.remove('disabled');
    }

    return status;

}

/**
 * Renders timeout values [hh:mm:ss] into HTML only for timer
 * ---------------------------------------------------------
 */
const renderTimeoutForTimer = () => {
    
    let status = {isSet: false}; // Default: Timer Timeout is not set

    if (localStorage.getItem('timerSeconds') != null 
        && localStorage.getItem('timerMinutes') != null
        && localStorage.getItem('timerHours') != null)
    {

        htmlTimerSeconds.innerText = getLeadingZerosNumber(localStorage.getItem('timerSeconds'));
        htmlTimerMinutes.innerText = getLeadingZerosNumber(localStorage.getItem('timerMinutes'));
        htmlTimerHours.innerText = getLeadingZerosNumber(localStorage.getItem('timerHours'));

        status.isSet = true; // Timer Timeout is set

    }

    return status;

}

/**
 * Renders timeout values [hh:mm:ss] into HTML only for modal
 * ---------------------------------------------------------
 */
const renderTimeoutForModal = () => {
    
    let status = {isSet: false}; // Default: Timer Timeout is not set

    if (localStorage.getItem('timerSeconds') != null 
        && localStorage.getItem('timerMinutes') != null
        && localStorage.getItem('timerHours') != null)
    {
        
        modalSeconds.value = getLeadingZerosNumber(localStorage.getItem('timerSeconds'));
        modalMinutes.value = getLeadingZerosNumber(localStorage.getItem('timerMinutes'));
        modalHours.value = getLeadingZerosNumber(localStorage.getItem('timerHours'));

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
    
    if (repeatAlarmInterval) {
        clearInterval(repeatAlarmInterval);
    }

    pauseAudio(currentAlarm);

}

/**
 * Renders custom alarm name(s) as new option element(s)
 * for HTML Select element containing options of alarms (in the modal EDIT TIMER).
 */
const renderCustomAlarms = () => {

    if (Object.keys(customAlarms).length > 0) {

        for (let key in customAlarms) {
                
            if (!modalSelectAlarm.contains(key)) {

                const option = document.createElement('option');

                option.innerText = key;
                modalSelectAlarm.appendChild(option);

                // adds custom alarm(s) imported by user into object 'alarms'
                alarms[key] = new Audio(customAlarms[key]);

            }

        }

    }

}

const setUserSettingsOfTimer = () => {

    renderCustomAlarms();
    setCurrentAlarm();
    setRepeatAlarm();

}

/**
 * Resets currently set values in the modal EDIT TIMER. Sets stored values from Local Storage.
 */
const resetModalEditTimer = () => {

    renderTimeoutForModal();
    setCurrentAlarm();
    setRepeatAlarm();

}

/**
 * Selects an option of currently set alarm (stored in Local Storage)
 * for HTML Select element containing alarm options.
 */
const setCurrentAlarm = () => {

    const currentAlarmName = localStorage.getItem('currentAlarmName');

    if (alarms.hasOwnProperty(currentAlarmName)) {

        for (let i = 0; i < modalSelectAlarm.length; i++) {

            if (modalSelectAlarm[i].value === currentAlarmName) {

                modalSelectAlarm.selectedIndex = i;
                break;

            }

        }

    }

}

/**
 * Sets the checked property of HTML Checkbox repeat alarm by value stored in Local Storage.
 */
const setRepeatAlarm = () => {

    checkboxRepeatAlarm.checked = JSON.parse(localStorage.getItem('repeatAlarm'));

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

    if (testAlarm) {

        testAlarm.load();

    }

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
    
    renderTimeout();

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
    pauseAudio(testAlarm);
    resetModalEditTimer();

}

/**
 * Close modal without setting a time
 */
btnStornoModal.onclick = () => {
    
    openOrCloseModal(modalEditTimer);
    pauseAudio(testAlarm);
    resetModalEditTimer();

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
        renderTimeout();

        localStorage.setItem('currentAlarmName', modalSelectAlarm.selectedOptions[0].value);
        localStorage.setItem('repeatAlarm', checkboxRepeatAlarm.checked);
        
        openOrCloseModal(modalEditTimer);

    } else {

        renderTimeoutForModal();
        alert("Timeout could not be set. Only time more than 0.");
        
    }

    pauseAudio(testAlarm);

    enableOrDisableTimerButtons();

}

modalClosableAreaOfEditTimer.onclick = () => {

    openOrCloseModal(modalEditTimer);
    pauseAudio(testAlarm);
    resetModalEditTimer();

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

modalSelectAlarm.onchange = () => {
 
    /**
     * Loads selected test alarm to play from time 0.
     * testAlarm gets updated when triggered btnPlayOrPauseAlarm.onclick. */
    alarms[modalSelectAlarm.selectedOptions[0].value].load();

    if (!testAlarm.paused) {
        
        testAlarm.pause();

    }

}

btnPlayOrPauseAlarm.onclick = () => {

    testAlarm = alarms[modalSelectAlarm.selectedOptions[0].value];


    if (btnPlayOrPauseAlarm.getAttribute('status') === 'isPlaying') {

        testAlarm.pause();

    } else {

        testAlarm.play();

    }

    testAlarm.onpause = () => {
        
        switchIconPauseToPlay(btnPlayOrPauseAlarm, iconPlayAlarm, iconPauseAlarm);
    
    }

    testAlarm.onplay = () => {
    
        switchIconPlayToPause(btnPlayOrPauseAlarm, iconPlayAlarm, iconPauseAlarm);

    }

}

btnBrowseAlarm.onchange = () => {
    
    const fReader = new FileReader();
    const file = btnBrowseAlarm.files[0];

    if (file)
        fReader.readAsDataURL(file);

    fReader.onloadend = (event) => {

        customAlarms[clearFileSuffix(file.name)] = event.target.result;
        localStorage.setItem('customAlarms', JSON.stringify(customAlarms));

        renderCustomAlarms();
        
    }

}