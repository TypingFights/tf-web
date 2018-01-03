import { moduleForComponent, test } from '../../helpers/qunit-wrapper';

moduleForComponent('game-text', 'Unit | Component | game text', {
  unit: true,
  beforeEach() {
    this.component = this.subject({ text: 'abc def ghi' });
  },
});

const symbols = ['a', 'b', 'c', ' ', 'd', 'e', 'f', ' ', 'g', 'h', 'i'];
const wordsBounds = [
  [0, 3],
  [3, 4],
  [4, 7],
  [7, 8],
  [8, 11],
];
const cursorData = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [3, 0],
  [4, 0],
  [4, 1],
  [4, 2],
];
const dataHashSlice = [
  {
    isActive: false,
    symbols: [
      {
        isActive: false,
        value: 'd',
      },
      {
        isActive: false,
        value: 'e',
      },
      {
        isActive: false,
        value: 'f',
      },
    ],
  },
  {
    isActive: false,
    symbols: [
      {
        isActive: false,
        value: ' ',
      },
    ],
  },
];

test('it should split the game text to symbols properly', function (expect) {
  expect(this.component.get('symbols')).to.be.deep.equal(symbols);
});

test('it should return correct words bounds', function (expect) {
  expect(this.component.get('wordsBounds')).to.be.deep.equal(wordsBounds);
});

test('it should return the correct cursor data', function (expect) {
  expect(this.component.get('cursorData')).to.be.deep.equal(cursorData);
});

test('it should return the correct cursor data', function (expect) {
  expect(this.component.get('cursorData')).to.be.deep.equal(cursorData);
});

test('it should create the data hash properly', function (expect) {
  expect(this.component.get('words').slice(2, 4)).to.be.deep.equal(dataHashSlice);
});
