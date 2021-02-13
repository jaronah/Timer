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
 * Icon PAUSE will be hidden, icon PLAY will be displayed.
 * -------------------------------------------------------
 * 
 * Function works with attribute "status" in button element.
 * There are two values of "status": status='' or status='isPlaying'.
 * Status 'isPlaying' means the audio/video is playing, this is controlled outside of this function.
 * CSS class .d-n means "display: none;"
 * 
 * @param {HTMLButtonElement} htmlBtn 
 * @param {SVGElement} htmlIconPlay 
 * @param {SVGElement} htmlIconPause 
 */
const switchIconPauseToPlay = (htmlBtn, htmlIconPlay, htmlIconPause) => {

    htmlBtn.setAttribute('status', '');
    htmlIconPause.classList.add('d-n');
    htmlIconPlay.classList.remove('d-n'); // icon displayed

}

/**
 * Icon PLAY will be hidden, icon PAUSE will be displayed.
 * -------------------------------------------------------
 * 
 * Function works with attribute "status" in button element.
 * There are two values of "status": status='' or status='isPlaying'.
 * Status 'isPlaying' means the audio/video is playing, this is controlled outside of this function.
 * CSS class .d-n means "display: none;"
 * 
 * @param {HTMLButtonElement} htmlBtn 
 * @param {SVGElement} htmlIconPlay 
 * @param {SVGElement} htmlIconPause 
 */
const switchIconPlayToPause = (htmlBtn, htmlIconPlay, htmlIconPause) => {

    htmlBtn.setAttribute('status', 'isPlaying');
    htmlIconPlay.classList.add('d-n');
    htmlIconPause.classList.remove('d-n'); // icon displayed

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

/**
 * Pauses audio if audio is playing
 * --------------------------------
 * 
 * @param {HTMLAudioElement} audio
 */
const pauseAudio = (audio) => {

    if ((audio instanceof Audio) && !audio.paused) {

        audio.pause();
        
    }

}

/**
 * 
 * code by kubosho_, (c) Stack Exchange Inc
 * licensed under CC BY-SA 3.0 - https://creativecommons.org/licenses/by-sa/3.0/
 * source: https://stackoverflow.com/a/33369954/14570657
 *  
 * I have added: !(value instanceof Array)
 * 
 * @param {string} value 
 */
const isJsonObject = (value) => {

    value = typeof value !== "string"
        ? JSON.stringify(value)
        : value;

    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }


    if (typeof value === "object" && !(value instanceof Array) && value !== null) {
        return true;
    }

    return false;

}