import Component from '@ember/component';
import { set, computed, observer } from '@ember/object';
import styles from './styles';

export default Component.extend({
  styles,
  tagName: '',
  lastWordPosition: 0,
  lastErrorPosition: 0,
  lastSymbolPosition: 0,
  symbols: computed('text', function () {
    return this.get('text').split('');
  }),
  words: computed('symbols', function () {
    const symbols = this.get('symbols');
    const words = this.get('wordsBounds').map((bounds, index) => ({
      isActive: index === 0,
      symbols: symbols.slice(bounds[0], bounds[1]).map((value, i) => ({
        isActive: index === 0 && i === 0,
        value,
      })),
    }));
    return set(this, 'hash', words);
  }),
  wordsBounds: computed('text', function () {
    let pos = 0;
    return this.get('text')
      .split(/\s/g)
      .map((word) => {
        pos += word.length + 1;
        return word.length > 0 ?
          [[pos - word.length - 1, pos - 1], [pos - 1, pos]] : [[pos - 1, pos]];
      })
      .reduce((a, b) => a.concat(b))
      .slice(0, -1);
  }),
  cursorData: computed('symbols', 'wordsBounds', function () {
    const wordsBounds = this.get('wordsBounds');
    return this.get('symbols').map((_, index) => {
      const wordIndex = wordsBounds.findIndex(bounds =>
        bounds[0] <= index && index < bounds[1]);
      const symbolIndex = index - wordsBounds[wordIndex][0];
      return [wordIndex, symbolIndex];
    });
  }),
  cursorObserver: observer('currentPosition', function () {
    const {
      lastWordPosition,
      lastSymbolPosition,
    } = this.getProperties('lastWordPosition', 'lastSymbolPosition');

    const {
      currentWordPosition,
      currentSymbolPosition,
    } = this.getPosition();

    if (currentWordPosition !== lastWordPosition) {
      this.setProperties({
        [`hash.${lastWordPosition}.isActive`]: false,
        [`hash.${currentWordPosition}.isActive`]: true,
        lastWordPosition: currentWordPosition,
      });
    }

    this.setProperties({
      [`hash.${lastWordPosition}.symbols.${lastSymbolPosition}.isActive`]: false,
      [`hash.${currentWordPosition}.symbols.${currentSymbolPosition}.isActive`]: true,
      lastSymbolPosition: currentSymbolPosition,
    });
  }),
  getPosition() {
    const {
      cursorData,
      currentPosition,
    } = this.getProperties('cursorData', 'currentPosition');
    let position = currentPosition;
    if (position >= cursorData.length) {
      position = cursorData.length - 1;
    } else if (position < 0) {
      position = 0;
    }

    return {
      currentWordPosition: cursorData[position][0],
      currentSymbolPosition: cursorData[position][1],
    };
  },
});
