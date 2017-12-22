import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

export default function (name, options = {}) {
  module(name, {
    beforeEach(...args) {
      this.application = startApp();
      return options.beforeEach ? options.beforeEach.apply(this, args) : resolve();
    },

    afterEach(...args) {
      const afterEach = options.afterEach && options.afterEach.apply(this, args);
      return resolve(afterEach).then(() => destroyApp(this.application));
    },
  });
}
