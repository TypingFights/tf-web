import Service, { inject as service } from '@ember/service';
import { debug } from '@ember/debug';
import { defer, Promise } from 'rsvp';
import config from '../config/environment';

export default Service.extend({
  websockets: service(),
  socket: null,

  connect() {
    const deferred = defer();
    const socket = this.get('websockets').socketFor(config.APP.WS_URL);
    socket.on('open', this.onOpen.bind(this, deferred), this);
    socket.on('message', this.onMessage, this);
    socket.on('close', this.onClose.bind(this, deferred), this);
    socket.on('error', this.onError, this);
    this.set('socket', socket);
    return deferred.promise;
  },

  getInstance() {
    return this.get('socket');
  },

  send(message) {
    const socket = this.get('socket');
    if (socket.readyState() !== WebSocket.OPEN) {
      return debug('[gameSocketError] Socket is not ready.');
    }

    return socket.send(JSON.stringify(message));
  },

  onMessage(event) {
    debug(`[gameSocketMessage] ${event.data}`);
  },

  onOpen(promise = Promise) {
    promise.resolve(this.get('socket'));
    debug('[gameSocketOpen]');
  },

  onClose(promise = Promise, event) {
    promise.reject({
      type: 'WebSocket',
      code: event.code,
      reason: event.reason,
    });
    debug(`[gameSocketClose] #${event.code}: ${event.reason}`);
  },

  onError() {
    debug('[gameSocketError]');
  },
});
