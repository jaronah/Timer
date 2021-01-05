'use strict';

// INITIAL SETTINGS WHEN PAGE LOADS:

insertTimeoutIntoHtml();
enableOrDisableTimerButtons();

if (localStorage.getItem('alarmsLocal')) {
    
    loadAlarmsLocal();

}