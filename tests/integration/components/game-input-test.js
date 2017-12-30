import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import { find, triggerEvent, waitUntil } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';
import styles from '../../../components/game-input/styles';

moduleForComponent('game-input', 'Integration | Component | game input', {
  integration: true,
  beforeEach() {
    this.inject.service('game-input-event-bus', { as: 'gameInputEventBus' });
  },
});

test('it should not throw errors when created without arguments', function (expect) {
  expect(this.render.bind(this, hbs`{{game-input}}`)).to.not.throw();
});

test('it should send the `erase` events properly', async function (expect) {
  const eraseSpy = this.spy();
  const eventBus = this.get('gameInputEventBus');
  eventBus.on('erase', eraseSpy);
  this.render(hbs`{{game-input}}`);
  const input = await find('input');
  input.value = 'abcdef';
  await triggerEvent(input, 'input');
  input.value = 'abcde';
  await triggerEvent(input, 'input');
  expect(eraseSpy, 'Should send the `erase` event once')
    .to.have.been.calledWithExactly({ type: 'erase', length: 1 })
    .to.have.been.calledOnce;
  input.value = '';
  await triggerEvent(input, 'input');
  await triggerEvent(input, 'input');
  expect(eraseSpy, 'Should send the `erase` event once')
    .to.have.been.calledWithExactly({ type: 'erase', length: 5 })
    .to.have.been.calledTwice;
  eventBus.off('erase', eraseSpy);
});

test('it should send the `inputEvent` events properly', async function (expect) {
  const inputSpy = this.spy();
  const eventBus = this.get('gameInputEventBus');
  eventBus.on('inputEvent', inputSpy);
  this.render(hbs`{{game-input}}`);
  const input = await find('input');
  // FIXME: keyEvent helper can't set KeyboardEvent `code` property.
  await triggerEvent(input, 'keydown', { key: 'q', code: 'KeyQ' });
  await triggerEvent(input, 'keypress', { key: 'q', code: 'KeyQ' });
  await triggerEvent(input, 'keyup', { key: 'q', code: 'KeyQ' });
  await triggerEvent(input, 'keypress', { key: 'q', code: 'KeyQ', ctrlKey: true });
  await triggerEvent(input, 'keypress', { key: 'q', code: 'KeyQ', altKey: true });
  await triggerEvent(input, 'keypress', { key: 'q', code: 'KeyQ', metaKey: true });
  await triggerEvent(input, 'keypress', { key: 'Backspace', code: 'Backspace' });
  const spyCalls = inputSpy.getCalls();
  expect(spyCalls[0].args[0], 'Should send keydown event').to.be.deep.equal({
    type: 'keydown',
    key: 'q',
    code: 'KeyQ',
  });
  expect(spyCalls[1].args[0], 'Should send keypress event').to.be.deep.equal({
    type: 'keypress',
    key: 'q',
    code: 'KeyQ',
    printable: true,
  });
  expect(spyCalls[2].args[0], 'Should send keyup event').to.be.deep.equal({
    type: 'keyup',
    key: 'q',
    code: 'KeyQ',
  });
  const notPrintableKeyQ = {
    type: 'keypress',
    key: 'q',
    code: 'KeyQ',
    printable: false,
  };
  expect(spyCalls[3].args[0], 'Should send an event with ctrlKey')
    .to.be.deep.equal(notPrintableKeyQ);
  expect(spyCalls[4].args[0], 'Should send an event with altKey')
    .to.be.deep.equal(notPrintableKeyQ);
  expect(spyCalls[5].args[0], 'Should send an event with metaKey')
    .to.be.deep.equal(notPrintableKeyQ);
  expect(spyCalls[6].args[0], 'Should send the Backspace event').to.be.deep.equal({
    type: 'keypress',
    key: 'Backspace',
    code: 'Backspace',
    printable: false,
  });
  eventBus.off('inputEvent', inputSpy);
});

