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

  expect(component.setProperties.bind(component, {
    nextSymbolPosition: 2,
    nextSymbol: '+',
  })).to.not.throw();
  expect(promptedState.Numpad1).to.be.false;
  expect(promptedState.Numpad2).to.be.false;
  expect(promptedState.Backspace).to.be.false;
});

test('it should prompt a key combination properly', function (expect) {
  const physicalLayout = new PhysicalNumpadLayout();
  const logicalLayout = new LogicalNumpadLayout();
  physicalLayout.defaultCharCodesMap[35] = 'Shift Numpad3';
  logicalLayout.charCodesMap[8470] = 35;
  const component = this.subject({
    layout: {
      physical: physicalLayout,
      logical: logicalLayout,
    },
  });
  component.setProperties({
    nextSymbolPosition: 0,
    nextSymbol: '#',
  });
  const promptedState = component.get('promptedState');
  expect(promptedState.Shift).to.be.true;
  expect(promptedState.Numpad3).to.be.true;
  component.setProperties({
    nextSymbolPosition: 1,
    nextSymbol: '1',
  });
  expect(promptedState.Shift).to.be.false;
  expect(promptedState.Numpad3).to.be.false;
  component.setProperties({
    nextSymbolPosition: 2,
    nextSymbol: '№',
  });
  expect(promptedState.Shift).to.be.true;
  expect(promptedState.Numpad3).to.be.true;
});
