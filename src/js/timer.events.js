/**
 * EVENT HANDLERS for timer object
 * -------------------------------
 * 
 * timer.events.js depends on:
 *   - js/timer.js
 *   - js/functions.js
 */

'use strict';

window.addEventListener('load', function () {

    /* Front page buttons */
    timer.htmlBtnEdit.addEventListener('click', timer.openModalEdit);
    timer.htmlBtnStartOrPause.addEventListener('click', timer.startOrPause);    
    timer.htmlBtnReset.addEventListener('click', timer.reset);

    /* modal EDIT: */
    timer.htmlModalEdit.btnCancel.addEventListener('click', timer.closeAndDiscardModalEdit);
    timer.htmlModalEdit.btnStorno.addEventListener('click', timer.closeAndDiscardModalEdit);
    timer.htmlModalEdit.closableArea.addEventListener('click', timer.closeAndDiscardModalEdit);
    timer.htmlModalEdit.btnSave.addEventListener('click', timer.closeAndSaveModalEdit);
    
    timer.htmlModalEdit.btnSecondIncrement.addEventListener('click', timer.incrementSeconds);
    timer.htmlModalEdit.btnSecondDecrement.addEventListener('click', timer.decrementSeconds);
    timer.htmlModalEdit.btnMinuteIncrement.addEventListener('click', timer.incrementMinutes);
    timer.htmlModalEdit.btnMinuteDecrement.addEventListener('click', timer.decrementMinutes);
    timer.htmlModalEdit.btnHourIncrement.addEventListener('click', timer.incrementHours);
    timer.htmlModalEdit.btnHourDecrement.addEventListener('click', timer.decrementHours)

    timer.htmlModalEdit.seconds.addEventListener('input', timer.controlSeconds);
    timer.htmlModalEdit.minutes.addEventListener('input', timer.controlMinutes);
    timer.htmlModalEdit.hours.addEventListener('input', timer.controlHours);

    timer.htmlModalEdit.selectAlarm.addEventListener('change', timer.handleSelectedAlarm);
    timer.htmlModalEdit.btnPlayOrPauseAlarm.addEventListener('click', timer.playOrPauseAlarmPreview);    
    timer.htmlModalEdit.btnBrowseAlarm.addEventListener('change', timer.importCustomAlarm);
    
    /* modal MESSAGE */
    timer.htmlModalMessage.closableArea.addEventListener('click', timer.closeModalMessage);
    timer.htmlModalMessage.btnSubmit.addEventListener('click', timer.closeModalMessage);

});