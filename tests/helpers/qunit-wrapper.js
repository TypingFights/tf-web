import sinonTest from 'ember-sinon-qunit/test-support/test';
import { withChai } from 'ember-cli-chai/qunit';

function test(name, wrapper) {
  return sinonTest(name, withChai(wrapper));
}

export {
  moduleForComponent,
  moduleForModel,
  moduleFor,
  module,
  skip,
  only,
  todo,
} from 'ember-qunit';

export { test };
