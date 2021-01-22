/**
 * TIMER
 * --------------------------------------------------------------
 * 
 * Setting of the Timer are accessible in a modal EDIT
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
     * Alarm preview audio (used in the modal EDIT)
     * 
     * @type {HTMLAudioElement}
     */
    testAlarm: '',

    alarms: {

        iron: new Audio('./dist/audio/alarm_iron.mp3'),
        air: new Audio('./dist/audio/alarm_air.mp3')

    },

    /**
     * Alarm audios user imported into a browser in the modal EDIT
     * 
     * @type {Object}
     */
    customAlarms: (isJsonObject(localStorage.getItem('customAlarms'))) ? JSON.parse(localStorage.getItem('customAlarms')) : {},


    repeatAlarm: false,

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
        
        this.htmlBtnEdit = document.getElementById('btnEdit');
        this.htmlBtnStartOrPause = document.getElementById('btnStartOrPause');
        this.htmlBtnReset = document.getElementById('btnReset');

        /**
         * Variables for modal EDIT:
         * -------------------------
         */
        this.htmlModalEdit = {},
        this.htmlModalEdit.container = document.getElementById('modalEditTimer');
        this.htmlModalEdit.closableArea = document.getElementById('closableAreaOfEditTimer');

        this.htmlModalEdit.btnCancel = document.getElementById('btnCancelModalEditTimer');
        this.htmlModalEdit.btnStorno = document.getElementById('btnStornoModalEditTimer');
        this.htmlModalEdit.btnSave = document.getElementById('btnSaveModalEditTimer');
       
        this.htmlModalEdit.btnSecondIncrement = document.getElementById('seconds-increment');
        this.htmlModalEdit.btnSecondDecrement = document.getElementById('seconds-decrement');
        this.htmlModalEdit.btnMinuteIncrement = document.getElementById('minutes-increment');
        this.htmlModalEdit.btnMinuteDecrement = document.getElementById('minutes-decrement');
        this.htmlModalEdit.btnHourIncrement = document.getElementById('hours-increment');
        this.htmlModalEdit.btnHourDecrement = document.getElementById('hours-decrement');

        this.htmlModalEdit.seconds = document.getElementById('modalSeconds');
        this.htmlModalEdit.minutes = document.getElementById('modalMinutes');
        this.htmlModalEdit.hours = document.getElementById('modalHours');

        this.htmlModalEdit.selectAlarm = document.getElementById('modalSelectAlarm');
        this.htmlModalEdit.btnPlayOrPauseAlarm = document.getElementById('btnPlayOrPauseAlarm');
        this.htmlModalEdit.btnPlayOrPauseAlarm = document.getElementById('btnBrowseAlarm');
        
        this.htmlModalEdit.iconPlayAlarm = document.getElementById('iconPlayAlarm');
        this.htmlModalEdit.iconPauseAlarm = document.getElementById('iconPauseAlarm');
        
        this.htmlModalEdit.checkboxRepeatAlarm = document.getElementById('checkboxRepeatAlarm');


        /**
         * Variables for modal MESSAGE:
         * -----------------------------
         */
        this.htmlModalMessage = {},
        this.htmlModalMessage.container = document.getElementById('modalMessage');
        this.htmlModalMessage.closableArea = document.getElementById('closableAreaOfModalMessage');
        this.htmlModalMessage.btnSubmit = document.getElementById('btnSubmitMessage');
        
        // alarm audios:
        this.currentAlarm = this.alarms[this.htmlModalEdit.selectAlarm.selectedOptions[0].value];
        this.testAlarm = this.alarms[this.htmlModalEdit.selectAlarm.selectedOptions[0].value];

    },

    setUserSettings: function () {

        this.renderCustomAlarms();
        this.setCurrentAlarm();
        this.setRepeatAlarm();
    
    },

    setTimeout: function () {
    
        localStorage.setItem('timerSeconds', Number(this.htmlModalEdit.seconds.value));
        localStorage.setItem('timerMinutes', Number(this.htmlModalEdit.minutes.value));
        localStorage.setItem('timerHours', Number(this.htmlModalEdit.hours.value));
    
    },

    /**
     * Selects an option of currently set alarm (stored in Local Storage)
     * for HTML Select element containing alarm options.
     */
    setCurrentAlarm: function () {
    
        const currentAlarmName = localStorage.getItem('currentAlarmName');
    
        if (this.alarms.hasOwnProperty(currentAlarmName)) {
    
            for (let i = 0; i < this.htmlModalEdit.selectAlarm.length; i++) {
    
                if (this.htmlModalEdit.selectAlarm[i].value === currentAlarmName) {
    
                    this.htmlModalEdit.selectAlarm.selectedIndex = i;
                    break;
    
                }
    
            }
    
        }
    
    },
    
    /**
     * Sets the checked property of HTML Checkbox repeat alarm by value stored in Local Storage.
     */
    setRepeatAlarm: function () {
    
        this.htmlModalEdit.checkboxRepeatAlarm.checked = JSON.parse(localStorage.getItem('repeatAlarm'));
    
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
     * Resets currently set values in the modal EDIT. Sets stored values from Local Storage.
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
    renderTimeoutForModal: function () {
        
        let status = {isSet: false}; // Default: Timer Timeout is not set
    
        if (localStorage.getItem('timerSeconds') != null 
            && localStorage.getItem('timerMinutes') != null
            && localStorage.getItem('timerHours') != null)
        {

            this.htmlModalEdit.seconds.value = getLeadingZerosNumber(localStorage.getItem('timerSeconds'));
            this.htmlModalEdit.minutes.value = getLeadingZerosNumber(localStorage.getItem('timerMinutes'));
            this.htmlModalEdit.hours.value = getLeadingZerosNumber(localStorage.getItem('timerHours'));
    
            status.isSet = true; // Timer Timeout is set
    
        }
    
        return status;
    
    },

    /**
     * Renders custom alarm name(s) as new option element(s)
     * for HTML Select element containing options of alarms (in the modal EDIT).
     */
    renderCustomAlarms: function () {
    
        if (Object.keys(this.customAlarms).length > 0) {
    
            for (let key in this.customAlarms) {
                    
                if (!this.htmlModalEdit.selectAlarm.contains(key)) {
    
                    const option = document.createElement('option');
    
                    option.innerText = key;
                    this.htmlModalEdit.selectAlarm.appendChild(option);
    
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
    
            if (!this.htmlBtnStartOrPause.classList.contains('isPaused') && currentTime > 0) {
    
                currentTime--;
    
                // seconds to render:
                this.htmlTimerSeconds.innerText = getLeadingZerosNumber(currentTime % 60);
                // minutes to render:
                this.htmlTimerMinutes.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 % 60));
                // hours to render:
                this.htmlTimerHours.innerText = getLeadingZerosNumber(Math.floor(currentTime / 60 / 60));
    
            } 
            
            if (currentTime === 0) {
    
                this.currentAlarm = this.alarms[this.htmlModalEdit.selectAlarm.selectedOptions[0].value];
    
                /* Plays once an alarm.
                   Also intended for interval playing an alarm repeatedly,
                   becouse interval plays first audio after elapsed interval duration */
                this.currentAlarm.play();
    
                // plays an alarm repeatedly in intervals
                if (this.htmlModalEdit.checkboxRepeatAlarm.checked) {
    
                    this.repeatAlarm = setInterval(() => {
    
                        this.currentAlarm.play();
                        
                    }, (this.currentAlarm.duration * 1000) + 800);
    
                }
    
                this.htmlBtnStartOrPause.classList.add('isPaused');
                this.htmlBtnStartOrPause.innerText = "START";
                this.htmlBtnStartOrPause.disabled = true;
                this.htmlBtnReset.disabled = false;
                this.htmlBtnEdit.disabled = false;
                this.htmlTimerTime.classList.add('disabled');
                openOrCloseModal(this.htmlModalMessage.container);
            
            }
    
    
            if (this.htmlBtnStartOrPause.classList.contains('isPaused')) {
                
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
    
            this.htmlBtnStartOrPause.classList.add('isPaused');
            this.htmlBtnStartOrPause.innerText = "START";
            this.htmlBtnStartOrPause.disabled = true;
            this.htmlBtnEdit.disabled = false;
            this.htmlBtnReset.disabled = (statusOfTimerTimeout.isSet) ? false : true;
    
        } else if ( (currentTime > 0) && (currentTime < timerTimeout) ) {
    
            this.htmlBtnStartOrPause.disabled = false;
            this.htmlBtnEdit.disabled = false;
            this.htmlBtnReset.disabled = false;
    
        } else if (currentTime === timerTimeout) {
            
            this.htmlBtnStartOrPause.disabled = false;
            this.htmlBtnEdit.disabled = false;
            this.htmlBtnReset.disabled = true;
            
        }
    
    },

    handleMessageModal: function () {

        openOrCloseModal(this.htmlModalMessage.container);
        
        if (this.repeatAlarm) {
            clearInterval(this.repeatAlarm);
        }

        pauseAudio(this.currentAlarm);
        
    }

};


timer.set();


/**
 * FRONT PAGE BUTTONS:
 * -------------------
 */
timer.htmlBtnEdit.onclick = () => {
    
    openOrCloseModal(timer.htmlModalEdit.container);

    if (timer.testAlarm) {

        timer.testAlarm.load();

    }

}

/**
 * Hanles click event on htmlBtnStartOrPause
 * -----------------------------------------
 * 
 * Exception: enables or disables control buttons other way than enableOrDisableControlButtons() 
 * Switches text of button: 'START' or 'PAUSE'
 * 
 * @param {Event} ev 
 */
timer.htmlBtnStartOrPause.onclick = (ev) => {
    
        if (timer.htmlBtnStartOrPause.classList.contains('isPaused')) {

        timer.htmlBtnStartOrPause.innerText = 'PAUSE';
        timer.htmlBtnEdit.disabled = true;
        timer.htmlBtnReset.disabled = true;

    } else {

        timer.htmlBtnStartOrPause.innerText = 'START';
        timer.htmlBtnEdit.disabled = false;
        if (timer.getCurrentTime() != timer.getTimeout()) {
            timer.htmlBtnReset.disabled = false;
        }

    }

    timer.htmlBtnStartOrPause.classList.toggle('isPaused');


    timer.countdown(ev);

}

timer.htmlBtnReset.onclick = (ev) => {
    
    timer.renderTimeout();

    timer.htmlBtnStartOrPause.disabled = false;
    if (timer.getCurrentTime() === timer.getTimeout()) {
        
        timer.htmlBtnReset.disabled = true;

    }

}


/* modal EDIT: */

/**
 * Close modal without setting a time
 */
timer.htmlModalEdit.btnCancel.onclick = () => {

    openOrCloseModal(timer.htmlModalEdit.container);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

/**
 * Close modal without setting a time
 */
timer.htmlModalEdit.btnStorno.onclick = () => {
    
    openOrCloseModal(timer.htmlModalEdit.container);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

/**
 * Close modal and set a time
 */
timer.htmlModalEdit.btnSave.onclick = () => {

    let seconds = Number(timer.htmlModalEdit.seconds.value);
    let minutes = Number(timer.htmlModalEdit.minutes.value);
    let hours = Number(timer.htmlModalEdit.hours.value);
    let timeInSeconds = 0;

    timeInSeconds = seconds + (minutes * 60) + (hours * 60 * 60);

    if (timeInSeconds > 0) {

        timer.setTimeout();
        timer.renderTimeout();

        localStorage.setItem('currentAlarmName', timer.htmlModalEdit.selectAlarm.selectedOptions[0].value);
        localStorage.setItem('repeatAlarm', timer.htmlModalEdit.checkboxRepeatAlarm.checked);
        
        openOrCloseModal(timer.htmlModalEdit.container);

    } else {

        timer.renderTimeoutForModal();
        alert("Timeout could not be set. Only time more than 0.");
        
    }

    pauseAudio(timer.testAlarm);

    timer.enableOrDisableControlButtons();

}

timer.htmlModalEdit.closableArea.onclick = () => {

    openOrCloseModal(timer.htmlModalEdit.container);
    pauseAudio(timer.testAlarm);
    timer.resetModalEditTimer();

}

timer.htmlModalMessage.closableArea.onclick = () => {

    timer.handleMessageModal();

}

timer.htmlModalMessage.btnSubmit.onclick = () => {

    timer.handleMessageModal();

}

timer.htmlModalEdit.btnSecondIncrement.onclick = () => {
    
    if (timer.htmlModalEdit.seconds.value < timer.secondsMax) {
        timer.htmlModalEdit.seconds.value++;
        leadingZeros(timer.htmlModalEdit.seconds);
    }

};

timer.htmlModalEdit.btnSecondDecrement.onclick = () => {
    if (timer.htmlModalEdit.seconds.value > 0) {
        timer.htmlModalEdit.seconds.value--;
        leadingZeros(timer.htmlModalEdit.seconds);
    }
}

timer.htmlModalEdit.btnMinuteIncrement.onclick = () => {
    if (timer.htmlModalEdit.minutes.value < timer.minutesMax) {
        timer.htmlModalEdit.minutes.value++;
        leadingZeros(timer.htmlModalEdit.minutes);
    }
};

timer.htmlModalEdit.btnMinuteDecrement.onclick = () => {
    if (timer.htmlModalEdit.minutes.value > 0) {
        timer.htmlModalEdit.minutes.value--;
        leadingZeros(timer.htmlModalEdit.minutes);
    }
}

timer.htmlModalEdit.btnHourIncrement.onclick = () => {
    if (timer.htmlModalEdit.hours.value < hoursMax) {
        timer.htmlModalEdit.hours.value++;
        leadingZeros(timer.htmlModalEdit.hours);
    }
};

timer.htmlModalEdit.btnHourDecrement.onclick = () => {
    if (timer.htmlModalEdit.hours.value > 0) {
        timer.htmlModalEdit.hours.value--;
        leadingZeros(timer.htmlModalEdit.hours);
    }
}

timer.htmlModalEdit.seconds.oninput = () => {

    if (timer.htmlModalEdit.seconds.value > timer.secondsMax) {
        timer.htmlModalEdit.seconds.value = timer.secondsMax;
    }

}

timer.htmlModalEdit.minutes.oninput = () => {

    if (timer.htmlModalEdit.minutes.value > timer.minutesMax) {
        timer.htmlModalEdit.minutes.value = timer.minutesMax;
    }
    
}

timer.htmlModalEdit.hours.oninput = () => {

    if (timer.htmlModalEdit.hours.value > timer.hoursMax) {
        timer.htmlModalEdit.hours.value = timer.hoursMax;
    }
    
}

timer.htmlModalEdit.selectAlarm.onchange = () => {
    
    /**
     * Loads selected test alarm to play from time 0.
     * testAlarm gets updated when triggered htmlModalEdit.btnPlayOrPauseAlarm.onclick. */
    timer.alarms[timer.htmlModalEdit.selectAlarm.selectedOptions[0].value].load();

    if (!timer.testAlarm.paused) {
        
        timer.testAlarm.pause();

    }

}

timer.htmlModalEdit.btnPlayOrPauseAlarm.onclick = () => {

    timer.testAlarm = timer.alarms[timer.htmlModalEdit.selectAlarm.selectedOptions[0].value];


    if (timer.htmlModalEdit.btnPlayOrPauseAlarm.getAttribute('status') === 'isPlaying') {

        timer.testAlarm.pause();

    } else {

        timer.testAlarm.play();

    }

    timer.testAlarm.onpause = () => {
        
        switchIconPauseToPlay(timer.htmlModalEdit.btnPlayOrPauseAlarm, timer.htmlModalEdit.iconPlayAlarm, timer.htmlModalEdit.iconPauseAlarm);
    
    }

    timer.testAlarm.onplay = () => {
    
        switchIconPlayToPause(timer.htmlModalEdit.btnPlayOrPauseAlarm, timer.htmlModalEdit.iconPlayAlarm, timer.htmlModalEdit.iconPauseAlarm);

    }

}

timer.htmlModalEdit.btnPlayOrPauseAlarm.onchange = () => {
    
    const fReader = new FileReader();
    const file = timer.htmlModalEdit.btnPlayOrPauseAlarm.files[0];

    if (file)
        fReader.readAsDataURL(file);

    fReader.onloadend = (event) => {

        timer.customAlarms[clearFileSuffix(file.name)] = event.target.result;
        localStorage.setItem('customAlarms', JSON.stringify(timer.customAlarms));

        timer.renderCustomAlarms();
        
    }

}