import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('speed', 'Integration | Helper | speed', {
  integration: true,
  beforeEach() {
    this.inject.service('i18n');
  },
});

test('Should return a wpm speed for the en locale', function (expect) {
  const i18n = this.get('i18n');
  i18n.set('locale', 'en');
  this.render(hbs`{{speed 200 23500}}`);
  const speed = (((200 / 23500) * 60e3) / 5).toFixed(0);
  const expectedString = `${speed}&nbsp;${i18n.t('game.speed.wpm')}`;
  expect(this._element.innerHTML).to.be.equal(expectedString);
});

test('Should return a cpm speed for the ru locale', function (expect) {
  const i18n = this.get('i18n');
  i18n.set('locale', 'ru');
  this.render(hbs`{{speed 200 23500}}`);
  const speed = ((200 / 23500) * 60e3).toFixed(0);
  const expectedString = `${speed}&nbsp;${i18n.t('game.speed.cpm')}`;
  expect(this._element.innerHTML).to.be.equal(expectedString);
});

