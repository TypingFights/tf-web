import Component from '@ember/component';
import { next } from '@ember/runloop';
import { argument } from '@ember-decorators/argument';
import { ClosureAction } from '@ember-decorators/argument/types';
import { type, unionOf } from '@ember-decorators/argument/type';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import styles from './styles';

export default class GameInputComponent extends Component {
  @service config;
  @service gameInputEventBus;

  @argument
  @type('object')
  preventKeys = {
    Tab: true,
    ArrowLeft: true,
    ArrowRight: true,
    ArrowDown: true,
    ArrowUp: true,
    Home: true,
    End: true,
  };

  @argument
  @type('boolean')
  disabled = false;

  @argument
  @type(unionOf('string', 'object'))
  disabledPlaceholder = '';

  @argument
  @type('boolean')
  error = false;

  @argument
  @type('boolean')
  autofocus = false;

  @argument
  @type('boolean')
  clearOnSpace = false;

  didInsertElement() {
    this.get('gameInputEventBus').on('wordTyped', this, 'onWordTyped');
    this.set('input', this.element.querySelector('input'));
  }

  didRender() {
    if (this.get('autofocus')) {
      this.get('input').focus();
    }
  }

  didDestroyElement() {
    this.get('gameInputEventBus').off('wordTyped', this, 'onWordTyped');
  }

  @computed('error')
  get className() {
    return this.get('error') ? styles.hasError : styles.default;
  }

  oldValueLength = 0;
  cleared = true;

  onWordTyped() {
    if (this.get('clearOnSpace')) {
      this.set('cleared', false);
    }
  }

  @action
  @type(ClosureAction)
  processEvent(event) {
    // Disable event.isTrusted check for testing environment:
    if (!event.isTrusted && this.get('config.environment') === 'production') {
      return false;
    }

    if (event.key in this.get('preventKeys')
        || (event.code === 'KeyZ' && event.ctrlKey)) {
      event.preventDefault();
    }

    const message = {
      type: event.type,
      key: event.key,
      code: event.code,
    };

    if (event.type === 'keypress') {
      // TODO: replace with the event.char check in the future.
      message.printable = event.key.length === 1 && !event.ctrlKey && !event.altKey
        && !event.metaKey;
    }

    return this.get('gameInputEventBus').trigger('inputEvent', message);
  }

  @action
  @type(ClosureAction)
  onInput(event) {
    let currentLength = event.target.value.length;
    if (!this.get('cleared')) {
      this.set('cleared', true);
      this.get('input').value = '';
      currentLength = 0;
    } else {
      const difference = this.get('oldValueLength') - currentLength;
      if (difference > 0) {
        this.get('gameInputEventBus').trigger('erase', {
          type: 'erase',
          length: difference,
        });
      }
    }

    this.set('oldValueLength', currentLength);
  }

  @action
  @type(ClosureAction)
  onBlur(event) {
    // onblur and onfocusout events are not cancelable:
    next(() => {
      if (this.get('autofocus')) {
        event.target.focus();
      }
    });
    this.actions.processEvent.call(this, event);
  }
}
