import hbs from 'htmlbars-inline-precompile';
import { find, findAll } from 'ember-native-dom-helpers';
import styles from 'typing-fights/components/virtual-keyboard/styles';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('virtual-keyboard', 'Integration | Component | virtual keyboard', {
  integration: true,
});

class PhysicalNumpadLayout {
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
}

class LogicalNumpadLayout {
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
}

test('it should render a physical layout properly', async function (expect) {
  this.set('layout', {
    physical: new PhysicalNumpadLayout(),
    logical: new LogicalNumpadLayout(),
  });
  this.render(hbs`{{virtual-keyboard layout=layout}}`);
  const rows = await findAll(`.${styles.row}`);
  expect(rows.length).to.be.equal(3);
  const keyboard = await find(`.${styles.keyboard}`);
  expect(keyboard.textContent).to.be.equal('789456123');
});
