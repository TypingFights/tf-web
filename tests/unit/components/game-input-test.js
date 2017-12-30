import Ember from 'ember';
import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('game-input', 'Unit | Component | game input', {
  needs: ['helper:prevent-default', 'service:game-input-event-bus'],
  unit: true,
  beforeEach() {
    const configServiceMock = Ember.Service.extend({
      environment: 'test',
    });
    this.register('service:config', configServiceMock);
  },
});

test('it should prevent the default behaviour for some keyboard events', function (expect) {
  const component = this.subject();
  const events = [
    { key: 'Tab', code: 'Tab' },
    { key: 'ArrowLeft', code: 'ArrowLeft' },
    { key: 'ArrowRight', code: 'ArrowRight' },
    { key: 'ArrowUp', code: 'ArrowUp' },
    { key: 'Home', code: 'Home' },
    { key: 'End', code: 'End' },
    { key: 'z', code: 'KeyZ', ctrlKey: true },
  ];
  const clarifications = {
    Tab: 'Should prevent [Tab] key default behaviour',
    ArrowLeft: 'Should prevent [←] key default behaviour',
    ArrowRight: 'Should prevent [→] key default behaviour',
    ArrowUp: 'Should prevent [↑] key default behaviour',
    Home: 'Should prevent [Home] key default behaviour',
    End: 'Should prevent [End] key default behaviour',
    z: 'Should prevent [Ctrl] + [z] default behaviour',
  };
  events.forEach((eventParameters) => {
    const event = new KeyboardEvent('keypress', {
      key: eventParameters.key,
      code: eventParameters.code,
      ctrlKey: eventParameters.ctrlKey || false,
      cancelable: true,
    });
    component.get('processEvent').call(component, event);
    expect(event.defaultPrevented, clarifications[eventParameters.key]).to.be.true;
  });
});

test('it should prevent clipboard paste events', function (expect) {
  const component = this.subject();
  this.render();
  const event = new ClipboardEvent('paste', {
    dataType: 'text/plain',
    data: 'hello',
    cancelable: true,
  });
  component.element.querySelector('input').dispatchEvent(event);
  const clarification = 'Should call .preventDefault() on the paste event';
  expect(event.defaultPrevented, clarification).to.be.true;
});

test('it should prevent mousedown and contextmenu events', function (expect) {
  const component = this.subject();
  this.render();
  const input = component.element.querySelector('input');

  let event = new MouseEvent('mousedown', { cancelable: true });
  input.dispatchEvent(event);
  let clarification = 'Should call .preventDefault() on the mousedown event';
  expect(event.defaultPrevented, clarification).to.be.true;

  event = new MouseEvent('contextmenu', { cancelable: true });
  input.dispatchEvent(event);
  clarification = 'Should call .preventDefault() on the contextmenu event';
  expect(event.defaultPrevented, clarification).to.be.true;
});
