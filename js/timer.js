'use strict';

const timerSeconds = document.getElementById('timerSeconds');
const timerMinutes = document.getElementById('timerMinutes');
const timerHours = document.getElementById('timerHours');

const btnEdit = document.getElementById('btnEdit');
const modalEditTimer = document.getElementById('modalEditTimer');
const modalClosableArea = document.getElementById('closableAreaOfEditTimer');


/*
 * Variables from modal: Edit Timer
 * --------------------------------
 */
const btnCloseModal = document.getElementById('btnCancelModalEditTimer');
const btnStornoModal = document.getElementById('btnStornoModalEditTimer');
const btnSaveModal = document.getElementById('btnSaveModalEditTimer');

const btnSecondsIncrement = document.getElementById('seconds-increment');
const btnSecondsDecrement = document.getElementById('seconds-decrement');
const btnMinutesIncrement = document.getElementById('minutes-increment');
const btnMinutesDecrement = document.getElementById('minutes-decrement');
const btnHoursIncrement = document.getElementById('hours-increment');
const btnHoursDecrement = document.getElementById('hours-decrement');

/**
 * @type {HTMLInputElement}
 */
const modalSeconds = document.getElementsByClassName('modal__seconds-edit')[0];

/**
 * @type {HTMLInputElement}
 */
const modalMinutes = document.getElementsByClassName('modal__minutes-edit')[0];

/**
 * @type {HTMLInputElement}
 */
const modalHours = document.getElementsByClassName('modal__hours-edit')[0];


/**
 * Save set time from modal Edit timer
 */
const setTime = () => {
    timerSeconds.innerHTML = modalSeconds.value;
    timerMinutes.innerHTML = modalMinutes.value;
    timerHours.innerHTML = modalHours.value;
}


/**
 * FRONT PAGE BUTTONS:
 * -------------------
 */
btnEdit.onclick = () => {
    openOrCloseModal(modalEditTimer);
}



/* EDIT TIMER: */

/**
 * Close modal and set a time
 */
btnCloseModal.onclick = () => {
    setTime();
    openOrCloseModal(modalEditTimer);
}

/**
 * Close modal and set a time
 */
btnSaveModal.onclick = () => {
    setTime();
    openOrCloseModal(modalEditTimer);
}

/**
 * Close modal without setting a time
 */
btnStornoModal.onclick = () => {
    openOrCloseModal(modalEditTimer);
}

modalClosableArea.onclick = () => {
    openOrCloseModal(modalEditTimer);
}


btnSecondsIncrement.onclick = () => {
    if (modalSeconds.value < 59) {
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
    if (modalMinutes.value < 59) {
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
    if (modalHours.value < 23) {
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