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

const getLeadingZerosNumber = (numInput) => {

    let num = Number(numInput);

    num = (num < 10) ? "0" + num : num;

    return num;

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


/**
 * 
 * @param {String} fileName 
 */
const clearFileSuffix = (fileName) => {

    let suffixStart;

    if (fileName.includes('.')) {

        for (let i = (fileName.length - 1); i >= 0; i--) {
            if (fileName[i].includes('.')) {
                suffixStart = i;
                break;
            }
        }
    }

    return fileName.substring(0, suffixStart);

}

/**
 * 
 * @param {HTMLDivElement} id 
 */
const clearMessage = (id) => {
    
    id.innerHTML = "";
    
}

const isAudioPlaying = (audio) => {

    if (audio instanceof HTMLAudioElement) {
        return !audio.paused;
    }

}