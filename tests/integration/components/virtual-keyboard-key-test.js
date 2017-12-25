import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import styles from 'typing-fights/components/virtual-keyboard/styles';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('virtual-keyboard-key', 'Integration | Component | virtual keyboard key', {
  integration: true,
});

test('it should throw an error if created without `code` argument', function (expect) {
  expect(this.render.bind(this, hbs`{{virtual-keyboard-key code='KeyQ'}}`)).to.not.throw();
  expect(this.render.bind(this, hbs`{{virtual-keyboard-key}}`)).to.throw();
});

test('it should set className properly with the `state` argument', async function (expect) {
  this.set('state', 1);
  this.render(hbs`{{virtual-keyboard-key code='KeyQ' state=state}}`);
  const key = await find(`.${styles.key}`);
  expect(key.classList.contains(styles.keyDowned)).to.be.true;
  expect(key.classList.contains(styles.keyPressed)).to.be.false;
  expect(key.classList.contains(styles.keyReleased)).to.be.false;
  this.set('state', 2);
  expect(key.classList.contains(styles.keyDowned)).to.be.false;
  expect(key.classList.contains(styles.keyPressed)).to.be.true;
  expect(key.classList.contains(styles.keyReleased)).to.be.false;
  this.set('state', 0);
  expect(key.classList.contains(styles.keyDowned)).to.be.false;
  expect(key.classList.contains(styles.keyPressed)).to.be.false;
  expect(key.classList.contains(styles.keyReleased)).to.be.true;
  this.set('state', null);
  expect(key.classList.contains(styles.keyDowned)).to.be.false;
  expect(key.classList.contains(styles.keyPressed)).to.be.false;
  expect(key.classList.contains(styles.keyReleased)).to.be.false;
});
