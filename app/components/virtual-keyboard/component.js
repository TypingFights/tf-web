import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import layouts from 'typing-fights/keyboards/layouts';
import keyCodes, { charCodesMap } from 'typing-fights/keyboards/codes';

export default Component.extend({
  tagName: '',
  keyCodes,
  labels: computed('language', 'layout', function () {
    return (new layouts[this.get('language')][this.get('layout')]()).labels;
  }),
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
    const lang = this.get('language');
    const foreignCharCodeMap = this.get(`charCodesMap${lang.toUpperCase()}`) || {};
    const charCode = char.charCodeAt(0);
    const codes = charCode in foreignCharCodeMap ?
      charCodesMap[foreignCharCodeMap[charCode]] : charCodesMap[charCode];
    return typeof codes !== 'undefined' ? codes.split(' ') : [];
  },
  charCodesMapRU: {
    34: 64,
    44: 63,
    46: 47,
    47: 124,
    58: 94,
    59: 36,
    63: 38,
    1025: 126,
    1040: 70,
    1041: 60,
    1042: 68,
    1043: 85,
    1044: 76,
    1045: 84,
    1046: 58,
    1047: 80,
    1048: 66,
    1049: 81,
    1050: 82,
    1051: 75,
    1052: 86,
    1053: 89,
    1054: 74,
    1055: 71,
    1056: 72,
    1057: 67,
    1058: 78,
    1059: 69,
    1060: 65,
    1061: 123,
    1062: 87,
    1063: 88,
    1064: 73,
    1065: 79,
    1066: 125,
    1067: 83,
    1068: 77,
    1069: 34,
    1070: 62,
    1071: 90,
    1072: 102,
    1073: 44,
    1074: 100,
    1075: 117,
    1076: 108,
    1077: 116,
    1078: 59,
    1079: 112,
    1080: 98,
    1081: 113,
    1082: 114,
    1083: 107,
    1084: 118,
    1085: 121,
    1086: 106,
    1087: 103,
    1088: 104,
    1089: 99,
    1090: 110,
    1091: 101,
    1092: 97,
    1093: 91,
    1094: 119,
    1095: 120,
    1096: 105,
    1097: 111,
    1098: 93,
    1099: 115,
    1100: 109,
    1101: 39,
    1102: 46,
    1103: 122,
    1105: 96,
    8470: 35,
  },
});
