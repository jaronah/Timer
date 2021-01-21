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
 * 
 * !!! CAUTION !!!
 * ---------------
 * timer.js depends on: 'js/prototypes.js', 'js/functions.js'
 * 
 */

'use strict';

const timer = {

    /**
     * Currently set alarm audio
     * 
     * @type {HTMLAudioElement}
     */                 
    currentAlarm: '',

    /**
     * Alarm preview audio (used in the modal EDIT TIMER)
     * 
     * @type {HTMLAudioElement}
     */
    testAlarm: '',

    alarms: {

        iron: new Audio('./dist/audio/alarm_iron.mp3'),
        air: new Audio('./dist/audio/alarm_air.mp3')

    },

    /**
     * Alarm audios user imported into a browser in the modal EDIT TIMER
     * 
     * @type {Object}
     */
    customAlarms: (isJsonObject(localStorage.getItem('customAlarms'))) ? JSON.parse(localStorage.getItem('customAlarms')) : {},


    repeatAlarmInterval: false,    

    // rendered time limitations:
    secondsMax: 59,
    minutesMax: 59,
    hoursMax: 99,

    /**
     * Sets HTML DOM properties and alarm audios.
     * ------------------------------------------
     */
    set: function () {

        /**
         * Variables for main page:
         * ------------------------
         */
        this.htmlTimerTime = document.getElementById('timerTime');
        this.htmlTimerSeconds = document.getElementById('timerSeconds');
        this.htmlTimerMinutes = document.getElementById('timerMinutes');
        this.htmlTimerHours = document.getElementById('timerHours');
        
        this.btnEdit = document.getElementById('btnEdit');
        this.btnStartOrPause = document.getElementById('btnStartOrPause');
        this.btnReset = document.getElementById('btnReset');

        /**
         * Variables for modals: Edit Timer, Message:
         * ------------------------------------------
         */
        this.modalEditTimer = document.getElementById('modalEditTimer');
        this.modalClosableAreaOfEditTimer = document.getElementById('closableAreaOfEditTimer');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalClosableAreaOfMessage = document.getElementById('closableAreaOfModalMessage');
        
        this.btnCloseModal = document.getElementById('btnCancelModalEditTimer');
        this.btnStornoModal = document.getElementById('btnStornoModalEditTimer');
        this.btnSaveModal = document.getElementById('btnSaveModalEditTimer');
        this.btnSubmitMessage = document.getElementById('btnSubmitMessage');
       
        this.btnSecondsIncrement = document.getElementById('seconds-increment');
        this.btnSecondsDecrement = document.getElementById('seconds-decrement');
        this.btnMinutesIncrement = document.getElementById('minutes-increment');
        this.btnMinutesDecrement = document.getElementById('minutes-decrement');
        this.btnHoursIncrement = document.getElementById('hours-increment');
        this.btnHoursDecrement = document.getElementById('hours-decrement');

        this.modalSeconds = document.getElementById('modalSeconds');
        this.modalMinutes = document.getElementById('modalMinutes');
        this.modalHours = document.getElementById('modalHours');

        this.modalSelectAlarm = document.getElementById('modalSelectAlarm');
        this.btnPlayOrPauseAlarm = document.getElementById('btnPlayOrPauseAlarm');
        this.btnBrowseAlarm = document.getElementById('btnBrowseAlarm');
        
        this.iconPlayAlarm = document.getElementById('iconPlayAlarm');
        this.iconPauseAlarm = document.getElementById('iconPauseAlarm');
        
        this.checkboxRepeatAlarm = document.getElementById('checkboxRepeatAlarm');

        // alarm audios:
        this.currentAlarm = this.alarms[this.modalSelectAlarm.selectedOptions[0].value];
        this.testAlarm = this.alarms[this.modalSelectAlarm.selectedOptions[0].value];

    },

    setUserSettings: function () {

        this.renderCustomAlarms();
        this.setCurrentAlarm();
        this.setRepeatAlarm();
    
    },

    setTimeout: function () {
    
        localStorage.setItem('timerSeconds', Number(this.modalSeconds.value));
        localStorage.setItem('timerMinutes', Number(this.modalMinutes.value));
        localStorage.setItem('timerHours', Number(this.modalHours.value));
    
    },

    /**
     * Selects an option of currently set alarm (stored in Local Storage)
     * for HTML Select element containing alarm options.
     */
    setCurrentAlarm: function () {
    
        const currentAlarmName = localStorage.getItem('currentAlarmName');
    
        if (this.alarms.hasOwnProperty(currentAlarmName)) {
    
            for (let i = 0; i < this.modalSelectAlarm.length; i++) {
    
                if (this.modalSelectAlarm[i].value === currentAlarmName) {
    
                    this.modalSelectAlarm.selectedIndex = i;
                    break;
    
                }
    
            }
    
        }
    
    },
    
    /**
     * Sets the checked property of HTML Checkbox repeat alarm by value stored in Local Storage.
     */
    setRepeatAlarm: function () {
    
        this.checkboxRepeatAlarm.checked = JSON.parse(localStorage.getItem('repeatAlarm'));
    
    },

    /**
     * Returns set timeout in seconds
     * ------------------------------
     */
    getTimeout: function () {
        
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

    },


    /**
     * Returns current time of timer in seconds
     * ----------------------------------------
     */
    getCurrentTime: function () {
        
        let seconds = 0;
        let minutes = 0;
        let hours = 0;
        let timeInSeconds = 0;
    
        seconds = Number(this.htmlTimerSeconds.innerText);
        minutes = Number(this.htmlTimerMinutes.innerText);
        hours = Number(this.htmlTimerHours.innerText);
    
        timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);
    
        return timeInSeconds;
    
    },
    
    getStatusOfTimeout: function () {
    
        let timeoutStatus = {isSet: false}; // Default: Timer Timeout is not set
    
        if (localStorage.getItem('timerSeconds') != null 
            && localStorage.getItem('timerMinutes') != null
            && localStorage.getItem('timerHours') != null)
        {
    
            timeoutStatus.isSet = true; // Timer Timeout is set
    
        }
    
        return timeoutStatus;
    
    },

    /**
     * Resets currently set values in the modal EDIT TIMER. Sets stored values from Local Storage.
     */
    resetModalEditTimer: function () {
    
        this.renderTimeoutForModal();
        this.setCurrentAlarm();
        this.setRepeatAlarm();
    
    },

    /**
     * Renders timeout values [hh:mm:ss] into HTML for both modal and timer
     * -------------------------------------------------------------------
     */
    renderTimeout: function () {
    
        let status;
    
        status = this.renderTimeoutForTimer();
        this.renderTimeoutForModal();
        
        if (this.getCurrentTime() === 0) {
            
            this.htmlTimerTime.classList.add('disabled');

        } else {

            this.htmlTimerTime.classList.remove('disabled');

        }
    
        return status;
    
    },


    /**
     * Renders timeout values [hh:mm:ss] into HTML only for timer
     * ---------------------------------------------------------
     */
    renderTimeoutForTimer: function () {

        let status = {isSet: false}; // Default: Timer Timeout is not set
    
        if (localStorage.getItem('timerSeconds') != null 
            && localStorage.getItem('timerMinutes') != null
            && localStorage.getItem('timerHours') != null)
        {
    
            this.htmlTimerSeconds.innerText = getLeadingZerosNumber(localStorage.getItem('timerSeconds'));
            this.htmlTimerMinutes.innerText = getLeadingZerosNumber(localStorage.getItem('timerMinutes'));
            this.htmlTimerHours.innerText = getLeadingZerosNumber(localStorage.getItem('timerHours'));
    
            status.isSet = true; // Timer Timeout is set
    
        }
    
        return status;
    
    },
    
    /**
     * Renders timeout values [hh:mm:ss] into HTML only for modal
     * ---------------------------------------------------------
     */
    renderTimeoutForModal: () => {
        
        let status = {isSet: false}; // Default: Timer Timeout is not set
    
        if (localStorage.getItem('timerSeconds') != null 
            && localStorage.getItem('timerMinutes') != null
            && localStorage.getItem('timerHours') != null)
        {
            
            this.modalSeconds.value = getLeadingZerosNumber(localStorage.getItem('timerSeconds'));
            this.modalMinutes.value = getLeadingZerosNumber(localStorage.getItem('timerMinutes'));
            this.modalHours.value = getLeadingZerosNumber(localStorage.getItem('timerHours'));
    
            status.isSet = true; // Timer Timeout is set
    
        }
    
        return status;
    
    },

    /**
     * Renders custom alarm name(s) as new option element(s)
     * for HTML Select element containing options of alarms (in the modal EDIT TIMER).
     */
    renderCustomAlarms: function () {
    
        if (Object.keys(this.customAlarms).length > 0) {
    
            for (let key in this.customAlarms) {
                    
                if (!this.modalSelectAlarm.contains(key)) {
    
                    const option = document.createElement('option');
    
                    option.innerText = key;
                    this.modalSelectAlarm.appendChild(option);
    
                    // adds custom alarm(s) imported by user into object 'alarms'
                    this.alarms[key] = new Audio(this.customAlarms[key]);
    
                }
    
            }
    
        }
    
    },


    /**
     * Countdown of Timer's set time
     * ------------------------------
     * 
     * @param {Event} ev
     */
    countdown: function (ev) {
        
        let seconds = Number(this.htmlTimerSeconds.innerText);
        let minutes = Number(this.htmlTimerMinutes.innerText);
        let hours = Number(this.htmlTimerHours.innerText);
        // total time in seconds:
        let currentTime = seconds + (minutes * 60) + (hours * 60 * 60);
    
        let interval = setInterval(() => {
    
            if (!this.btnStartOrPause.classList.contains('isPaused') && currentTime > 0) {
    
                currentTime--;
    
                // seconds to render:
                this.htmlTimerSeconds.innerText = getLeadingZerosNumber(currentTime % 60);
                // minutes to render:
                this.htmlTimerMinutes.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 % 60));
                // hours to render:
                this.htmlTimerHours.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 / 60));
    
            } 
            
            if (currentTime === 0) {
    
                this.currentAlarm = this.alarms[this.modalSelectAlarm.selectedOptions[0].value];
    
                /* Plays once an alarm.
                   Also intended for interval playing an alarm repeatedly,
                   becouse interval plays first audio after elapsed interval duration */
                this.currentAlarm.play();
    
                // plays an alarm repeatedly in intervals
                if (checkboxRepeatAlarm.checked) {
    
                    this.repeatAlarmInterval = setInterval(() => {
    
                        this.currentAlarm.play();
                        
                    }, (this.currentAlarm.duration * 1000) + 800);
    
                }
    
                this.btnStartOrPause.classList.add('isPaused');
                this.btnStartOrPause.innerText = "START";
                this.btnStartOrPause.disabled = true;
                this.btnReset.disabled = false;
                this.btnEdit.disabled = false;
                this.htmlTimerTime.classList.add('disabled');
                openOrCloseModal(this.modalMessage);
            
            }
    
    
            if (this.btnStartOrPause.classList.contains('isPaused')) {
                
                ev.preventDefault();
                clearInterval(interval);
            
            }
    
        }, 1000);
    
    },

    /**
     * Enables or disables control buttons (edit, start/pause, reset) depending on time
     */
    enableOrDisableControlButtons: function () {
        
        let statusOfTimerTimeout = this.getStatusOfTimeout();
        let currentTime = this.getCurrentTime();
        let timerTimeout = this.getTimeout();
    
        if (currentTime === 0) {
    
            this.btnStartOrPause.classList.add('isPaused');
            this.btnStartOrPause.innerText = "START";
            this.btnStartOrPause.disabled = true;
            this.btnEdit.disabled = false;
            this.btnReset.disabled = (statusOfTimerTimeout.isSet) ? false : true;
    
        } else if ( (currentTime > 0) && (currentTime < timerTimeout) ) {
    
            this.btnStartOrPause.disabled = false;
            this.btnEdit.disabled = false;
            this.btnReset.disabled = false;
    
        } else if (currentTime === timerTimeout) {
            
            this.btnStartOrPause.disabled = false;
            this.btnEdit.disabled = false;
            this.btnReset.disabled = true;
            
        }
    
    },

    handleMessageModal: function () {

        openOrCloseModal(this.modalMessage);
        
        if (this.repeatAlarmInterval) {
            clearInterval(this.repeatAlarmInterval);
        }

        pauseAudio(this.currentAlarm);
        
    }

};


