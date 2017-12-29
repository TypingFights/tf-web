import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import layouts from 'typing-fights/keyboards/layouts';

export default Route.extend({
  gameSocket: service(),

  beforeModel() {
    const promise = this.get('gameSocket').connect();
    return promise.then((socket) => {
      socket.on('close', this.onSocketClose, this);
    });
  },

  model() {
    const language = 'en';
    const userLayout = 'regular';
    /* eslint max-len: 0 */
    return {
      text: 'But his misery did not last long. Almost at once there came a bump, and then a second bump, and two children were standing before him. The wood in front of him had been quite empty a second before and he knew they had not come from behind his tree, for he would have heard them.',
      type: 'normal',
      language,
      layout: {
        physical: new layouts.physical.ANSI(),
        logical: new layouts.logical[language][userLayout](),
      },
      timeout: 5,
    };
  },

  onSocketClose(event) {
    if (!event.wasClean) {
      this.setError({
        type: 'WebSocket',
        code: event.code,
        reason: event.reason,
      });
    }
  },

  setError(error) {
    this.intermediateTransitionTo('application_error', error);
  },
});
