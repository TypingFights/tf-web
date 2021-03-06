import hbs from 'htmlbars-inline-precompile';
import { find } from 'ember-native-dom-helpers';
import styles from 'typing-fights/components/game-text/styles';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('game-text', 'Integration | Component | game text', {
  integration: true,
});

test('it should hide the game text properly', async function (expect) {
  const text = 'abc def';
  this.set('text', text);
  this.set('hidden', true);
  this.render(hbs`{{game-text text=text hidden=hidden}}`);
  let container = await find(`.${styles.default}`);
  expect(container.textContent).to.not.include(text);
  this.set('hidden', false);
  container = await find(`.${styles.default}`);
  expect(container.textContent.trim()).to.be.equal(text);
});

test('it should set the `lang` attribute properly', async function (expect) {
  this.set('language', 'en');
  this.render(hbs`{{game-text text='abc' language=language}}`);
  const container = await find(`.${styles.default}`);
  expect(container.getAttribute('lang')).to.be.equal('en');
  this.set('language', 'ru');
  expect(container.getAttribute('lang')).to.be.equal('ru');
});
