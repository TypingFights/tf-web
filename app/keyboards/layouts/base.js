function removeGetter(propertyName, ownPropertyName, intermediateValue) {
  Object.defineProperty(this, propertyName, {
    value: Object.assign(intermediateValue, this[ownPropertyName]),
  });
  return this[propertyName];
}

export const KeyboardLayoutMixin = (Base) => {
  const base = new Base();
  const { labels, charCodesMap } = base;

  return class extends Base {
    get labels() {
      return removeGetter.call(this, 'labels', 'ownLabels', labels);
    }

    get charCodesMap() {
      return removeGetter.call(this, 'charCodesMap', 'ownCharCodesMap', charCodesMap);
    }
  };
};

export class BaseLayout {
  get labels() {
    return this.ownLabels;
  }

  get charCodesMap() {
    return this.ownCharCodesMap;
  }

  ownLabels = {
    Backquote: '`',
    Digit1: '1',
    Digit2: '2',
    Digit3: '3',
    Digit4: '4',
    Digit5: '5',
    Digit6: '6',
    Digit7: '7',
    Digit8: '8',
    Digit9: '9',
    Digit0: '0',
    Minus: '-',
    Equal: '=',
    Backspace: 'Backspace',
    Tab: 'Tab',
    KeyQ: 'Q',
    KeyW: 'W',
    KeyE: 'E',
    KeyR: 'R',
    KeyT: 'T',
    KeyY: 'Y',
    KeyU: 'U',
    KeyI: 'I',
    KeyO: 'O',
    KeyP: 'P',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    CapsLock: 'Caps Lock',
    KeyA: 'A',
    KeyS: 'S',
    KeyD: 'D',
    KeyF: 'F',
    KeyG: 'G',
    KeyH: 'H',
    KeyJ: 'J',
    KeyK: 'K',
    KeyL: 'L',
    Semicolon: ';',
    Quote: '\'',
    Enter: 'Enter',
    ShiftLeft: 'Shift',
    KeyZ: 'Z',
    KeyX: 'X',
    KeyC: 'C',
    KeyV: 'V',
    KeyB: 'B',
    KeyN: 'N',
    KeyM: 'M',
    Comma: ',',
    Period: '.',
    Slash: '/',
    ShiftRight: 'Shift',
    ControlLeft: 'Ctrl',
    MetaLeft: '',
    AltLeft: 'Alt',
    Space: '',
    AltRight: 'Alt',
    MetaRight: '',
    ControlRight: 'Ctrl',
  };

  ownCharCodesMap = {};
}

export default KeyboardLayoutMixin;
