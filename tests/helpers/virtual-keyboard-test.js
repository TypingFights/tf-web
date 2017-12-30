export class PhysicalNumpadLayout {
  rows = [
    [
      'Numpad7',
      'Numpad8',
      'Numpad9',
    ],
    [
      'Numpad4',
      'Numpad5',
      'Numpad6',
    ],
    [
      'Numpad1',
      'Numpad2',
      'Numpad3',
    ],
  ];

  defaultCharCodesMap = {
    49: 'Numpad1',
    50: 'Numpad2',
    51: 'Numpad3',
    52: 'Numpad4',
    53: 'Numpad5',
    54: 'Numpad6',
    55: 'Numpad7',
    56: 'Numpad4',
    57: 'Numpad1',
  };
}

export class LogicalNumpadLayout {
  labels = {
    Numpad1: '1',
    Numpad2: '2',
    Numpad3: '3',
    Numpad4: '4',
    Numpad5: '5',
    Numpad6: '6',
    Numpad7: '7',
    Numpad8: '8',
    Numpad9: '9',
  };

  charCodesMap = {};
}
