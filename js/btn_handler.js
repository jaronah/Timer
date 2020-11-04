'use strict';

const btnSecondsIncrement = document.getElementById('seconds-increment');
const btnSecondsDecrement = document.getElementById('seconds-decrement');
const btnMinutesIncrement = document.getElementById('minutes-increment');
const btnMinutesDecrement = document.getElementById('minutes-decrement');
const btnHoursIncrement = document.getElementById('hours-increment');
const btnHoursDecrement = document.getElementById('hours-decrement');

const inputSeconds = document.getElementsByClassName('modal__seconds-edit')[0];
const inputMinutes = document.getElementsByClassName('modal__minutes-edit')[0];
const inputHours = document.getElementsByClassName('modal__hours-edit')[0];

btnSecondsIncrement.onclick = () => {
    if (inputSeconds.value < 59) {
        inputSeconds.value++;
        leadingZeros(inputSeconds);
    }
};

btnSecondsDecrement.onclick = () => {
    if (inputSeconds.value > 0) {
        inputSeconds.value--;
        leadingZeros(inputSeconds);
    }
}

btnMinutesIncrement.onclick = () => {
    if (inputMinutes.value < 59) {
        inputMinutes.value++;
        leadingZeros(inputMinutes);
    }
};

btnMinutesDecrement.onclick = () => {
    if (inputMinutes.value > 0) {
        inputMinutes.value--;
        leadingZeros(inputMinutes);
    }
}

btnHoursIncrement.onclick = () => {
    if (inputHours.value < 23) {
        inputHours.value++;
        leadingZeros(inputHours);
    }
};

btnHoursDecrement.onclick = () => {
    if (inputHours.value > 0) {
        inputHours.value--;
        leadingZeros(inputHours);
    }
}