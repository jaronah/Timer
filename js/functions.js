'use strict';

/**
 * 
 * @param {Object} obj
 */
const leadingZeros = (obj) => {

    let num = Number(obj.value);
    
    num = (num < 10) ? "0" + num : num;
    obj.value = num;

}

/**
 * 
 * @param {*} what to close 
 */
const closeModal = (what) => {
    if (what != undefined || what != null) {
        what.classList.add('d-n');
    }
}

const openEditTimer = () => {
    const modalEdit = document.querySelector('.modal--edit').parentElement;

    modalEdit.classList.remove('d-n');
}
