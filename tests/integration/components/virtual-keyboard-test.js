import hbs from 'htmlbars-inline-precompile';
import { find, findAll } from 'ember-native-dom-helpers';
import styles from 'typing-fights/components/virtual-keyboard/styles';
import layouts from 'typing-fights/keyboards/layouts';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';
import {
  PhysicalNumpadLayout,
  LogicalNumpadLayout,
} from '../../helpers/virtual-keyboard-test';

moduleForComponent('virtual-keyboard', 'Integration | Component | virtual keyboard', {
  integration: true,
});

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

const commonRow1 = '1234567890-=Backspace';
const commonRow5 = 'CtrlAltAltCtrl';

test('it should render the `QWERTY` ANSI layout properly', async function (expect) {
  this.set('layout', {
    physical: new layouts.physical.ANSI(),
    logical: new layouts.logical.en.Regular(),
  });
  this.render(hbs`{{virtual-keyboard layout=layout}}`);
  const rows = await findAll(`.${styles.row}`);
  expect(rows.length).to.be.equal(5);
  const keyboard = await find(`.${styles.keyboard}`);
  const row1 = `\`${commonRow1}`;
  const row2 = 'TabQWERTYUIOP[]\\';
  const row3 = 'Caps LockASDFGHJKL;\'Enter';
  const row4 = 'ShiftZXCVBNM,./Shift';
  expect(keyboard.textContent)
    .to.be.equal(row1 + row2 + row3 + row4 + commonRow5);
});

test('it should render the `ЙЦУКЕН` ANSI layout properly', async function (expect) {
  this.set('layout', {
    physical: new layouts.physical.ANSI(),
    logical: new layouts.logical.ru.Regular(),
  });
  this.render(hbs`{{virtual-keyboard layout=layout}}`);
  const rows = await findAll(`.${styles.row}`);
  expect(rows.length).to.be.equal(5);
  const keyboard = await find(`.${styles.keyboard}`);
  const row1 = `Ё${commonRow1}`;
  const row2 = 'TabЙЦУКЕНГШЩЗХЪ\\';
  const row3 = 'Caps LockФЫВАПРОЛДЖЭEnter';
  const row4 = 'ShiftЯЧСМИТЬБЮ.Shift';
  expect(keyboard.textContent)
    .to.be.equal(row1 + row2 + row3 + row4 + commonRow5);
});
