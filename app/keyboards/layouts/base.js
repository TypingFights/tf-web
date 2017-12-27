export const KeyboardLayoutMixin = Base => class extends Base {
  get labels() {
    const Super = super.constructor;
    return Object.assign((new Super()).labels, this.ownLabels);
  }
};

export class BaseLayout {
  get labels() {
    return this.ownLabels;
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
    Equal: '+',
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
}

export default KeyboardLayoutMixin;
