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
 * Open or Close Modal Window
 * ---------------------------
 * uses attribute 'status' with possible values: 'open' or 'close'
 * 
 * @param {HTMLDivElement} obj object to open or close 
 */
const openOrCloseModal = (obj) => {
    
    if (obj != undefined || obj != null) {

        if (obj.getAttribute('status') == 'close') {
        
            obj.setAttribute('status', 'open');
            obj.classList.remove('d-n');
        
        } else if (obj.getAttribute('status') == 'open') {
        
            obj.setAttribute('status', 'close');
            obj.classList.add('d-n');
        
        }
        
    }

}