test('it should not send non-trusted events in production', async function (expect) {
  const inputSpy = this.spy();
  const eventBus = this.get('gameInputEventBus');
  eventBus.on('inputEvent', inputSpy);
  const configServiceMock = Service.extend({
    environment: 'production',
  });
  this.register('service:config', configServiceMock);
  this.render(hbs`{{game-input}}`);
  await triggerEvent('input', 'keypress', { key: 'q', code: 'KeyQ' });
  const clarification = 'Should not send the `inputEvent` event';
  expect(inputSpy, clarification).to.have.not.been.calledWithExactly({
    type: 'keypress',
    key: 'q',
    code: 'KeyQ',
    printable: true,
  });
  eventBus.off('inputEvent', inputSpy);
});

test('it should be disabled with the `disabled` argument', async function (expect) {
  this.set('disabled', true);
  this.render(hbs`{{game-input disabled=disabled}}`);
  const input = await find('input');
  expect(input.disabled, 'Should set the disabled attribute').to.be.true;
  this.set('disabled', false);
  expect(input.disabled, 'Should remove the disabled attribute').to.be.false;
});

test('it should be auto-focused with the `autofocus` argument', async function (expect) {
  this.set('disabled', true);
  this.render(hbs`{{game-input autofocus=true disabled=disabled}}`);
  let input = await find('input');
  const inputFocused = 'Focus should be on the input';
  const inputBlurred = 'Focus should not be on the input';
  expect(document.activeElement, inputBlurred).to.be.not.equal(input);
  this.set('disabled', false);
  expect(document.activeElement, inputFocused).to.be.equal(input);
  input.blur();
  // Wait for component rerender:
  await waitUntil(() => document.activeElement === input, {
    timeout: 100,
  });
  this.set('disabled', true);
  this.render(hbs`{{game-input autofocus=false disabled=disabled}}`);
  input = await find('input');
  expect(document.activeElement, inputBlurred).to.be.not.equal(input);
  this.set('disabled', false);
  expect(document.activeElement, inputBlurred).to.be.not.equal(input);
});

test('it should be cleared after the `wordTyped` event', async function (expect) {
  this.render(hbs`{{game-input clearOnSpace=true}}`);
  const input = await find('input');
  input.value = 'word ';
  await triggerEvent(input, 'input');
  expect(input.value).to.be.equal('word ');
  this.get('gameInputEventBus').trigger('wordTyped');
  await triggerEvent(input, 'input');
  expect(input.value).to.be.equal('');
});

test('it should unsubscribe from the event bus properly', async function (expect) {
  const eventBus = this.get('gameInputEventBus');
  const spy = this.spy(eventBus, 'off');
  this.render(hbs`{{game-input}}`);
  this.clearRender();
  const clarification = 'Should unsubscribe from the `wordTyped` event';
  expect(spy, clarification).to.have.been.calledWith('wordTyped');
});

test('it should send onblur/onfocus events properly', async function (expect) {
  const inputSpy = this.spy();
  const eventBus = this.get('gameInputEventBus');
  eventBus.on('inputEvent', inputSpy);
  this.render(hbs`{{game-input}}`);
  const input = await find('input');
  input.focus();
  expect(inputSpy, 'Should send the focus event once')
    .to.have.been.calledWithExactly({ type: 'focus', code: undefined, key: undefined })
    .to.have.been.calledOnce;
  input.blur();
  expect(inputSpy, 'Should send the blur event once')
    .to.have.been.calledWithExactly({ type: 'blur', code: undefined, key: undefined })
    .to.have.been.calledTwice;
  eventBus.off('inputEvent', inputSpy);
});

test('it should set an error css class properly', async function (expect) {
  this.set('hasError', true);
  this.render(hbs`{{game-input error=hasError}}`);
  const input = await find('input');
  expect(input.className, 'Should set the error class').to.be.equal(styles.hasError);
  this.set('hasError', false);
  expect(input.className, 'Should remove the error class').to.be.equal(styles.default);
});
