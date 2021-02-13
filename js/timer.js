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
 * ------------------------
 * timer.js depends on:
 *   - js/prototypes.js
 *   - js/functions.js
 * 
 * event handlers are in:
 *   - js/timer.events.js
 * 
 * Include this script after HTML DOM is loaded!
 */

'use strict';

const timer = {

    /**
     * Currently set alarm audio
     * 
     * @type {HTMLAudioElement}
     */                 
    currentAlarm: '',

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

    
    // Main page properties:
    htmlTimerTime: document.getElementById('timerTime'),
    htmlTimerSeconds: document.getElementById('timerSeconds'),
    htmlTimerMinutes: document.getElementById('timerMinutes'),
    htmlTimerHours: document.getElementById('timerHours'),
    
    htmlBtnEdit: document.getElementById('btnEdit'),
    htmlBtnStartOrPause: document.getElementById('btnStartOrPause'),
    htmlBtnReset: document.getElementById('btnReset'),

    // Modals:
    htmlModalEdit: {

        container: document.getElementById('modalEditTimer'),
        closableArea: document.getElementById('closableAreaOfEditTimer'),

        btnCancel: document.getElementById('btnCancelModalEditTimer'),
        btnStorno: document.getElementById('btnStornoModalEditTimer'),
        btnSave: document.getElementById('btnSaveModalEditTimer'),
        
        btnSecondIncrement: document.getElementById('seconds-increment'),
        btnSecondDecrement: document.getElementById('seconds-decrement'),
        btnMinuteIncrement: document.getElementById('minutes-increment'),
        btnMinuteDecrement: document.getElementById('minutes-decrement'),
        btnHourIncrement: document.getElementById('hours-increment'),
        btnHourDecrement: document.getElementById('hours-decrement'),

        seconds: document.getElementById('modalSeconds'),
        minutes: document.getElementById('modalMinutes'),
        hours: document.getElementById('modalHours'),

        selectAlarm: document.getElementById('modalSelectAlarm'),
        btnPlayOrPauseAlarm: document.getElementById('btnPlayOrPauseAlarm'),
        btnBrowseAlarm: document.getElementById('btnBrowseAlarm'),

        iconPlayAlarm: document.getElementById('iconPlayAlarm'),
        iconPauseAlarm: document.getElementById('iconPauseAlarm'),
                    
        checkboxRepeatAlarm: document.getElementById('checkboxRepeatAlarm'),
        
        /**
         * Resets currently set values in the modal EDIT. Sets stored values from Local Storage.
         */
        reset: function () {
        
            timer.renderTimeoutForModal();
            timer.setCurrentAlarmFromLocalStorage();
            timer.setRepeatAlarm();
        
        },

        close: function () {
    
            openOrCloseModal(timer.htmlModalEdit.container);
            pauseAudio(timer.currentAlarm);

        }

    },

    htmlModalMessage: {
    
        container: document.getElementById('modalMessage'),
        closableArea: document.getElementById('closableAreaOfModalMessage'),
        btnSubmit: document.getElementById('btnSubmitMessage'),
        
    },


    setUserSettings: function () {

        this.renderCustomAlarms();
        this.setCurrentAlarmFromLocalStorage();
        this.setRepeatAlarm();
    
    },

    setTimeout: function () {
    
        localStorage.setItem('timerSeconds', Number(this.htmlModalEdit.seconds.value));
        localStorage.setItem('timerMinutes', Number(this.htmlModalEdit.minutes.value));
        localStorage.setItem('timerHours', Number(this.htmlModalEdit.hours.value));
    
    },

    setCurrentAlarm: function () {
        
        this.currentAlarm = this.alarms[this.htmlModalEdit.selectAlarm.selectedOptions[0].value];

    },

    /**
     * Selects an option of currently set alarm (stored in Local Storage)
     * for HTML Select element containing alarm options.
     */
    setCurrentAlarmFromLocalStorage: function () {
    
        const currentAlarmName = localStorage.getItem('currentAlarmName');
    
        if (this.alarms.hasOwnProperty(currentAlarmName)) {
    
            for (let i = 0; i < this.htmlModalEdit.selectAlarm.length; i++) {
    
                if (this.htmlModalEdit.selectAlarm[i].value === currentAlarmName) {
    
                    this.htmlModalEdit.selectAlarm.selectedIndex = i;
                    break;
    
                }
    
            }
    
        }

        this.setCurrentAlarm();

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
    
                /* Plays once an alarm.
                   Also intended for interval playing an alarm repeatedly,
                   becouse interval plays first audio after elapsed interval duration */
                if (this.currentAlarm instanceof Audio) {

                    this.currentAlarm.play();

                }
    
                // plays an alarm repeatedly in intervals
                if ((this.currentAlarm instanceof Audio) && this.htmlModalEdit.checkboxRepeatAlarm.checked) {
    
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

    /**
     * Starts or pauses countdown of timeout.
     * 
     * Switches text of the START/PAUSE button.
     * Also enables or disables control buttons (Edit, Start/Pause, Reset)
     * 
     * @param {Event} ev 
     */
    startOrPause: function (ev) {
      
        if (timer.htmlBtnStartOrPause.classList.contains('isPaused')) { // clicked on button START

            timer.htmlBtnStartOrPause.innerText = 'PAUSE';
            timer.htmlBtnEdit.disabled = true;
            timer.htmlBtnReset.disabled = true;

            if ((timer.currentAlarm instanceof Audio) && timer.currentAlarm.currentTime > 0) {
                
                timer.currentAlarm.load();
                
            }

        } else { // clicked on button PAUSE

            timer.htmlBtnStartOrPause.innerText = 'START';
            timer.htmlBtnEdit.disabled = false;
            if (timer.getCurrentTime() != timer.getTimeout()) {
                timer.htmlBtnReset.disabled = false;
            }

        }

        timer.htmlBtnStartOrPause.classList.toggle('isPaused');


        timer.countdown(ev);

    },

    /**
     * Plays or pauses an alarm preview in the modal EDIT.
     */
    playOrPauseAlarmPreview: function () {

        if (timer.currentAlarm instanceof Audio) {

            if (timer.htmlModalEdit.btnPlayOrPauseAlarm.getAttribute('status') === 'isPlaying') {

                timer.currentAlarm.pause();
    
            } else {
    
                timer.currentAlarm.play();
    
            }
    
            timer.currentAlarm.onpause = () => {
                
                switchIconPauseToPlay(timer.htmlModalEdit.btnPlayOrPauseAlarm, timer.htmlModalEdit.iconPlayAlarm, timer.htmlModalEdit.iconPauseAlarm);
            
            }
    
            timer.currentAlarm.onplay = () => {
            
                switchIconPlayToPause(timer.htmlModalEdit.btnPlayOrPauseAlarm, timer.htmlModalEdit.iconPlayAlarm, timer.htmlModalEdit.iconPauseAlarm);
    
            }

        }

    },

    /**
     * Resets timeout.
     * 
     * Also enables button Start/Pause and disables button Reset.
     */
    reset: function () {

        timer.renderTimeout();

        timer.htmlBtnStartOrPause.disabled = false;
        if (timer.getCurrentTime() === timer.getTimeout()) {
            
            timer.htmlBtnReset.disabled = true;

        }

    },

    /**
     * Opens modal EDIT.
     */
    openModalEdit: function () {

        openOrCloseModal(timer.htmlModalEdit.container);

        if (timer.currentAlarm instanceof Audio) {

            timer.currentAlarm.load();

        }
        
    },

    /**
     * Closes modal EDIT and discards currently set settings (time, alarm, repeat alarm).
     */
    closeAndDiscardModalEdit: function () {

        timer.htmlModalEdit.reset();
        timer.htmlModalEdit.close();

    },

    /**
     * Closes modal EDIT and saves currently set settings (time, alarm, repeat alarm).
     */
    closeAndSaveModalEdit: function () {
        
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

        pauseAudio(timer.currentAlarm);

        timer.enableOrDisableControlButtons();

    },

    /**
     * Closes modal MESSAGE.
     */
    closeModalMessage: function () {

        openOrCloseModal(timer.htmlModalMessage.container);
        
        if (timer.repeatAlarm) {
            clearInterval(timer.repeatAlarm);
        }

        pauseAudio(timer.currentAlarm);
        
    },

    /**
     * When selected a new alarm option from HTML Select with alarm names,
     * it pauses a preview of an alarm audio if playing and sets currently selected alarm.
     */
    handleSelectedAlarm: function () {
        
        pauseAudio(timer.currentAlarm);

        timer.setCurrentAlarm(); // currentAlarm updated

        if (timer.currentAlarm instanceof Audio) {

            timer.currentAlarm.load();
            
        }

    },

    /**
     * Imports custom alarm audio encoded into base64.
     * 
     * Custom alarm audios are stored in the Local Storage of user's browser.
     */
    importCustomAlarm: function () {
        
        const fReader = new FileReader();
        const file = timer.htmlModalEdit.btnBrowseAlarm.files[0];

        if (file)
            fReader.readAsDataURL(file);

        fReader.onloadend = (event) => {

            timer.customAlarms[clearFileSuffix(file.name)] = event.target.result;
            localStorage.setItem('customAlarms', JSON.stringify(timer.customAlarms));

            timer.renderCustomAlarms();
            
        }

    },

    /**
     * Increments time unit (seconds or minutes or hours) inside HTML Element till reaching its limit.
     * 
     * @param {HTMLElement} htmlTimeInput containing seconds or minutes or hours
     * @param {Number} limit
     */
    incrementTimeUnit: function (htmlTimeInput, limit) {
        
        if (htmlTimeInput.value < limit) {

            htmlTimeInput.value++;
            leadingZeros(htmlTimeInput);

        }

    },

    /**
     * Decrements time unit (seconds or minutes or hours) inside HTML Element till reaching its limit - 0.
     *
     * @param {HTMLElement} htmlTimeInput containing seconds or minutes or hours
     */
    decrementTimeUnit: function (htmlTimeInput) {
        
        if (htmlTimeInput.value > 0) {

            htmlTimeInput.value--;
            leadingZeros(htmlTimeInput);

        }

    },

    incrementSeconds: function () {
        
        timer.incrementTimeUnit(timer.htmlModalEdit.seconds, timer.secondsMax);

    },

    incrementMinutes: function () {
        
        timer.incrementTimeUnit(timer.htmlModalEdit.minutes, timer.minutesMax);

    },

    incrementHours: function () {
        
        timer.incrementTimeUnit(timer.htmlModalEdit.hours, timer.hoursMax);

    },

    decrementSeconds: function () {
        
        timer.decrementTimeUnit(timer.htmlModalEdit.seconds);

    },

    decrementMinutes: function () {
        
        timer.decrementTimeUnit(timer.htmlModalEdit.minutes);

    },

    decrementHours: function () {
        
        timer.decrementTimeUnit(timer.htmlModalEdit.hours);

    },

    /**
     * Controls valid time unit value and automatically corrects if limit exceeded.
     * 
     * @param {HTMLElement} htmlTimeInput 
     * @param {Number} limit 
     */
    controlTimeUnit: function (htmlTimeInput, limit) {
        
        if (htmlTimeInput.value > limit) {

            htmlTimeInput.value = limit;
        
        }

    },

    /**
     * Controls valid seconds value and automatically corrects if limit exceeded.
     */
    controlSeconds: function () {
        
        timer.controlTimeUnit(timer.htmlModalEdit.seconds, timer.secondsMax);

    },

    /**
     * Controls valid minutes value and automatically corrects if limit exceeded.
     */
    controlMinutes: function () {
        
        timer.controlTimeUnit(timer.htmlModalEdit.minutes, timer.minutesMax);

    },

    /**
     * Controls valid hours value and automatically corrects if limit exceeded.
     */
    controlHours: function () {
        
        timer.controlTimeUnit(timer.htmlModalEdit.hours, timer.hoursMax);

    }

};