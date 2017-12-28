import { KeyboardLayoutMixin } from 'typing-fights/keyboards/layouts/base';
import { module as moduleFor } from 'qunit';
import { test } from '../../helpers/qunit-wrapper';

moduleFor('Unit | Class | keyboard layout mixin');

class A {
  static get charCodesMap() {
    return {};
  }
}

class B {
  static get labels() {
    return {};
  }
}

test('should not throw errors', (expect) => {
  let clarification = 'Should not throw an error on a class without `labels` property';
  expect(KeyboardLayoutMixin.bind(null, A), clarification).to.not.throw();
  clarification = 'Should not throw an error on a class without `charCodesMap` property';
  expect(KeyboardLayoutMixin.bind(null, B), clarification).to.not.throw();

  const MA = KeyboardLayoutMixin(A);
  const a = new MA();
  clarification = 'Should not throw an error on the `labels` getter call';
  expect(() => a.labels, clarification).to.not.throw();
  clarification = 'If not existed before, the `labels` getter should return {}';
  expect(a.labels, clarification).to.be.deep.equal({});

  const MB = KeyboardLayoutMixin(B);
  const b = new MB();
  clarification = 'Should not throw an error on the `charCodesMap` getter call';
  expect(() => b.charCodesMap, clarification).to.not.throw();
  clarification = 'If not existed before, the `charCodesMap` getter should return {}';
  expect(b.charCodesMap, clarification).to.be.deep.equal({});
});

test('should return a class with self-overwritting getters', (expect) => {
  const MA = KeyboardLayoutMixin(A);
  const a = new MA();
  let descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(a), 'labels');
  expect(typeof descriptor.get).to.be.equal('function');
  descriptor.get.call(a);
  descriptor = Object.getOwnPropertyDescriptor(a, 'labels');
  expect(typeof descriptor.get).to.be.equal('undefined');
  expect(descriptor.enumerable).to.be.true;
  expect(descriptor.value).to.be.deep.equal({});
});

test('should extend a chain of classes properly', (expect) => {
  class C extends KeyboardLayoutMixin(B) {
    ownLabels = {
      foo: 'bar',
    }
  }

  class D extends KeyboardLayoutMixin(C) {
    ownLabels = {
      baz: 'qux',
    }

    ownCharCodesMap = {
      1: 2,
    }
  }

  class E extends KeyboardLayoutMixin(D) {
    ownLabels = {
      foo: 'bar2',
    }

    ownCharCodesMap = {
      2: 3,
    }
  }

  const e = new E();
  expect(e.labels).to.be.deep.equal({
    foo: 'bar2',
    baz: 'qux',
  });
  expect(e.charCodesMap).to.be.deep.equal({
    1: 2,
    2: 3,
  });
});