timer.set();

/**
 * 
 * EVENT HANDLERS:
 * ------------------------------------
 */

/**
 * FRONT PAGE BUTTONS:
 * -------------------
 */
timer.btnEdit.onclick = () => {
    
    openOrCloseModal(timer.modalEditTimer);

    if (timer.testAlarm) {

        timer.testAlarm.load();

    }

}

/**
 * Hanles click event on btnStartOrPause
 * --------------------------------------
 * 
 * Exception: enables or disables control buttons other way than enableOrDisableControlButtons() 
 * Switches text of button: 'START' or 'PAUSE'
 * 
 * @param {Event} ev 
 */
timer.btnStartOrPause.onclick = (ev) => {
    
        if (timer.btnStartOrPause.classList.contains('isPaused')) {

        timer.btnStartOrPause.innerText = 'PAUSE';
        timer.btnEdit.disabled = true;
        timer.btnReset.disabled = true;

    } else {

        timer.btnStartOrPause.innerText = 'START';
        timer.btnEdit.disabled = false;
        if (timer.getCurrentTime() != timer.getTimeout()) {
            timer.btnReset.disabled = false;
        }

    }

    timer.btnStartOrPause.classList.toggle('isPaused');


    timer.countdown(ev);

}

timer.btnReset.onclick = (ev) => {
    
    timer.renderTimeout();

    timer.btnStartOrPause.disabled = false;
    if (timer.getCurrentTime() === timer.getTimeout()) {
        
        timer.btnReset.disabled = true;

    }

}


