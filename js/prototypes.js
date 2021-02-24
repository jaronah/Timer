/** 
 * 
 * @license Andy Mercer, (c) Stack Exchange Inc
 * licensed under CC BY-SA 3.0 - https://creativecommons.org/licenses/by-sa/3.0/
 * source: https://stackoverflow.com/a/38225299/14570657
 * 
 * Modified into ES6
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