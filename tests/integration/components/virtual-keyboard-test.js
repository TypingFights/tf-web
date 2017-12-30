import hbs from 'htmlbars-inline-precompile';
import { find, findAll } from 'ember-native-dom-helpers';
import styles from 'typing-fights/components/virtual-keyboard/styles';
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
