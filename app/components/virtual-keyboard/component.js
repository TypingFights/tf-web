import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  tagName: '',
  promptedState: {},
  lastSymbol: '',
  textVisible: true,
  nextSymbolObserver: observer('textVisible', 'nextSymbolPosition', function () {
    const char = this.get('nextSymbol');
    this.clearHint(this.getCodes(this.get('lastSymbol')));
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
    const charCodesMap = this.get('layout.physical.defaultCharCodesMap');
    const foreignCharCodeMap = this.get('layout.logical.charCodesMap');
    const charCode = char.charCodeAt(0);
    const codes = charCode in foreignCharCodeMap ?
      charCodesMap[foreignCharCodeMap[charCode]] : charCodesMap[charCode];
    return typeof codes !== 'undefined' ? codes.split(' ') : [];
  },
});
