import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';
import { required } from '@ember-decorators/argument/validation';
import { set } from '@ember/object';
import { computed } from 'ember-decorators/object';
import { className, classNames } from 'ember-decorators/component';
import styles from '../virtual-keyboard/styles';

@classNames(styles.key)
export default class VirtualKeyboardKeyComponent extends Component {
  @required
  @argument
  @type('string')
  code;

  @argument
  @type(optional('number'))
  state;

  @argument
  @type(optional('boolean'))
  prompted;

  @argument
  @type(optional('string'))
  text;

  @className
  @computed('state', 'prompted')
  get stateClassName() {
    const { state, prompted } = this.getProperties('state', 'prompted');

    let name = prompted ? styles.keyPrompted : '';
    if (state === 0) {
      name = styles.keyReleased;
    } else if (state === 1) {
      name = styles.keyDowned;
    } else if (state === 2) {
      name = styles.keyPressed;
    }

    return name;
  }

  @className
  @computed('code')
  get specialKeyClassName() {
    const code = this.get('code');
    const name = code[0].toLowerCase() + code.slice(1);
    if (name in styles) {
      return styles[name];
    }

    return false;
  }

  checkReleased() {
    if (this.get('state') === 0) {
      this.set('state', null);
    }
  }

  didInsertElement() {
    const handler = set(this, 'transitionHandler', this.checkReleased.bind(this));
    this.element.addEventListener('transitionend', handler);
    this.element.textContent = this.get('text');
  }

  willDestroyElement() {
    this.element.removeEventListener('transitionend', this.get('transitionHandler'));
  }
}
