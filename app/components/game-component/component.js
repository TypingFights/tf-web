import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';
import { set } from '@ember/object';
import { computed } from 'ember-decorators/object';
import { gt, alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';
import { tagName } from 'ember-decorators/component';
import { task, timeout } from 'ember-concurrency';

@tagName('')
export default class GameComponent extends Component {
  @service gameSocket;
  @service gameInputEventBus;

  keyboardState = {};
  currentSymbolPosition = 0;
  currentWrongSymbolsNumber = 0;
  correctionsDoneNumber = 0;
  finished = false;

  @required
  @argument
  parameters;

  @required
  @argument
  ui;

  @gt('currentWrongSymbolsNumber', 0)
  hasError;

  @gt('secondsBeforeStart', 1)
  textHidden;

  @alias('parameters.text.length')
  textLength;

  @computed('currentSymbolPosition')
  get currentSymbol() {
    return this.get('parameters.text')[this.get('currentSymbolPosition')];
  }

  constructor(...args) {
    super(...args);
    this.get('gameCountdown').perform(this.get('parameters.timeout'));
    const eventBus = this.get('gameInputEventBus');
    eventBus.on('inputEvent', this, 'onInputEvent');
    eventBus.on('erase', this, 'onEraseEvent');
  }

  didDestroyElement() {
    const eventBus = this.get('gameInputEventBus');
    eventBus.off('inputEvent', this, 'onInputEvent');
    eventBus.off('erase', this, 'onEraseEvent');
  }

  gameCountdown = task(function* (seconds) {
    let countdown = set(this, 'secondsBeforeStart', seconds);
    while (countdown > 0) {
      yield timeout(1000);
      countdown = this.decrementProperty('secondsBeforeStart');
    }
    this.set('startTime', performance.now());
  });

  updateKeyboardState(message) {
    const field = `keyboardState.${message.code}`;
    if (message.type === 'keydown') {
      return this.set(field, 1);
    } else if (message.type === 'keypress') {
      return this.set(field, 2);
    }

    return this.set(field, 0);
  }

  processKeyCharacter(message) {
    if (this.get('hasError') || message.key !== this.get('currentSymbol')) {
      this.incrementProperty('currentWrongSymbolsNumber');
    } else {
      if (message.key === ' ') {
        this.get('gameInputEventBus').trigger('wordTyped');
      }

      if (this.get('currentSymbolPosition') === this.get('textLength') - 1) {
        this.setProperties({
          finished: true,
          totalTimeMilliseconds: performance.now() - this.get('startTime'),
        });
      }
      this.incrementProperty('currentSymbolPosition');
    }
  }

  onInputEvent(message) {
    if (message.printable) {
      this.processKeyCharacter(message);
    }
    this.updateKeyboardState(message);
    this.get('gameSocket').send(message);
  }

  onEraseEvent(message) {
    const difference = this.get('currentWrongSymbolsNumber') - message.length;
    if (difference >= 0) {
      this.decrementProperty('currentWrongSymbolsNumber', message.length);
    } else {
      this.set('currentWrongSymbolsNumber', 0);
      this.incrementProperty('currentSymbolPosition', difference);
    }
    this.incrementProperty('correctionsDoneNumber');
    this.get('gameSocket').send(message);
  }
}
