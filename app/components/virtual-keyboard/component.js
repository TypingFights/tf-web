import Component from '@ember/component';
import { observer } from '@ember/object';
import keyCodes, { charCodesMap } from 'typing-fights/keyboards/codes';

export default Component.extend({
  tagName: '',
  keyCodes,
  promptedState: {},
  lastSymbol: '',
  nextSymbolObserver: observer('textVisible', 'nextSymbolPosition', function () {
    const {
      nextSymbol: char,
      lastSymbol: lastChar,
    } = this.getProperties('nextSymbol', 'lastSymbol');

    this.clearHint(this.getCodes(lastChar));
    this.showHint(this.getCodes(char));
    this.set('lastSymbol', char);
  }),
  errorObserver: observer('error', function () {
    const error = this.get('error');
    if (error) {
      this.clearHint(this.getCodes(this.get('lastSymbol')));
    } else {
      this.showHint(this.getCodes(this.get('nextSymbol')));
    }
    this.set('promptedState.Backspace', error);
  }),
  clearHint(codes) {
    codes.forEach(code => this.set(`promptedState.${code}`, false));
  },
  showHint(codes) {
    codes.forEach(code => this.set(`promptedState.${code}`, true));
  },
  getCodes(char) {
    const foreignCharCodeMap = this.get('layout.charCodesMap');
    const charCode = char.charCodeAt(0);
    const codes = charCode in foreignCharCodeMap ?
      charCodesMap[foreignCharCodeMap[charCode]] : charCodesMap[charCode];
    return typeof codes !== 'undefined' ? codes.split(' ') : [];
  },
});
