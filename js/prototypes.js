/** 
 * source: https://stackoverflow.com/questions/9790845/check-if-an-option-exist-in-select-element-without-jquery#answer-38225299
 * license: CC BY-SA 3.0
 * 
 * Modified into ES 2015
 * 
 *  */ 
HTMLSelectElement.prototype.contains = function (value) {

    for (let option of this.options) {

        if (option.value === value) {

            return true;

        }

    }

    return false;

}