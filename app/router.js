import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

/* eslint array-callback-return: 0 */
Router.map(function () {
  this.route('game');
});

export default Router;
