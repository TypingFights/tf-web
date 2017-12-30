import { moduleForComponent, test } from '../../helpers/qunit-wrapper';
import {
  PhysicalNumpadLayout,
  LogicalNumpadLayout,
} from '../../helpers/virtual-keyboard-test';

moduleForComponent('virtual-keyboard', 'Unit | Component | virtual keyboard', {
  unit: true,
});

test('it should prompt a single key properly', function (expect) {
  const component = this.subject({
    layout: {
      physical: new PhysicalNumpadLayout(),
      logical: new LogicalNumpadLayout(),
    },
  });
  component.setProperties({
    nextSymbolPosition: 0,
    nextSymbol: '1',
  });
  const promptedState = component.get('promptedState');
  expect(promptedState.Numpad1).to.be.true;
  component.setProperties({
    nextSymbolPosition: 1,
    nextSymbol: '2',
    error: true,
  });
  expect(promptedState.Numpad1).to.be.false;
  expect(promptedState.Numpad2).to.be.false;
  expect(promptedState.Backspace).to.be.true;
  component.set('error', false);
  expect(promptedState.Backspace).to.be.false;
  expect(promptedState.Numpad2).to.be.true;
});
