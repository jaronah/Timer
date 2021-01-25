/**
 * EVENT HANDLERS for timer object
 * -------------------------------
 * 
 * timer.events.js depends on:
 *   - js/timer.js
 *   - js/functions.js
 */

'use strict';

window.onload = function () {

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

    timer.htmlModalEdit.btnBrowseAlarm.onchange = () => {
        
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

}