/* EDIT TIMER: */

/**
 * Close modal without setting a time
 */
timer.btnCloseModal.onclick = () => {

    openOrCloseModal(timer.modalEditTimer);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

/**
 * Close modal without setting a time
 */
timer.btnStornoModal.onclick = () => {
    
    openOrCloseModal(timer.modalEditTimer);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

/**
 * Close modal and set a time
 */
timer.btnSaveModal.onclick = () => {

    let seconds = Number(timer.modalSeconds.value);
    let minutes = Number(timer.modalMinutes.value);
    let hours = Number(timer.modalHours.value);
    let timeInSeconds = 0;

    timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    if (timeInSeconds > 0) {

        timer.setTimeout();
        timer.renderTimeout();

        localStorage.setItem('currentAlarmName', timer.modalSelectAlarm.selectedOptions[0].value);
        localStorage.setItem('repeatAlarm', timer.checkboxRepeatAlarm.checked);
        
        openOrCloseModal(timer.modalEditTimer);

    } else {

        timer.renderTimeoutForModal();
        alert("Timeout could not be set. Only time more than 0.");
        
    }

    pauseAudio(timer.testAlarm);

    timer.enableOrDisableControlButtons();

}

timer.modalClosableAreaOfEditTimer.onclick = () => {

    openOrCloseModal(timer.modalEditTimer);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

timer.modalClosableAreaOfMessage.onclick = () => {

    timer.handleMessageModal();

}

timer.btnSubmitMessage.onclick = () => {

    timer.handleMessageModal();

}

timer.btnSecondsIncrement.onclick = () => {
    
    if (timer.modalSeconds.value < timer.secondsMax) {
        timer.modalSeconds.value++;
        leadingZeros(timer.modalSeconds);
    }

};

timer.btnSecondsDecrement.onclick = () => {
    if (timer.modalSeconds.value > 0) {
        timer.modalSeconds.value--;
        leadingZeros(timer.modalSeconds);
    }
}

timer.btnMinutesIncrement.onclick = () => {
    if (timer.modalMinutes.value < timer.minutesMax) {
        timer.modalMinutes.value++;
        leadingZeros(timer.modalMinutes);
    }
};

timer.btnMinutesDecrement.onclick = () => {
    if (timer.modalMinutes.value > 0) {
        timer.modalMinutes.value--;
        leadingZeros(timer.modalMinutes);
    }
}

timer.btnHoursIncrement.onclick = () => {
    if (timer.modalHours.value < hoursMax) {
        timer.modalHours.value++;
        leadingZeros(timer.modalHours);
    }
};

timer.btnHoursDecrement.onclick = () => {
    if (timer.modalHours.value > 0) {
        timer.modalHours.value--;
        leadingZeros(timer.modalHours);
    }
}

timer.modalSeconds.oninput = () => {

    if (timer.modalSeconds.value > timer.secondsMax) {
        timer.modalSeconds.value = timer.secondsMax;
    }

}

timer.modalMinutes.oninput = () => {

    if (timer.modalMinutes.value > timer.minutesMax) {
        timer.modalMinutes.value = timer.minutesMax;
    }
    
}

timer.modalHours.oninput = () => {

    if (timer.modalHours.value > timer.hoursMax) {
        timer.modalHours.value = timer.hoursMax;
    }
    
}

timer.modalSelectAlarm.onchange = () => {
    
    /**
     * Loads selected test alarm to play from time 0.
     * testAlarm gets updated when triggered btnPlayOrPauseAlarm.onclick. */
    timer.alarms[timer.modalSelectAlarm.selectedOptions[0].value].load();

    if (!timer.testAlarm.paused) {
        
        timer.testAlarm.pause();

    }

}

timer.btnPlayOrPauseAlarm.onclick = () => {

    timer.testAlarm = timer.alarms[timer.modalSelectAlarm.selectedOptions[0].value];


    if (timer.btnPlayOrPauseAlarm.getAttribute('status') === 'isPlaying') {

        timer.testAlarm.pause();

    } else {

        timer.testAlarm.play();

    }

    timer.testAlarm.onpause = () => {
        
        switchIconPauseToPlay(timer.btnPlayOrPauseAlarm, timer.iconPlayAlarm, timer.iconPauseAlarm);
    
    }

    timer.testAlarm.onplay = () => {
    
        switchIconPlayToPause(timer.btnPlayOrPauseAlarm, timer.iconPlayAlarm, timer.iconPauseAlarm);

    }

}

timer.btnBrowseAlarm.onchange = () => {
    
    const fReader = new FileReader();
    const file = timer.btnBrowseAlarm.files[0];

    if (file)
        fReader.readAsDataURL(file);

    fReader.onloadend = (event) => {

        timer.customAlarms[clearFileSuffix(file.name)] = event.target.result;
        localStorage.setItem('customAlarms', JSON.stringify(timer.customAlarms));

        timer.renderCustomAlarms();
        
    }

}